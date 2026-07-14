'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { BookOpen, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CoursesPage() {
  const { api } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase tracking-wider bg-gradient-to-r from-neonCyan to-neonPurple bg-clip-text text-transparent">
            Hybrid Catalog
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Choose from online streams, offline labs, PDF curricula, and link-based courses.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <span className="text-sm font-bold text-neonCyan animate-pulse uppercase tracking-widest">
              Scanning Database Indices...
            </span>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24 glassmorphic rounded border border-white/5">
            <p className="text-gray-500 font-bold uppercase tracking-widest">No active courses published in this sector.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, idx) => {
              // Calculate average ratings
              const avgRating = course.ratings?.length
                ? (course.ratings.reduce((acc: number, r: any) => acc + r.rating, 0) / course.ratings.length).toFixed(1)
                : '4.8';

              return (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glassmorphic glassmorphic-hover rounded-lg overflow-hidden flex flex-col border border-white/10"
                >
                  <div className="h-48 relative overflow-hidden bg-gray-900 border-b border-white/5">
                    <img
                      src={course.courseThumbnail || 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500'}
                      alt={course.courseTitle}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 border border-neonCyan/30 text-neonCyan px-2.5 py-1 rounded text-xs font-black tracking-widest">
                      ${course.coursePrice}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-neonCyan" />
                          {course.lessons?.length || 0} LESSONS
                        </span>
                        <span className="flex items-center gap-1 text-yellow-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {avgRating}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold uppercase tracking-wide text-white group-hover:text-neonCyan transition-all line-clamp-1">
                        {course.courseTitle}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {course.courseDescription}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                          T
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Assigned Tutor</span>
                      </div>

                      <Link
                        href={`/courses/${course._id}`}
                        className="px-3.5 py-1.5 bg-neonCyan/10 hover:bg-neonCyan text-neonCyan hover:text-black border border-neonCyan/20 hover:border-transparent text-xs font-black rounded transition-all uppercase tracking-widest"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
