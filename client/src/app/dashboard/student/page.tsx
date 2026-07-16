'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen, CheckCircle, Award, Play, ChevronRight, Heart, AlertCircle,
  ChevronLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';

const PAGE_SIZE = 6;

function Pagination({
  page, totalPages, onPageChange,
}: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 pt-6">
      <button
        className="pagination-btn"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          className={`pagination-btn ${page === p ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        className="pagination-btn"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 90, damping: 16 } },
};

export default function StudentDashboard() {
  const { user, api, refreshProfile } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [wishlistedCourses, setWishlistedCourses] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'learning' | 'wishlist'>('learning');
  const [enrolledPage, setEnrolledPage] = useState(1);
  const [wishlistPage, setWishlistPage] = useState(1);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await api.get('/courses');
        const allCourses = res.data;

        const enrolled = allCourses.filter((c: any) =>
          (c.enrolledStudents || []).includes((user as any).id || (user as any).sub)
        );
        setEnrolledCourses(enrolled);

        const wish = allCourses.filter((c: any) =>
          user.wishlist?.includes(String(c._id || c.id))
        );
        setWishlistedCourses(wish);

        const progressData: Record<string, any> = {};
        await Promise.all(
          enrolled.map(async (c: any) => {
            try {
              const pRes = await api.get(`/courses/${c._id || c.id}/progress`);
              progressData[c._id || c.id] = pRes.data;
            } catch {
              // progress fetch failure is non-critical
            }
          })
        );
        setProgress(progressData);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err?.response?.data?.message || 'Failed to load dashboard data. Please refresh.');
      } finally {
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
    } catch (err: any) {
      setErrorMsg('Failed to remove from wishlist.');
      console.error(err);
    }
  };

  const completedCount = Object.values(progress).filter((p: any) => p?.completed).length;
  const totalLessonsCompleted = Object.values(progress).reduce(
    (sum: number, p: any) => sum + (p?.completedLessons?.length || 0), 0
  );

  const enrolledTotalPages = Math.max(1, Math.ceil(enrolledCourses.length / PAGE_SIZE));
  const wishlistTotalPages = Math.max(1, Math.ceil(wishlistedCourses.length / PAGE_SIZE));
  const paginatedEnrolled = useMemo(
    () => enrolledCourses.slice((enrolledPage - 1) * PAGE_SIZE, enrolledPage * PAGE_SIZE),
    [enrolledCourses, enrolledPage]
  );
  const paginatedWishlist = useMemo(
    () => wishlistedCourses.slice((wishlistPage - 1) * PAGE_SIZE, wishlistPage * PAGE_SIZE),
    [wishlistedCourses, wishlistPage]
  );

  const stats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: enrolledCourses.length, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
    { icon: CheckCircle, label: 'Completed', value: completedCount, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
    { icon: Play, label: 'Lessons Done', value: totalLessonsCompleted, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { icon: Award, label: 'Certificates', value: completedCount, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/20' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />
      <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Continue your learning journey</p>
        </motion.div>

        {/* Error banner */}
        {errorMsg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-banner mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          animate="show"
        >
          {stats.map(s => (
            <motion.div
              key={s.label}
              variants={cardVariants}
              className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
          {(['learning', 'wishlist'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-6 text-sm font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'learning'
                ? `My Courses (${enrolledCourses.length})`
                : `My Wishlist (${wishlistedCourses.length})`}
            </button>
          ))}
        </div>

        {/* My Courses tab */}
        {activeTab === 'learning' && (
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
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <BookOpen className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">No courses yet</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Enroll in a course to start learning</p>
                <Link href="/courses" className="btn-primary">Browse Courses</Link>
              </motion.div>
            ) : (
              <>
                <motion.div
                  key={`enrolled-page-${enrolledPage}`}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                  initial="hidden"
                  animate="show"
                >
                  {paginatedEnrolled.map(course => {
                    const courseId = course._id || course.id;
                    const prog = progress[courseId];
                    const totalLessons = course.lessons?.length || 0;
                    const completedLessons = prog?.completedLessons?.length || 0;
                    const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

                    return (
                      <motion.div
                        key={courseId}
                        variants={cardVariants}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        className="card overflow-hidden group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"
                      >
                        <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                          <img
                            src={course.courseThumbnail || 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop'}
                            alt={course.courseTitle}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop'; }}
                          />
                          {prog?.completed && (
                            <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              Completed
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-3">
                          {course.category && (
                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">{course.category}</span>
                          )}
                          <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2">{course.courseTitle}</h3>
                          <div>
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                              <span>{completedLessons}/{totalLessons} lessons</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">{pct}%</span>
                            </div>
                            <div className="progress-bar bg-slate-200 dark:bg-slate-800">
                              <div className="progress-fill" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                          <Link href={`/courses/${courseId}`} className="btn-primary w-full text-sm">
                            {pct > 0 ? 'Continue Learning' : 'Start Course'} <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
                <Pagination
                  page={enrolledPage}
                  totalPages={enrolledTotalPages}
                  onPageChange={p => { setEnrolledPage(p); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                />
              </>
            )}
          </div>
        )}

        {/* Wishlist tab */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistedCourses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <Heart className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Your wishlist is empty</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Explore subjects and save courses for later</p>
                <Link href="/courses" className="btn-primary">Browse Courses</Link>
              </motion.div>
            ) : (
              <>
                <motion.div
                  key={`wishlist-page-${wishlistPage}`}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                  initial="hidden"
                  animate="show"
                >
                  {paginatedWishlist.map(course => {
                    const courseId = course._id || course.id;
                    return (
                      <motion.div
                        key={courseId}
                        variants={cardVariants}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        className="card overflow-hidden group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                            <img
                              src={course.courseThumbnail || 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop'}
                              alt={course.courseTitle}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop'; }}
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
                          <Link href={`/courses/${courseId}`} className="btn-primary w-full text-sm">
                            View Details <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
                <Pagination
                  page={wishlistPage}
                  totalPages={wishlistTotalPages}
                  onPageChange={p => { setWishlistPage(p); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                />
              </>
            )}
          </div>
        )}

        {/* Discover Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <h3 className="font-bold text-lg">Discover new courses</h3>
            <p className="text-indigo-100 text-sm mt-0.5">100+ expert-led courses available across 20+ subjects</p>
          </div>
          <Link href="/courses" className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors whitespace-nowrap text-sm">
            Browse All Courses
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
