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
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Course Catalog
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Choose from online live streams, offline class locations, structured PDFs, and web reference links.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <span className="text-sm font-bold text-indigo-600 animate-pulse uppercase tracking-wider">
              Querying educational records...
            </span>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24 bg-white border border-slate-200 rounded-lg">
            <p className="text-slate-500 font-bold uppercase tracking-wider">No active courses published yet.</p>
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
                  className="clean-card clean-card-hover overflow-hidden flex flex-col"
                >
                  <div className="h-48 relative overflow-hidden bg-slate-100 border-b border-slate-200">
                    <img
                      src={course.courseThumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'}
                      alt={course.courseTitle}
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-slate-900/90 text-white px-2.5 py-1 rounded text-xs font-bold shadow-sm">
                      ${course.coursePrice}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                          {course.lessons?.length || 0} Lessons
                        </span>
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {avgRating}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold tracking-tight text-slate-900 line-clamp-1">
                        {course.courseTitle}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {course.courseDescription}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase">
                          T
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Tutor Assigned</span>
                      </div>

                      <Link
                        href={`/courses/${course._id}`}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded transition-all tracking-wide"
                      >
                        View Syllabus
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
