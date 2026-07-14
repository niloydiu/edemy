'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Calendar, MapPin, Video, FileText, Users, Clock, Send, MessageSquare, Award, TrendingUp, DollarSign, Star } from 'lucide-react';
import Link from 'next/link';

export default function TutorDashboard() {
  const { api, user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New course form state
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [coursePrice, setCoursePrice] = useState('99.99');
  
  // New lesson form state
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonType, setLessonType] = useState<'pdf' | 'link' | 'online' | 'offline'>('pdf');
  const [pdfUrl, setPdfUrl] = useState('');
  const [webLink, setWebLink] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [timeSchedule, setTimeSchedule] = useState('');
  const [duration, setDuration] = useState('60');

  const [analytics, setAnalytics] = useState<any>(null);

  const loadTutorData = async () => {
    if (!user) return;
    try {
      const resCourses = await api.get('/courses');
      // Tutors see their published courses
      const owned = resCourses.data.filter((c: any) => c.educator === user._id);
      setCourses(owned);

      const resSchedule = await api.get('/courses/tutor/schedule');
      setSchedule(resSchedule.data);

      const resAnalytics = await api.get('/courses/tutor/analytics');
      setAnalytics(resAnalytics.data);
    } catch (err) {
      console.error('Failed to load tutor data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutorData();
  }, [user]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !courseDescription) return;
    setIsSubmitting(true);
    try {
      await api.post('/courses', {
        courseTitle,
        courseDescription,
        coursePrice: parseFloat(coursePrice),
        discount: 0,
        lessons: [],
      });
      setShowCourseForm(false);
      setCourseTitle('');
      setCourseDescription('');
      await loadTutorData();
    } catch (err) {
      console.error('Failed to create course:', err);
      alert('Error creating course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourseId || !lessonTitle) return;
    setIsSubmitting(true);
    try {
      const targetCourse = courses.find((c) => c._id === activeCourseId);
      const updatedLessons = [...(targetCourse.lessons || [])];
      
      const newLesson = {
        lessonId: 'lesson_' + Math.random().toString(36).substring(7),
        lessonTitle,
        lessonType,
        pdfUrl: lessonType === 'pdf' ? pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : undefined,
        webLink: lessonType === 'link' ? webLink : undefined,
        meetLink: lessonType === 'online' ? meetLink : undefined,
        locationDetails: lessonType === 'offline' ? locationDetails : undefined,
        timeSchedule: (lessonType === 'online' || lessonType === 'offline') ? new Date(timeSchedule) : undefined,
        tutors: [{ name: user?.name, email: user?.email, imageUrl: user?.imageUrl }],
        duration: parseInt(duration),
      };

      updatedLessons.push(newLesson);

      await api.put(`/courses/${activeCourseId}`, {
        lessons: updatedLessons,
      });

      setShowLessonForm(false);
      setLessonTitle('');
      setPdfUrl('');
      setWebLink('');
      setMeetLink('');
      setLocationDetails('');
      setTimeSchedule('');
      await loadTutorData();
    } catch (err) {
      console.error('Failed to add lesson:', err);
      alert('Error adding lesson.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tutor Info & Schedule */}
        <div className="space-y-6">
          {/* Analytics Panel */}
          {analytics && (
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" /> Teaching Analytics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">Total Students</div>
                  <div className="text-xl font-bold text-slate-800 mt-0.5">{analytics.totalStudents}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">Net Earnings</div>
                  <div className="text-xl font-bold text-slate-800 mt-0.5">${analytics.totalEarnings.toFixed(2)}</div>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center text-[10px] text-slate-600 font-bold">
                  <span>AVERAGE RATING</span>
                  <span className="text-amber-500 font-bold flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-current" /> {analytics.averageRating}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {analytics.ratingDistribution?.map((val: number, idx: number) => {
                    const stars = idx + 1;
                    const maxVal = Math.max(...analytics.ratingDistribution, 1);
                    const percent = Math.round((val / maxVal) * 100);
                    return (
                      <div key={idx} className="flex items-center justify-between text-[9px] text-slate-500">
                        <span className="w-6">{stars}★</span>
                        <div className="flex-1 mx-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="w-4 text-right">{val}</span>
                      </div>
                    );
                  }).reverse()}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 mb-4">
              Schedule & Agenda
            </h3>
            
            {loading ? (
              <div className="text-xs text-slate-400 animate-pulse font-bold uppercase tracking-wider">
                Loading class calendar...
              </div>
            ) : schedule.length === 0 ? (
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                No classes scheduled.
              </p>
            ) : (
              <div className="space-y-4">
                {schedule.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        item.lessonType === 'online' ? 'bg-cyan-50 border border-cyan-200 text-cyan-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                      }`}>
                        {item.lessonType} Class
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        <Clock className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                        {item.duration}m
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.lessonTitle}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate">Course: {item.courseTitle}</p>
                    
                    {item.lessonType === 'online' && (
                      <a
                        href={item.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[9px] text-indigo-600 underline font-bold flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5" /> Launch Meet Room
                      </a>
                    )}
                    {item.lessonType === 'offline' && (
                      <p className="text-[9px] text-emerald-700 font-bold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {item.locationDetails}
                      </p>
                    )}
                    <p className="text-[9px] text-slate-400">
                      Time: {new Date(item.timeSchedule).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Course Publishers & Lesson Addition */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section Header */}
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Course Manager
              </h2>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Deploy and update course outlines
              </p>
            </div>
            <button
              onClick={() => setShowCourseForm(!showCourseForm)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Course
            </button>
          </div>

          {/* New Course Form */}
          {showCourseForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleCreateCourse}
              className="bg-white p-6 rounded-lg border border-slate-200 space-y-4 shadow-sm"
            >
              <h4 className="text-sm font-bold text-slate-900">Configure New Course</h4>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="Futuristic Animation with GSAP"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Detailed layout of chapters..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCourseForm(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase cursor-pointer"
                >
                  Deploy Course
                </button>
              </div>
            </motion.form>
          )}

          {/* List of Published Courses */}
          {loading ? (
            <div className="text-xs text-slate-400 animate-pulse font-bold uppercase tracking-wider py-12">
              Scanning database records...
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-lg border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                You have not published any courses yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course._id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {course.courseTitle}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                        Students Enrolled: {course.enrolledStudents?.length || 0}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveCourseId(course._id);
                        setShowLessonForm(true);
                      }}
                      className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      + Add Lesson
                    </button>
                  </div>

                  {/* List course lessons */}
                  <div className="pl-4 border-l-2 border-slate-100 space-y-2">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Syllabus Lessons
                    </h5>
                    {course.lessons && course.lessons.length > 0 ? (
                      course.lessons.map((lesson: any, idx: number) => (
                        <div key={lesson.lessonId} className="flex justify-between items-center text-xs text-slate-600">
                          <span>{idx + 1}. {lesson.lessonTitle}</span>
                          <span className="text-[9px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-500 font-bold uppercase">
                            {lesson.lessonType}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-slate-400 font-bold uppercase">No lessons added to this course.</p>
                    )}
                  </div>

                  {/* Enrolled Students info panel */}
                  {course.enrolledStudents && course.enrolledStudents.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-indigo-600" /> Active Enrolled Students
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {course.enrolledStudents.map((sid: string) => (
                          <div key={sid} className="flex items-center gap-2 bg-slate-50 p-1 px-2.5 rounded-lg border border-slate-200">
                            <span className="text-[10px] font-semibold text-slate-600">Student ID: {sid}</span>
                            <Link href={`/chat?recipientId=${sid}`} className="text-indigo-600 hover:text-indigo-800 transition-all">
                              <MessageSquare className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Lesson Modal/Form */}
          {showLessonForm && activeCourseId && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
              <motion.form
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                onSubmit={handleAddLesson}
                className="w-full max-w-lg bg-white p-8 rounded-xl border border-slate-200 shadow-xl space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-900">Add Lesson to Course</h4>
                  <button
                    type="button"
                    onClick={() => setShowLessonForm(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="Framer Motion Layout Transitions"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                      Lesson Type
                    </label>
                    <select
                      value={lessonType}
                      onChange={(e) => setLessonType(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                    >
                      <option value="pdf">PDF Resource</option>
                      <option value="link">Web Reference Link</option>
                      <option value="online">Online stream (Google Meet)</option>
                      <option value="offline">Offline Lab (Location)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      required
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                {lessonType === 'pdf' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                      PDF Document URL
                    </label>
                    <input
                      type="url"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      placeholder="https://example.com/slide.pdf"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                )}

                {lessonType === 'link' && (
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                      Web Link URL
                    </label>
                    <input
                      type="url"
                      value={webLink}
                      onChange={(e) => setWebLink(e.target.value)}
                      placeholder="https://nextjs.org"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                )}

                {lessonType === 'online' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                        Meet Link URL
                      </label>
                      <input
                        type="url"
                        value={meetLink}
                        onChange={(e) => setMeetLink(e.target.value)}
                        placeholder="https://meet.google.com/abc"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                        Date & Time Schedule
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={timeSchedule}
                        onChange={(e) => setTimeSchedule(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                )}

                {lessonType === 'offline' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                        Physical Room / Location
                      </label>
                      <input
                        type="text"
                        value={locationDetails}
                        onChange={(e) => setLocationDetails(e.target.value)}
                        placeholder="Room 501, Silicon Tower"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                        Date & Time Schedule
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={timeSchedule}
                        onChange={(e) => setTimeSchedule(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase text-xs rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Deploy Lesson Module
                </button>
              </motion.form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
