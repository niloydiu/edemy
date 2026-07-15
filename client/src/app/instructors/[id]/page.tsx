'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Star, Clock, BookOpen, Users, Award, ShieldAlert, ArrowLeft, ChevronRight } from 'lucide-react';

export default function InstructorProfilePage() {
  const { id } = useParams();
  const { api } = useAuth();
  
  const [instructor, setInstructor] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Extract raw tutor ID from path (remove 'educator_' prefix if it exists)
  const educatorId = String(id).replace('educator_', '');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch educator info
        const userRes = await api.get(`/users/${educatorId}`);
        setInstructor(userRes.data);

        // Fetch courses and filter by educator
        const coursesRes = await api.get('/courses');
        const tutorCourses = coursesRes.data.filter((c: any) => String(c.educator) === educatorId);
        setCourses(tutorCourses);
      } catch (err) {
        console.error('Failed to load instructor profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [educatorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center">
        <Navbar />
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 animate-pulse uppercase tracking-wider">
          Loading Instructor Credentials...
        </span>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center gap-4">
        <Navbar />
        <ShieldAlert className="w-12 h-12 text-slate-400" />
        <p className="text-slate-500 font-bold uppercase tracking-wider">Instructor profile not found.</p>
        <Link href="/courses" className="btn-secondary">Browse All Courses</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 pt-24">
        {/* Back Link */}
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to courses
        </Link>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
          <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-800 flex-shrink-0">
            <img
              src={instructor.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${instructor.name}`}
              alt={instructor.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <span className="badge badge-primary bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 capitalize text-[10px] font-bold tracking-wider mb-2">
                Certified {instructor.role}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{instructor.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{instructor.email}</p>
            </div>

            <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed max-w-2xl">
              Professional instructor dedicated to delivering high-impact knowledge in modern technical fields. Leading live classes, offline hands-on workshops, and hybrid interactive learning syllabus sessions.
            </p>

            <div className="flex flex-wrap gap-6 justify-center md:justify-start pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>{courses.length} Active Courses</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                <Award className="w-4 h-4 text-indigo-500" />
                <span>Standard Verified Partner</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructor's Courses */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">Courses by {instructor.name}</h2>

          {courses.length === 0 ? (
            <div className="card p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">No courses currently scheduled for this instructor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => {
                const avgRating = course.ratings?.length
                  ? (course.ratings.reduce((acc: number, r: any) => acc + (Number(r.rating) || 0), 0) / course.ratings.length).toFixed(1)
                  : '4.8';
                const price = Number(course.coursePrice) || 0;
                const discount = Number(course.discount) || 0;
                const finalPrice = price * (1 - discount / 100);

                return (
                  <Link
                    key={course.id || course._id}
                    href={`/courses/${course.id || course._id}`}
                    className="course-card group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
                      <img
                        src={course.courseThumbnail || 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop'}
                        alt={course.courseTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop';
                        }}
                      />
                    </div>
                    <div className="p-4 flex-grow space-y-2">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{course.category}</span>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2">{course.courseTitle}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-700 dark:text-slate-350">{avgRating}</span>
                      </div>
                    </div>
                    <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-2">
                      <span className="font-extrabold text-slate-900 dark:text-white">${finalPrice.toFixed(2)}</span>
                      <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline flex items-center gap-0.5">Learn more <ChevronRight className="w-3.5 h-3.5" /></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
