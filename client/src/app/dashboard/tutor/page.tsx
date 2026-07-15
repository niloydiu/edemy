'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen, Users, DollarSign, Star, Plus, ChevronRight,
  Calendar, Monitor, MapPin, Clock, Edit3, Trash2
} from 'lucide-react';

export default function TutorDashboard() {
  const { user, api } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [coursesRes, analyticsRes] = await Promise.all([
          api.get('/courses'),
          api.get(`/courses/analytics/${(user as any).id || (user as any).sub}`).catch(() => ({ data: null })),
        ]);
        const myCourses = (coursesRes.data || []).filter((c: any) =>
          c.educator === ((user as any).id || (user as any).sub)
        );
        setCourses(myCourses);
        setAnalytics(analyticsRes.data);

        // Build schedule from lessons
        const sched: any[] = [];
        myCourses.forEach((c: any) => {
          (c.lessons || []).forEach((l: any) => {
            if ((l.lessonType === 'online' || l.lessonType === 'offline') && l.timeSchedule) {
              sched.push({ ...l, courseTitle: c.courseTitle, courseId: c._id || c.id });
            }
          });
        });
        sched.sort((a, b) => new Date(a.timeSchedule).getTime() - new Date(b.timeSchedule).getTime());
        setSchedule(sched.slice(0, 5));
      } catch (err) {
        console.error('Failed to load tutor dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0);
  const totalEarnings = courses.reduce((sum, c) => sum + (Number(c.coursePrice) || 0) * (c.enrolledStudents?.length || 0), 0);
  const avgRating = analytics?.averageRating || '4.8';

  const handleDelete = async (courseId: string) => {
    if (!confirm('Delete this course blueprint?')) return;
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(prev => prev.filter(c => (c._id || c.id) !== courseId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 uppercase">Tutor Dashboard</h1>
            <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-wider">Manage your courses and live schedules</p>
          </div>
          <Link href="/dashboard/tutor/create-course" className="btn-primary uppercase text-xs font-bold tracking-wider">
            <Plus className="w-4 h-4" /> New Course
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: 'My Courses', value: courses.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { icon: Users, label: 'Total Students', value: totalStudents, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: DollarSign, label: 'Est. Earnings', value: `$${totalEarnings.toLocaleString()}`, color: 'text-amber-600', bg: 'bg-amber-50' },
            { icon: Star, label: 'Avg Rating', value: avgRating, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map(s => (
            <div key={s.label} className="card p-5 bg-white border border-slate-200 rounded-lg">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Courses */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">My Published Courses</h2>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card p-4 flex gap-4 animate-pulse bg-white border rounded-lg">
                    <div className="w-24 h-16 bg-slate-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="card p-10 text-center bg-white border rounded-lg">
                <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-900 mb-1">No courses yet</h3>
                <p className="text-slate-500 text-sm mb-4">Create your first course blueprint</p>
                <Link href="/dashboard/tutor/create-course" className="btn-primary text-xs uppercase font-bold tracking-wider">Create Course</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map(course => {
                  const courseId = course._id || course.id;
                  const students = course.enrolledStudents?.length || 0;
                  const avgR = course.ratings?.length
                    ? (course.ratings.reduce((a: number, r: any) => a + (Number(r.rating) || 0), 0) / course.ratings.length).toFixed(1)
                    : '4.8';

                  return (
                    <div key={courseId} className="card p-4 flex gap-4 items-start bg-white border rounded-lg">
                      <img
                        src={course.courseThumbnail || 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=200&h=112&fit=crop'}
                        alt={course.courseTitle}
                        className="w-28 h-16 object-cover rounded-lg flex-shrink-0 bg-slate-100 border"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=200&h=112&fit=crop';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{course.courseTitle}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {students}</span>
                          <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {avgR}</span>
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lessons?.length || 0} lessons</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Link href={`/dashboard/tutor/edit-course/${courseId}`}
                            className="btn-secondary text-xs py-1.5 px-3 font-bold uppercase tracking-wider">
                            <Edit3 className="w-3 h-3" /> Edit
                          </Link>
                          <button onClick={() => handleDelete(courseId)}
                            className="text-xs py-1.5 px-3 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider">
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                          <Link href={`/courses/${courseId}`}
                            className="text-xs py-1.5 px-3 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 font-bold uppercase tracking-wider">
                            View
                          </Link>
                        </div>
                      </div>
                      <span className={`badge ${course.isPublished ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'} text-[10px] font-bold px-2 py-0.5 border rounded flex-shrink-0 uppercase`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Schedule */}
          <div>
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Upcoming Sessions</h2>
            <div className="space-y-3">
              {schedule.length === 0 ? (
                <div className="card p-6 text-center bg-white border rounded-lg">
                  <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                  <p className="text-slate-500 text-xs font-bold uppercase">No upcoming sessions</p>
                </div>
              ) : schedule.map((s, i) => (
                <div key={i} className="card p-4 space-y-2 bg-white border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {s.lessonType === 'online'
                        ? <Monitor className="w-4 h-4 text-indigo-600" />
                        : <MapPin className="w-4 h-4 text-emerald-600" />}
                      <span className={`badge ${s.lessonType === 'online' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'} text-[10px] border px-2 py-0.5 rounded font-bold uppercase`}>
                        {s.lessonType}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{s.duration}min</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{s.lessonTitle}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{s.courseTitle}</p>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {s.timeSchedule ? new Date(s.timeSchedule).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                  </div>
                  {s.meetLink && (
                    <a href={s.meetLink} target="_blank" rel="noreferrer"
                      className="btn-primary text-xs py-1.5 w-full uppercase font-bold tracking-wider">
                      Join Meeting
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
