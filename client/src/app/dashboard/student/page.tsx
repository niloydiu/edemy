'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen, Clock, Award, TrendingUp, Play, CheckCircle,
  BarChart2, ChevronRight, Star
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, api } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const res = await api.get('/courses');
        const allCourses = res.data;
        const enrolled = allCourses.filter((c: any) =>
          (c.enrolledStudents || []).includes((user as any).id || (user as any).sub)
        );
        setEnrolledCourses(enrolled);

        const progressData: Record<number, any> = {};
        for (const c of enrolled) {
          try {
            const pRes = await api.get(`/courses/${c._id || c.id}/progress`);
            progressData[c._id || c.id] = pRes.data;
          } catch {}
        }
        setProgress(progressData);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const completedCount = Object.values(progress).filter((p: any) => p?.completed).length;
  const totalLessonsCompleted = Object.values(progress).reduce((sum: number, p: any) => sum + (p?.completedLessons?.length || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Continue your learning journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: 'Enrolled Courses', value: enrolledCourses.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { icon: CheckCircle, label: 'Completed', value: completedCount, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { icon: Play, label: 'Lessons Done', value: totalLessonsCompleted, color: 'text-amber-600', bg: 'bg-amber-50' },
            { icon: Award, label: 'Certificates', value: completedCount, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map(s => (
            <div key={s.label} className="card p-5">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* My Courses */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-lg">My Courses</h2>
          <Link href="/courses" className="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1">
            Find more <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="bg-slate-200 aspect-video rounded-lg mb-3" />
                <div className="h-4 bg-slate-200 rounded mb-2" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="card p-12 text-center">
            <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="font-bold text-slate-900 mb-2">No courses yet</h3>
            <p className="text-slate-500 text-sm mb-6">Enroll in a course to start learning</p>
            <Link href="/courses" className="btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolledCourses.map(course => {
              const courseId = course._id || course.id;
              const prog = progress[courseId];
              const totalLessons = course.lessons?.length || 0;
              const completedLessons = prog?.completedLessons?.length || 0;
              const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

              return (
                <div key={courseId} className="card overflow-hidden group bg-white border border-slate-200 rounded-lg">
                  <div className="relative aspect-video bg-slate-100">
                    <img
                      src={course.courseThumbnail || 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop'}
                      alt={course.courseTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop';
                      }}
                    />
                    {prog?.completed && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Completed
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    {course.category && (
                      <span className="text-xs font-semibold text-indigo-600 uppercase">{course.category}</span>
                    )}
                    <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">{course.courseTitle}</h3>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span>{completedLessons}/{totalLessons} lessons</span>
                        <span className="font-semibold text-slate-700">{pct}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <Link
                      href={`/courses/${courseId}`}
                      className="btn-primary w-full text-sm"
                    >
                      {pct > 0 ? 'Continue Learning' : 'Start Course'} <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Discover section */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">Discover new courses</h3>
            <p className="text-indigo-100 text-sm mt-0.5">100+ expert-led courses available across 20+ subjects</p>
          </div>
          <Link href="/courses" className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors whitespace-nowrap text-sm">
            Browse All Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
