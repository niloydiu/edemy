'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, MapPin, Video, FileText, Star, CreditCard, ChevronRight, Lock, CheckSquare, Square, Play, Unlock } from 'lucide-react';

function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function CourseDetailsPageClient({ initialCourse }: { initialCourse: any }) {
  const { api, user, refreshProfile } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<any>(initialCourse);
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  // Interactive lesson states
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [updatingProgress, setUpdatingProgress] = useState<string | null>(null);

  const isEnrolled = user?.enrolledCourses?.includes(String(course.id)) || user?.enrolledCourses?.includes(String(course._id));

  // Determine if there is a preview lesson available
  const previewLesson = course.lessons?.find((l: any) => l.lessonType === 'video' || l.videoUrl);

  const loadProgress = useCallback(async () => {
    if (isEnrolled && user) {
      try {
        const pRes = await api.get(`/courses/${course.id || course._id}/progress`);
        setProgress(pRes.data);
      } catch (err) {
        console.error('Failed to load progress:', err);
      }
    }
  }, [isEnrolled, user, api, course.id, course._id]);

  useEffect(() => {
    loadProgress();
    // Auto-select first lesson for preview or if enrolled
    if (isEnrolled && course.lessons && course.lessons.length > 0) {
      setSelectedLesson(course.lessons[0]);
    } else if (!isEnrolled && previewLesson) {
      setSelectedLesson(previewLesson);
    }
  }, [isEnrolled, course.lessons, previewLesson, loadProgress]);

  const handleEnroll = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setIsPurchasing(true);
    try {
      await api.post('/purchases', {
        courseId: course.id || course._id,
        amount: Number(course.coursePrice) || 99.99,
      });
      await refreshProfile();
      alert('Access Granted! Course enrolled successfully.');
      router.refresh();
    } catch (err) {
      console.error('Purchase failed:', err);
      alert('Failed to process purchase.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleToggleProgress = async (lessonId: string, currentCompleted: boolean) => {
    if (!user || !course) return;
    setUpdatingProgress(lessonId);
    try {
      const cid = course.id || course._id;
      const res = await api.post(`/courses/${cid}/progress`, {
        lessonId,
        completed: !currentCompleted,
      });
      setProgress(res.data);
    } catch (err) {
      console.error('Failed to update progress:', err);
    } finally {
      setUpdatingProgress(null);
    }
  };

  const ratings = Array.isArray(course.ratings) ? course.ratings : [];
  const avgRating = ratings.length
    ? (ratings.reduce((acc: number, r: any) => acc + (Number(r.rating) || 0), 0) / ratings.length).toFixed(1)
    : '4.8';

  const ytId = selectedLesson?.videoUrl ? getYouTubeId(selectedLesson.videoUrl) : null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-12 pt-24">
        {/* Course Info Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Lesson Player (For Enrolled OR Previewing) */}
          {selectedLesson && (isEnrolled || selectedLesson.lessonId === previewLesson?.lessonId) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800"
            >
              <div className="aspect-video w-full bg-black relative">
                {selectedLesson.videoUrl ? (
                  ytId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=0`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      src={selectedLesson.videoUrl}
                      controls
                      className="w-full h-full"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-4">
                    <Play className="w-16 h-16 text-indigo-500 opacity-60 animate-pulse" />
                    <div>
                      <h4 className="font-bold text-white text-base">{selectedLesson.lessonTitle}</h4>
                      <p className="text-xs text-slate-500 uppercase font-semibold mt-1">This lesson does not contain a video file.</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-5 bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest bg-indigo-950 border border-indigo-900 px-2.5 py-1 rounded">
                    {isEnrolled ? 'Active Lecture' : 'Public Preview Lecture'}
                  </span>
                  <h3 className="font-extrabold text-lg mt-2 text-white">{selectedLesson.lessonTitle}</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 capitalize">
                    Type: {selectedLesson.lessonType} &bull; Duration: {selectedLesson.duration || 0} mins
                  </p>
                </div>
                {isEnrolled && (
                  <div>
                    <button
                      onClick={() => handleToggleProgress(selectedLesson.lessonId, progress?.completedLessons?.includes(selectedLesson.lessonId))}
                      disabled={updatingProgress === selectedLesson.lessonId}
                      className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${
                        progress?.completedLessons?.includes(selectedLesson.lessonId)
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {progress?.completedLessons?.includes(selectedLesson.lessonId) ? (
                        <><CheckSquare className="w-4 h-4" /> Completed</>
                      ) : (
                        <><Square className="w-4 h-4" /> Mark Complete</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              <span>Domain &bull; {course.category || 'Professional Development'}</span>
              {course.institutionName && (
                <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                  {course.institutionName}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              {course.courseTitle}
            </h1>
            <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              {course.courseDescription}
            </p>
            <div className="flex items-center gap-6 pt-2">
              <span className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                <Star className="fill-current w-4 h-4" />
                {avgRating} ({ratings.length} Ratings)
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                Instructors: <Link href={`/instructors/educator_${course.educator}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">{course.tutorNames || 'Professor Tech'}</Link>
              </span>
            </div>
          </motion.div>

          {/* Curriculum */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
              Course Content
            </h2>

            <div className="space-y-4">
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson: any, index: number) => {
                  const isCompleted = progress?.completedLessons?.includes(lesson.lessonId);
                  const isSelected = selectedLesson?.lessonId === lesson.lessonId;
                  const isLessonPreview = lesson.lessonId === previewLesson?.lessonId;
                  const canAccess = isEnrolled || isLessonPreview;

                  return (
                    <div
                      key={lesson.lessonId}
                      onClick={() => canAccess && setSelectedLesson(lesson)}
                      className={`p-5 rounded-lg flex items-start gap-4 border transition-all shadow-sm ${
                        canAccess ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40' : 'opacity-75'
                      } ${
                        isSelected ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/10' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 flex-shrink-0">
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {lesson.lessonTitle}
                          </h4>
                          <div className="flex items-center gap-2">
                            {isLessonPreview && !isEnrolled && (
                              <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                <Unlock className="w-2.5 h-2.5" /> Preview
                              </span>
                            )}
                            {!canAccess && (
                              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" /> Locked
                              </span>
                            )}
                            <span className="text-[10px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider flex-shrink-0">
                              {lesson.lessonType}
                            </span>
                          </div>
                        </div>

                        {lesson.lessonType === 'pdf' && (
                          <p className="text-xs text-slate-500 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-red-500" /> Reference PDF Document</p>
                        )}
                        {lesson.lessonType === 'link' && (
                          <p className="text-xs text-slate-500 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-blue-500" /> Web Resource Link</p>
                        )}
                        {lesson.lessonType === 'online' && (
                          <div className="space-y-1">
                            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-cyan-600" /> Live Stream Included</p>
                            {lesson.timeSchedule && (
                              <p className="text-[10px] text-slate-500 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Scheduled: {new Date(lesson.timeSchedule).toLocaleString()}</p>
                            )}
                          </div>
                        )}
                        {lesson.lessonType === 'offline' && (
                          <div className="space-y-1">
                            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> Physical Classroom: {lesson.locationDetails || 'Main Hall'}</p>
                            {lesson.timeSchedule && (
                              <p className="text-[10px] text-slate-500 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Scheduled: {new Date(lesson.timeSchedule).toLocaleString()}</p>
                            )}
                          </div>
                        )}
                        {lesson.lessonType === 'video' && (
                          <p className="text-xs text-slate-500 flex items-center gap-1.5"><Play className="w-3.5 h-3.5 text-indigo-500" /> Video Lecture File</p>
                        )}
                      </div>

                      {isEnrolled && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleProgress(lesson.lessonId, isCompleted);
                          }}
                          className={`ml-4 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0 cursor-pointer ${
                            isCompleted ? 'text-emerald-500' : 'text-slate-300'
                          }`}
                        >
                          {isCompleted ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </button>
                      )}
                    </div>
                  );
                })
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
            className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6 sticky top-28"
          >
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <img
                src={course.courseThumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'}
                alt={course.courseTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500';
                }}
              />
            </div>

            {isEnrolled && progress && (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 rounded-lg space-y-2">
                <div className="flex justify-between text-xs font-bold text-indigo-950 dark:text-indigo-300 uppercase">
                  <span>Course Progress</span>
                  <span>{progress.completed ? '100' : Math.round((progress.completedLessons?.length || 0) / (course.lessons?.length || 1) * 100)}%</span>
                </div>
                <div className="w-full bg-indigo-200 dark:bg-indigo-950 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{ width: `${progress.completed ? 100 : Math.round((progress.completedLessons?.length || 0) / (course.lessons?.length || 1) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">${Number(course.coursePrice) || 0}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Full Lifetime access to syllabus resources
              </div>
            </div>

            {isEnrolled ? (
              <div className="space-y-2">
                <span className="w-full py-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-extrabold uppercase text-center text-xs rounded border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-2 shadow-sm">
                  Enrolled & Active
                </span>
                <button
                  onClick={() => router.push('/dashboard/student')}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-xs rounded shadow flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  Access Student Dashboard <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={isPurchasing}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-xs rounded-md shadow flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <CreditCard className="w-4 h-4" /> {isPurchasing ? 'Processing access...' : 'Buy Course Now'}
              </button>
            )}

            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider font-bold">
                <span>Course details:</span>
              </div>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
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
