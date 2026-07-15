'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen, Clock, Award, TrendingUp, Play, CheckCircle,
  BarChart2, ChevronRight, Star, Heart
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, api, refreshProfile } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [wishlistedCourses, setWishlistedCourses] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'learning' | 'wishlist'>('learning');

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const res = await api.get('/courses');
        const allCourses = res.data;
        
        // Enrolled
        const enrolled = allCourses.filter((c: any) =>
          (c.enrolledStudents || []).includes((user as any).id || (user as any).sub)
        );
        setEnrolledCourses(enrolled);

        // Wishlist
        const wish = allCourses.filter((c: any) =>
          user.wishlist?.includes(String(c._id || c.id))
        );
        setWishlistedCourses(wish);

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

  const handleRemoveWishlist = async (courseId: string) => {
    try {
      await api.post('/users/wishlist', { courseId });
      await refreshProfile();
      setWishlistedCourses(prev => prev.filter(c => String(c._id || c.id) !== courseId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  const completedCount = Object.values(progress).filter((p: any) => p?.completed).length;
  const totalLessonsCompleted = Object.values(progress).reduce((sum: number, p: any) => sum + (p?.completedLessons?.length || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />
      <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Continue your learning journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: 'Enrolled Courses', value: enrolledCourses.length, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
            { icon: CheckCircle, label: 'Completed', value: completedCount, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
            { icon: Play, label: 'Lessons Done', value: totalLessonsCompleted, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20' },
            { icon: Award, label: 'Certificates', value: completedCount, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/20' },
          ].map(s => (
            <div key={s.label} className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('learning')}
            className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeTab === 'learning'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            My Courses ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeTab === 'wishlist'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            My Wishlist ({wishlistedCourses.length})
          </button>
        </div>

        {activeTab === 'learning' ? (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card p-4 animate-pulse bg-white dark:bg-slate-900">
                    <div className="bg-slate-200 dark:bg-slate-800 aspect-video rounded-lg mb-3" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="card p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <BookOpen className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">No courses yet</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Enroll in a course to start learning</p>
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
                    <div key={courseId} className="card overflow-hidden group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                        <img
                          src={course.courseThumbnail || 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop'}
                          alt={course.courseTitle}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop';
                          }}
                        />
                        {prog?.completed && (
                          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                            Completed
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-3">
                        {course.category && (
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">{course.category}</span>
                        )}
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2">{course.courseTitle}</h3>

                        {/* Progress */}
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                            <span>{completedLessons}/{totalLessons} lessons</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{pct}%</span>
                          </div>
                          <div className="progress-bar bg-slate-200 dark:bg-slate-800">
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
          </div>
        ) : (
          <div>
            {wishlistedCourses.length === 0 ? (
              <div className="card p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Heart className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Your wishlist is empty</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Explore subjects and save courses for later</p>
                <Link href="/courses" className="btn-primary">Browse Courses</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {wishlistedCourses.map(course => {
                  const courseId = course._id || course.id;
                  return (
                    <div key={courseId} className="card overflow-hidden group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col justify-between">
                      <div>
                        <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                          <img
                            src={course.courseThumbnail || 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop'}
                            alt={course.courseTitle}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop';
                            }}
                          />
                          <button
                            onClick={() => handleRemoveWishlist(String(courseId))}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-slate-900/90 rounded-full hover:bg-red-50 text-red-500 shadow transition-colors cursor-pointer"
                            title="Remove from wishlist"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                        <div className="p-4 space-y-2">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{course.category}</span>
                          <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2">{course.courseTitle}</h3>
                        </div>
                      </div>
                      <div className="p-4 pt-0">
                        <Link
                          href={`/courses/${courseId}`}
                          className="btn-primary w-full text-sm"
                        >
                          View Details <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
