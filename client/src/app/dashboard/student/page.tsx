'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Circle, Calendar, MapPin, Video, FileText, ArrowRight, ExternalLink, MessageCircle, Award } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const { api, user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  useEffect(() => {
    async function loadEnrolledCourses() {
      if (!user) return;
      try {
        const res = await api.get('/courses');
        // Filter courses where enrolledStudents contains user._id
        const enrolled = res.data.filter((c: any) => c.enrolledStudents?.includes(user._id));
        setCourses(enrolled);
        if (enrolled.length > 0) {
          setSelectedCourse(enrolled[0]);
        }
      } catch (err) {
        console.error('Failed to load student courses:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEnrolledCourses();
  }, [user]);

  useEffect(() => {
    async function loadProgress() {
      if (!selectedCourse || !user) return;
      try {
        const res = await api.get(`/courses/${selectedCourse._id}/progress`);
        setProgress(res.data);
        if (selectedCourse.lessons && selectedCourse.lessons.length > 0) {
          setSelectedLesson(selectedCourse.lessons[0]);
        } else {
          setSelectedLesson(null);
        }
      } catch (err) {
        console.error('Failed to load course progress:', err);
      }
    }
    loadProgress();
  }, [selectedCourse, user]);

  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    setQuizSelectedOption(null);
    setQuizChecked(false);
    setQuizPassed(false);
  }, [selectedLesson]);

  const toggleLessonCompletion = async (lessonId: string, currentCompleted: boolean) => {
    if (!selectedCourse) return;
    try {
      const res = await api.post(`/courses/${selectedCourse._id}/progress`, {
        lessonId,
        completed: !currentCompleted,
      });
      setProgress(res.data);
    } catch (err) {
      console.error('Failed to toggle lesson progress:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Course List */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 mb-4">
              Enrolled Courses
            </h3>
            
            {loading ? (
              <div className="text-xs text-slate-500 animate-pulse uppercase font-bold tracking-wider">
                Verifying enrollment list...
              </div>
            ) : courses.length === 0 ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  No courses purchased yet.
                </p>
                <Link
                  href="/courses"
                  className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded tracking-wider"
                >
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {courses.map((course) => {
                  const isActive = selectedCourse?._id === course._id;
                  return (
                    <button
                      key={course._id}
                      onClick={() => setSelectedCourse(course)}
                      className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <h4 className="text-sm font-bold truncate">
                        {course.courseTitle}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">
                        Instructor: Professor Tech
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Parental Status Details */}
          {user && user.parentId && (
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm bg-indigo-50/10">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Parent Account Linked
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Your profile is linked to parent terminal (ID: <span className="font-semibold text-slate-700">{user.parentId}</span>). Progress reports are automatically synced.
              </p>
            </div>
          )}
        </div>

        {/* Right Columns: Active Lesson Player Terminal */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCourse ? (
            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm space-y-6">
              
              {/* Course Header with Progress */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedCourse.courseTitle}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Academic Course | Instructor: Professor Tech
                  </p>
                </div>
                
                {progress && (
                  <div className="flex items-center gap-3">
                    {progress.completed && (
                      <button
                        onClick={() => setShowCertificate(true)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded shadow-sm cursor-pointer"
                      >
                        Claim Certificate
                      </button>
                    )}
                    <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg flex items-center gap-4">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Progress</div>
                        <div className="text-sm font-bold text-slate-700">
                          {progress.completedLessons?.length || 0} / {selectedCourse.lessons?.length || 0} Complete
                        </div>
                      </div>
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600"
                          style={{
                            width: `${
                              selectedCourse.lessons?.length
                                ? ((progress.completedLessons?.length || 0) / selectedCourse.lessons.length) * 100
                                : 0
                             }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Course Content Player */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Lesson List Column */}
                <div className="space-y-2 md:border-r md:border-slate-100 md:pr-6">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                    Lessons List
                  </h3>
                  {selectedCourse.lessons?.map((lesson: any, index: number) => {
                    const isCompleted = progress?.completedLessons?.includes(lesson.lessonId);
                    const isSelected = selectedLesson?.lessonId === lesson.lessonId;
                    return (
                      <button
                        key={lesson.lessonId}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full text-left p-3 rounded-lg flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 text-indigo-700 font-bold'
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <span className="truncate pr-2">
                          {index + 1}. {lesson.lessonTitle}
                        </span>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Lesson Detail / Player Column */}
                <div className="md:col-span-2 space-y-6">
                  {selectedLesson ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                          <h4 className="text-base font-bold text-slate-900">
                            {selectedLesson.lessonTitle}
                          </h4>
                          <span className="inline-block mt-1 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Type: {selectedLesson.lessonType}
                          </span>
                        </div>

                        {/* Interactive Message Button */}
                        <Link
                          href={`/chat?tutorId=${selectedCourse.educator}`}
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all"
                        >
                          <MessageCircle className="w-4 h-4" /> Ask Instructor
                        </Link>
                      </div>

                      {/* Lesson Dynamic Content Display */}
                      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
                        {selectedLesson.lessonType === 'pdf' && (
                          <div className="space-y-4 text-center py-6">
                            <FileText className="w-16 h-16 text-red-500 mx-auto" />
                            <p className="text-xs text-slate-600 font-semibold">PDF Reference Study Document is ready.</p>
                            <a
                              href={selectedLesson.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded text-xs font-bold hover:bg-slate-50 shadow-sm"
                            >
                              OPEN REFERENCE PDF <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        )}

                        {selectedLesson.lessonType === 'link' && (
                          <div className="space-y-4 text-center py-6">
                            <BookOpen className="w-16 h-16 text-blue-500 mx-auto" />
                            <p className="text-xs text-slate-600 font-semibold">External reference web URL provided.</p>
                            <a
                              href={selectedLesson.webLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded text-xs font-bold hover:bg-slate-50 shadow-sm"
                            >
                              LAUNCH WEB REFERENCE <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        )}

                        {selectedLesson.lessonType === 'online' && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Video className="w-10 h-10 text-indigo-600 animate-pulse" />
                              <div>
                                <h5 className="text-[10px] font-bold text-slate-400 uppercase">Live Stream Schedule</h5>
                                <p className="text-xs text-slate-700 font-bold">
                                  {selectedLesson.timeSchedule ? new Date(selectedLesson.timeSchedule).toLocaleString() : 'Not Scheduled'}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              This lesson is live stream-based. Access the official Google Meet room during the designated time.
                            </p>
                            <a
                              href={selectedLesson.meetLink || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded text-xs font-bold hover:bg-indigo-700 shadow-sm"
                            >
                              JOIN GOOGLE MEET ROOM <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        )}

                        {selectedLesson.lessonType === 'offline' && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <MapPin className="w-10 h-10 text-indigo-600" />
                              <div>
                                <h5 className="text-[10px] font-bold text-slate-400 uppercase">Offline Lab Address</h5>
                                <p className="text-xs text-slate-700 font-bold">
                                  {selectedLesson.locationDetails || 'Main Auditorium'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Calendar className="w-10 h-10 text-slate-400" />
                              <div>
                                <h5 className="text-[10px] font-bold text-slate-400 uppercase">Schedule Detail</h5>
                                <p className="text-xs text-slate-700 font-bold">
                                  {selectedLesson.timeSchedule ? new Date(selectedLesson.timeSchedule).toLocaleString() : 'Not Set'}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              This is an offline classroom session. Please attend in person at the location specified above.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Tutors Assigned details */}
                      {selectedLesson.tutors && selectedLesson.tutors.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                            Assigned Instructors
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedLesson.tutors.map((t: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-white border border-slate-200 p-3 rounded-lg flex items-center gap-3 shadow-sm"
                              >
                                <img
                                  src={t.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${t.name}`}
                                  alt={t.name}
                                  className="w-8 h-8 rounded-full border border-indigo-100"
                                />
                                <div>
                                  <div className="text-xs font-bold text-slate-800">{t.name}</div>
                                  <div className="text-[10px] text-slate-500">{t.email}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Quiz Verification Widget */}
                      {selectedLesson.quizQuestion && (
                        <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100 space-y-4">
                          <h5 className="text-xs font-bold uppercase text-indigo-700 tracking-wider flex items-center gap-1.5">
                            Quiz Progress Check
                          </h5>
                          <p className="text-xs text-slate-800 font-semibold">{selectedLesson.quizQuestion}</p>
                          <div className="space-y-2">
                            {selectedLesson.quizOptions?.map((option: string, oIdx: number) => {
                              const isSelected = quizSelectedOption === oIdx;
                              let btnClass = "w-full text-left p-3 rounded-lg text-xs transition-all border cursor-pointer ";
                              if (quizChecked) {
                                if (oIdx === selectedLesson.quizCorrectIndex) {
                                  btnClass += "bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold";
                                } else if (isSelected) {
                                  btnClass += "bg-red-50 border-red-200 text-red-600";
                                } else {
                                  btnClass += "bg-white border-slate-200 text-slate-400";
                                }
                              } else {
                                btnClass += isSelected 
                                  ? "bg-indigo-600 border-indigo-600 text-white font-semibold"
                                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300";
                              }
                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  disabled={quizChecked}
                                  onClick={() => setQuizSelectedOption(oIdx)}
                                  className={btnClass}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>

                          {!quizChecked ? (
                            <button
                              type="button"
                              disabled={quizSelectedOption === null}
                              onClick={() => {
                                  setQuizChecked(true);
                                  if (quizSelectedOption === selectedLesson.quizCorrectIndex) {
                                    setQuizPassed(true);
                                  }
                              }}
                              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold uppercase text-white rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                            >
                              Verify Answer
                            </button>
                          ) : (
                            <div className="flex justify-between items-center text-xs">
                              {quizPassed ? (
                                <span className="text-emerald-700 font-bold">✓ Response verified. Progression unlocked.</span>
                              ) : (
                                <span className="text-red-600 font-bold">✗ Incorrect answer. Please try again.</span>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setQuizSelectedOption(null);
                                  setQuizChecked(false);
                                  setQuizPassed(false);
                                }}
                                className="text-indigo-600 hover:underline font-bold uppercase tracking-wider text-[10px] cursor-pointer"
                              >
                                Retry Quiz
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Completion Toggle */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-semibold">
                          {selectedLesson.quizQuestion && !progress?.completedLessons?.includes(selectedLesson.lessonId) && !quizPassed 
                            ? 'Complete Quiz to evaluate' 
                            : 'Verify lesson to continue'}
                        </span>
                        <button
                          onClick={() =>
                            toggleLessonCompletion(
                              selectedLesson.lessonId,
                              progress?.completedLessons?.includes(selectedLesson.lessonId),
                            )
                          }
                          disabled={selectedLesson.quizQuestion && !progress?.completedLessons?.includes(selectedLesson.lessonId) && !quizPassed}
                          className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                            progress?.completedLessons?.includes(selectedLesson.lessonId)
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {progress?.completedLessons?.includes(selectedLesson.lessonId) ? (
                            <>
                              Completed <CheckCircle className="w-4 h-4 text-emerald-500" />
                            </>
                          ) : (
                            <>
                              Mark Completed <Circle className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-xs text-slate-400 font-bold uppercase">
                        Select a lesson to start learning
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-lg border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-400 font-bold uppercase">
                Please select a course to load the syllabus.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Certificate Modal */}
      {showCertificate && selectedCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl bg-white border-8 border-double border-amber-800 rounded-xl p-8 md:p-12 text-center space-y-6 shadow-2xl relative"
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowCertificate(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xs uppercase cursor-pointer"
              >
                Close [x]
              </button>
            </div>
            
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Award className="w-8 h-8 text-amber-700" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xs text-amber-700 font-bold uppercase tracking-widest font-mono">Certificate of Graduation</h3>
              <h2 className="text-3xl font-serif font-black text-slate-900">EDEMY</h2>
            </div>

            <div className="border-y border-slate-100 py-8 space-y-4">
              <p className="text-xs text-slate-400 italic">This is to verify that student</p>
              <h4 className="text-2xl font-bold text-indigo-700 font-serif">{user?.name}</h4>
              <p className="text-xs text-slate-400 italic">has successfully completed the complete requirements for</p>
              <h5 className="text-lg font-bold text-slate-900 uppercase font-sans">{selectedCourse.courseTitle}</h5>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>ISSUED BY: EDEMY EDUCATION</span>
              <span>VERIFICATION ID: #{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
