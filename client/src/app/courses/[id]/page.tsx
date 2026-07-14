'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, MapPin, Video, FileText, Star, CreditCard, ChevronRight, Lock } from 'lucide-react';

export default function CourseDetailsPage() {
  const { id } = useParams();
  const { api, user, refreshProfile } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error('Failed to load course:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setIsPurchasing(true);
    try {
      // Direct mock checkout API call
      await api.post('/purchases', {
        courseId: course._id,
        amount: course.coursePrice,
      });
      // Refresh profile to update enrolled courses list
      await refreshProfile();
      alert('Access Granted! Course enrolled successfully.');
      router.push('/dashboard/student');
    } catch (err) {
      console.error('Purchase failed:', err);
      alert('Failed to process purchase.');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <span className="text-sm font-bold text-neonCyan animate-pulse uppercase tracking-widest">
            Resolving Course Blueprint...
          </span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex flex-col justify-center items-center gap-4">
          <p className="text-gray-400 font-bold uppercase tracking-widest">Course blueprint not found.</p>
        </div>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourses?.includes(course._id);
  const avgRating = course.ratings?.length
    ? (course.ratings.reduce((acc: number, r: any) => acc + r.rating, 0) / course.ratings.length).toFixed(1)
    : '4.8';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Course Info Column */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-neonCyan uppercase tracking-widest">
              <span>Sector &bull; Web Engineering</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wide text-white leading-tight">
              {course.courseTitle}
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed tracking-wide">
              {course.courseDescription}
            </p>
            <div className="flex items-center gap-6 pt-2">
              <span className="flex items-center gap-1.5 text-yellow-400 font-bold text-sm">
                <Star className="fill-current w-4 h-4" />
                {avgRating} ({course.ratings?.length || 0} reviews)
              </span>
              <span className="text-gray-600">|</span>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                Created by Professor Tech
              </span>
            </div>
          </motion.div>

          {/* Curriculum */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-wider text-white border-b border-white/5 pb-3">
              Curriculum Core
            </h2>

            <div className="space-y-4">
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson: any, index: number) => (
                  <div
                    key={lesson.lessonId}
                    className="glassmorphic p-5 rounded-lg flex items-start gap-4 border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                      {index + 1}
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold uppercase tracking-wide text-white">
                          {lesson.lessonTitle}
                        </h4>
                        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 font-bold uppercase tracking-widest">
                          {lesson.lessonType}
                        </span>
                      </div>

                      {/* Display Lesson Details */}
                      {lesson.lessonType === 'pdf' && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-red-400" /> Reference PDF Document
                        </p>
                      )}
                      {lesson.lessonType === 'link' && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Web Resource Link
                        </p>
                      )}
                      {lesson.lessonType === 'online' && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Video className="w-3.5 h-3.5 text-cyan-400" /> Online Stream: Live Meet Link Included
                          </p>
                          {lesson.timeSchedule && (
                            <p className="text-[10px] text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Scheduled: {new Date(lesson.timeSchedule).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}
                      {lesson.lessonType === 'offline' && (
                        <div className="space-y-1">
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Offline Session: {lesson.locationDetails || 'Main Auditorium'}
                          </p>
                          {lesson.timeSchedule && (
                            <p className="text-[10px] text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Scheduled: {new Date(lesson.timeSchedule).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Lesson Tutors */}
                      {lesson.tutors && lesson.tutors.length > 0 && (
                        <div className="pt-2 flex items-center gap-2">
                          <span className="text-[10px] text-gray-500 font-bold uppercase">Tutors:</span>
                          <div className="flex gap-1.5">
                            {lesson.tutors.map((t: any, tid: number) => (
                              <span
                                key={tid}
                                className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-neonCyan font-bold uppercase"
                              >
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">No lessons uploaded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Access Column */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphic p-8 rounded-lg border border-white/10 shadow-neonCyan/5 shadow-xl space-y-6 sticky top-28"
          >
            <div className="aspect-video w-full rounded overflow-hidden bg-gray-900 border border-white/5">
              <img
                src={course.courseThumbnail || 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500'}
                alt={course.courseTitle}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-white">${course.coursePrice}</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                Lifetime Access to All Interactive Core Terminals
              </div>
            </div>

            {isEnrolled ? (
              <button
                onClick={() => router.push('/dashboard/student')}
                className="w-full py-4 bg-neonPurple text-black font-extrabold uppercase tracking-widest text-xs rounded-md shadow-neonPurple flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                ACCESS STUDENT TERMINAL <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={isPurchasing}
                className="w-full py-4 bg-gradient-to-r from-neonCyan to-neonPurple text-black font-extrabold uppercase tracking-widest text-xs rounded-md shadow-neon flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <CreditCard className="w-4 h-4" /> {isPurchasing ? 'processing access...' : 'ENROLL & UNLOCK ACCESS'}
              </button>
            )}

            <div className="border-t border-white/5 pt-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider font-bold">
                <span>Includes:</span>
              </div>
              <ul className="text-xs text-gray-500 space-y-2">
                <li className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-neonCyan" /> Fully secure access protocol
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-neonCyan" /> Downloadable PDF blueprints
                </li>
                <li className="flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-neonCyan" /> Live Google Meet integration
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
