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
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <span className="text-sm font-bold text-indigo-600 animate-pulse uppercase tracking-wider">
            Loading course syllabus...
          </span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex-grow flex flex-col justify-center items-center gap-4">
          <p className="text-slate-500 font-bold uppercase tracking-wider">Course syllabus not found.</p>
        </div>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourses?.includes(course._id);
  const avgRating = course.ratings?.length
    ? (course.ratings.reduce((acc: number, r: any) => acc + r.rating, 0) / course.ratings.length).toFixed(1)
    : '4.8';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Course Info Column */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
              <span>Domain &bull; Professional Development</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {course.courseTitle}
            </h1>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed">
              {course.courseDescription}
            </p>
            <div className="flex items-center gap-6 pt-2">
              <span className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                <Star className="fill-current w-4 h-4" />
                {avgRating} ({course.ratings?.length || 0} Ratings)
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                Instructed by Professor Tech
              </span>
            </div>
          </motion.div>

          {/* Curriculum */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-3">
              Course Content
            </h2>

            <div className="space-y-4">
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson: any, index: number) => (
                  <div
                    key={lesson.lessonId}
                    className="bg-white p-5 rounded-lg flex items-start gap-4 border border-slate-200 hover:border-slate-300 transition-all shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      {index + 1}
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">
                          {lesson.lessonTitle}
                        </h4>
                        <span className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-600 font-bold uppercase tracking-wider">
                          {lesson.lessonType}
                        </span>
                      </div>

                      {/* Display Lesson Details */}
                      {lesson.lessonType === 'pdf' && (
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-red-500" /> Reference PDF Document
                        </p>
                      )}
                      {lesson.lessonType === 'link' && (
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-blue-500" /> Web Resource Link
                        </p>
                      )}
                      {lesson.lessonType === 'online' && (
                        <div className="space-y-1">
                          <p className="text-xs text-slate-600 flex items-center gap-1.5">
                            <Video className="w-3.5 h-3.5 text-cyan-600" /> Live Stream: Google Meet Room Included
                          </p>
                          {lesson.timeSchedule && (
                            <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                              <Calendar className="w-3 h-3" /> Scheduled: {new Date(lesson.timeSchedule).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}
                      {lesson.lessonType === 'offline' && (
                        <div className="space-y-1">
                          <p className="text-xs text-slate-600 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Physical Classroom: {lesson.locationDetails || 'Main Hall'}
                          </p>
                          {lesson.timeSchedule && (
                            <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                              <Calendar className="w-3 h-3" /> Scheduled: {new Date(lesson.timeSchedule).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Lesson Tutors */}
                      {lesson.tutors && lesson.tutors.length > 0 && (
                        <div className="pt-2 flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Instructors:</span>
                          <div className="flex gap-1.5">
                            {lesson.tutors.map((t: any, tid: number) => (
                              <span
                                key={tid}
                                className="text-[9px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-indigo-700 font-semibold uppercase"
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
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">No lessons uploaded yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Access Column */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-md space-y-6 sticky top-28"
          >
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={course.courseThumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'}
                alt={course.courseTitle}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-slate-900">${course.coursePrice}</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Full Lifetime access to syllabus resources
              </div>
            </div>

            {isEnrolled ? (
              <button
                onClick={() => router.push('/dashboard/student')}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-xs rounded-md shadow flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
              >
                Access Course Dashboard <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={isPurchasing}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-xs rounded-md shadow flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <CreditCard className="w-4 h-4" /> {isPurchasing ? 'Processing access...' : 'Buy Course Now'}
              </button>
            )}

            <div className="border-t border-slate-200 pt-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 uppercase tracking-wider font-bold">
                <span>Course details:</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-indigo-500" /> Fully secure payment verification
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" /> PDF study references included
                </li>
                <li className="flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-indigo-500" /> Live streams & local address details
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
