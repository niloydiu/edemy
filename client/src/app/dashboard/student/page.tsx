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
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Course List */}
        <div className="space-y-6">
          <div className="glassmorphic p-6 rounded-lg border border-white/10">
            <h3 className="text-lg font-black uppercase tracking-wider text-neonCyan mb-4">
              Enrolled Curriculums
            </h3>
            
            {loading ? (
              <div className="text-xs text-gray-500 animate-pulse uppercase font-bold tracking-widest">
                Querying Registration Nodes...
              </div>
            ) : courses.length === 0 ? (
              <div className="space-y-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                  No courses purchased yet.
                </p>
                <Link
                  href="/courses"
                  className="inline-block px-4 py-2 bg-neonCyan text-black text-xs font-black rounded uppercase tracking-widest"
                >
                  Go to Catalog
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
                      className={`w-full text-left p-4 rounded border transition-all ${
                        isActive
                          ? 'bg-neonCyan/10 border-neonCyan'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <h4 className="text-sm font-bold uppercase text-white truncate">
                        {course.courseTitle}
                      </h4>
                      <p className="text-[10px] text-gray-500 uppercase font-semibold mt-1">
                        Professor Tech
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Parental Status Details */}
          {user && user.parentId && (
            <div className="glassmorphic p-6 rounded-lg border border-white/5 bg-pink-950/5">
              <h4 className="text-xs font-black text-pink-400 uppercase tracking-widest mb-2">
                Parental Terminal Connected
              </h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Your profile is linked to parent terminal (ID: <span className="font-bold text-gray-400">{user.parentId}</span>). Progress reports are automatically synced.
              </p>
            </div>
          )}
        </div>

        {/* Right Columns: Active Lesson Player Terminal */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCourse ? (
            <div className="glassmorphic p-8 rounded-lg border border-white/10 space-y-6">
              
              {/* Course Header with Progress */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-wider text-white">
                    {selectedCourse.courseTitle}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
                    Live Core System | Tutor: Professor Tech
                  </p>
                </div>
                
                {progress && (
                  <div className="flex items-center gap-3">
                    {progress.completed && (
                      <button
                        onClick={() => setShowCertificate(true)}
                        className="px-3.5 py-2 bg-gradient-to-r from-neonMagenta to-neonPurple hover:from-neonPurple hover:to-neonMagenta text-black text-xs font-black rounded uppercase tracking-widest animate-pulse shadow-neonMagenta/50 shadow-md cursor-pointer"
                      >
                        Certificate
                      </button>
                    )}
                    <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded flex items-center gap-4">
                      <div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Progress</div>
                        <div className="text-sm font-black text-neonCyan">
                          {progress.completedLessons?.length || 0} / {selectedCourse.lessons?.length || 0} Complete
                        </div>
                      </div>
                      <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-neonCyan"
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
                <div className="space-y-2.5 md:border-r md:border-white/5 md:pr-6">
                  <h3 className="text-xs font-black uppercase text-gray-500 tracking-wider mb-2">
                    Lessons Blueprint
                  </h3>
                  {selectedCourse.lessons?.map((lesson: any, index: number) => {
                    const isCompleted = progress?.completedLessons?.includes(lesson.lessonId);
                    const isSelected = selectedLesson?.lessonId === lesson.lessonId;
                    return (
                      <button
                        key={lesson.lessonId}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full text-left p-3 rounded flex items-center justify-between text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-white/10 text-neonCyan font-bold'
                            : 'hover:bg-white/5 text-gray-400'
                        }`}
                      >
                        <span className="truncate pr-2">
                          {index + 1}. {lesson.lessonTitle}
                        </span>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-neonCyan flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Lesson Detail / Player Column */}
                <div className="md:col-span-2 space-y-6">
                  {selectedLesson ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div>
                          <h4 className="text-lg font-black uppercase tracking-wide text-white">
                            {selectedLesson.lessonTitle}
                          </h4>
                          <span className="inline-block mt-1 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Type: {selectedLesson.lessonType}
                          </span>
                        </div>

                        {/* Interactive Message Button */}
                        <Link
                          href={`/chat?tutorId=${selectedCourse.educator}`}
                          className="p-2 bg-neonCyan/10 hover:bg-neonCyan text-neonCyan hover:text-black border border-neonCyan/20 rounded flex items-center gap-1.5 text-xs font-bold transition-all"
                        >
                          <MessageCircle className="w-4 h-4" /> Message Tutor
                        </Link>
                      </div>

                      {/* Lesson Dynamic Content Display */}
                      <div className="glassmorphic p-6 rounded-lg border border-white/5 space-y-4">
                        {selectedLesson.lessonType === 'pdf' && (
                          <div className="space-y-4 text-center py-6">
                            <FileText className="w-16 h-16 text-red-500 mx-auto" />
                            <p className="text-xs text-gray-400">PDF Reference Study Blueprint Ready.</p>
                            <a
                              href={selectedLesson.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs font-black uppercase tracking-widest hover:bg-red-500/30"
                            >
                              OPEN REFERENCE PDF <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        )}

                        {selectedLesson.lessonType === 'link' && (
                          <div className="space-y-4 text-center py-6">
                            <BookOpen className="w-16 h-16 text-blue-500 mx-auto" />
                            <p className="text-xs text-gray-400">External reference web URL provided.</p>
                            <a
                              href={selectedLesson.webLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs font-black uppercase tracking-widest hover:bg-blue-500/30"
                            >
                              LAUNCH WEB REFERENCE <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        )}

                        {selectedLesson.lessonType === 'online' && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Video className="w-10 h-10 text-cyan-400" />
                              <div>
                                <h5 className="text-xs font-black text-gray-400 uppercase">Online Stream Schedule</h5>
                                <p className="text-xs text-neonCyan font-semibold">
                                  {selectedLesson.timeSchedule ? new Date(selectedLesson.timeSchedule).toLocaleString() : 'Not Set'}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              This lesson is stream-based. Access the official platform Meet room during the designated time.
                            </p>
                            <a
                              href={selectedLesson.meetLink || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded text-xs font-black uppercase tracking-widest hover:bg-cyan-500/30"
                            >
                              JOIN GOOGLE MEET ROOM <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        )}

                        {selectedLesson.lessonType === 'offline' && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <MapPin className="w-10 h-10 text-emerald-400" />
                              <div>
                                <h5 className="text-xs font-black text-gray-400 uppercase">Offline Lab Location</h5>
                                <p className="text-xs text-emerald-400 font-semibold">
                                  {selectedLesson.locationDetails || 'Main Auditorium'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Calendar className="w-10 h-10 text-gray-500" />
                              <div>
                                <h5 className="text-xs font-black text-gray-400 uppercase">Schedule Detail</h5>
                                <p className="text-xs text-gray-300 font-semibold">
                                  {selectedLesson.timeSchedule ? new Date(selectedLesson.timeSchedule).toLocaleString() : 'Not Set'}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                              This is an offline session. Please make sure to be in attendance at the location details specified above.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Tutors Assigned details */}
                      {selectedLesson.tutors && selectedLesson.tutors.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-xs font-black uppercase text-gray-500 tracking-wider">
                            Assigned Tutors
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedLesson.tutors.map((t: any, idx: number) => (
                              <div
                                key={idx}
                                className="bg-white/5 border border-white/10 p-3 rounded flex items-center gap-3"
                              >
                                <img
                                  src={t.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${t.name}`}
                                  alt={t.name}
                                  className="w-8 h-8 rounded-full border border-neonCyan/30"
                                />
                                <div>
                                  <div className="text-xs font-bold text-white uppercase">{t.name}</div>
                                  <div className="text-[10px] text-gray-500">{t.email}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Quiz Verification Widget */}
                      {selectedLesson.quizQuestion && (
                        <div className="glassmorphic p-6 rounded-lg border border-white/10 space-y-4">
                          <h5 className="text-xs font-black uppercase text-neonCyan tracking-wider flex items-center gap-1.5">
                            Interactive Quiz Verification
                          </h5>
                          <p className="text-xs text-white font-bold">{selectedLesson.quizQuestion}</p>
                          <div className="space-y-2">
                            {selectedLesson.quizOptions?.map((option: string, oIdx: number) => {
                              const isSelected = quizSelectedOption === oIdx;
                              let btnClass = "w-full text-left p-3 rounded text-xs transition-all border ";
                              if (quizChecked) {
                                if (oIdx === selectedLesson.quizCorrectIndex) {
                                  btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold";
                                } else if (isSelected) {
                                  btnClass += "bg-red-500/20 border-red-500 text-red-400";
                                } else {
                                  btnClass += "bg-white/5 border-white/10 text-gray-500";
                                }
                              } else {
                                btnClass += isSelected 
                                  ? "bg-neonCyan/10 border-neonCyan text-neonCyan font-bold"
                                  : "bg-white/5 border-white/10 text-gray-300 hover:border-white/20";
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
                              className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase text-white rounded transition-all disabled:opacity-50"
                            >
                              Submit Verification Answer
                            </button>
                          ) : (
                            <div className="flex justify-between items-center text-xs">
                              {quizPassed ? (
                                <span className="text-emerald-400 font-bold">✓ Pattern Verified! Progress unlocked.</span>
                              ) : (
                                <span className="text-red-400 font-bold">✗ Pattern Failed. Please retry.</span>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setQuizSelectedOption(null);
                                  setQuizChecked(false);
                                  setQuizPassed(false);
                                }}
                                className="text-neonCyan hover:underline font-bold uppercase tracking-wider text-[10px]"
                              >
                                Retry Quiz
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Completion Toggle */}
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                          {selectedLesson.quizQuestion && !progress?.completedLessons?.includes(selectedLesson.lessonId) && !quizPassed 
                            ? 'Complete Quiz to Evaluate' 
                            : 'Confirm lesson evaluation'}
                        </span>
                        <button
                          onClick={() =>
                            toggleLessonCompletion(
                              selectedLesson.lessonId,
                              progress?.completedLessons?.includes(selectedLesson.lessonId),
                            )
                          }
                          disabled={selectedLesson.quizQuestion && !progress?.completedLessons?.includes(selectedLesson.lessonId) && !quizPassed}
                          className={`px-4 py-2 rounded text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                            progress?.completedLessons?.includes(selectedLesson.lessonId)
                              ? 'bg-neonCyan/20 text-neonCyan border-neonCyan/30'
                              : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                          }`}
                        >
                          {progress?.completedLessons?.includes(selectedLesson.lessonId) ? (
                            <>
                              Completed <CheckCircle className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              Mark As Completed <Circle className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                        Please select a lesson blueprint from the list to begin.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glassmorphic p-12 text-center rounded-lg border border-white/10">
              <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">
                Please select or purchase a course to operate the player.
              </p>
            </div>
          )}
        </div>
      </main>
      {/* Certificate Modal */}
      {showCertificate && selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-neonMagenta/40 rounded-xl p-8 text-center space-y-6 shadow-neonMagenta/20 shadow-2xl relative"
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowCertificate(false)}
                className="text-gray-500 hover:text-white font-bold text-xs uppercase cursor-pointer"
              >
                Close Terminal
              </button>
            </div>
            
            <div className="mx-auto w-16 h-16 rounded-full bg-neonMagenta/10 border border-neonMagenta flex items-center justify-center animate-pulse">
              <Award className="w-8 h-8 text-neonMagenta" />
            </div>

            <div className="space-y-1">
              <h3 className="text-[10px] text-neonMagenta font-black uppercase tracking-widest">Graduation Credential</h3>
              <h2 className="text-2xl font-black uppercase text-white tracking-wide">Edemy Metaverse Certification</h2>
            </div>

            <div className="border-y border-white/5 py-8 space-y-4">
              <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold">This is to verify that student node</p>
              <h4 className="text-2xl font-extrabold text-neonCyan uppercase tracking-wide">{user?.name}</h4>
              <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold">has successfully synthesized the core syllabus of</p>
              <h5 className="text-lg font-bold text-white uppercase">{selectedCourse.courseTitle}</h5>
            </div>

            <div className="flex justify-between items-center text-[9px] text-gray-600 font-mono">
              <span>DEPT: WEB METAVERSE</span>
              <span>HASH: SHA-256#0x{Math.random().toString(16).substring(2, 10).toUpperCase()}</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
