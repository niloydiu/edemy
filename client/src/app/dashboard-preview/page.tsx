'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, Clock, Award, Play, CheckCircle, ChevronRight,
  Square, CheckSquare, Sparkles, FileText, Info, Download, ExternalLink
} from 'lucide-react';

const SAMPLE_COURSES = [
  {
    id: 'preview_1',
    title: 'Advanced React Architecture & Bootcamps',
    category: 'Web Development',
    tutor: 'Sarah Chen (Google)',
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop',
    lessons: [
      { id: 'l1', title: 'Course Overview & Hydration Mechanics', type: 'video', duration: 15, videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0' },
      { id: 'l2', title: 'React Server Components deep-dive', type: 'video', duration: 25, videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0' },
      { id: 'l3', title: 'Optimal Caching & Data Mutation rules', type: 'pdf', duration: 10, pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { id: 'l4', title: 'Interactive QA with Instructors', type: 'online', duration: 60 }
    ]
  },
  {
    id: 'preview_2',
    title: 'Modern Data Engineering & Pipeline design',
    category: 'Data Science',
    tutor: 'Marcus Johnson (Netflix)',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    lessons: [
      { id: 'l5', title: 'Introduction to Data Warehouses', type: 'video', duration: 20, videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0' },
      { id: 'l6', title: 'Building DBT Transformations', type: 'pdf', duration: 15, pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ]
  }
];

export default function DashboardPreviewPage() {
  const [selectedCourse, setSelectedCourse] = useState(SAMPLE_COURSES[0]);
  const [selectedLesson, setSelectedLesson] = useState(SAMPLE_COURSES[0].lessons[0]);
  const [completedLessons, setCompletedLessons] = useState<string[]>(['l1']);

  const handleToggleComplete = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => prev.filter(id => id !== lessonId));
    } else {
      setCompletedLessons(prev => [...prev, lessonId]);
    }
  };

  const handleSelectCourse = (course: typeof SAMPLE_COURSES[0]) => {
    setSelectedCourse(course);
    setSelectedLesson(course.lessons[0]);
  };

  // Stats calculation
  const totalLessons = SAMPLE_COURSES.reduce((sum, c) => sum + c.lessons.length, 0);
  const lessonsCompletedCount = completedLessons.length;
  const progressPercent = Math.round((lessonsCompletedCount / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 pt-24 space-y-8">
        
        {/* Banner Alert explaining this is a preview */}
        <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-white text-lg">Interactive Dashboard Sandbox Preview</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">This is a live simulation of the Edemy platform learning dashboard. Click lessons, mark them complete, and test the tracker.</p>
            </div>
          </div>
          <Link href="/auth/login" className="btn-primary whitespace-nowrap">
            Create Real Account <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: 'Enrolled Preview Courses', value: SAMPLE_COURSES.length, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
            { icon: CheckCircle, label: 'Overall Completion', value: `${progressPercent}%`, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
            { icon: Play, label: 'Lessons Checked', value: `${lessonsCompletedCount}/${totalLessons}`, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20' },
            { icon: Award, label: 'Simulated Certificates', value: progressPercent === 100 ? '1 Obtained' : '0 Obtained', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/20' },
          ].map(s => (
            <div key={s.label} className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active Player and details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
              <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                {selectedLesson.type === 'video' ? (
                  <iframe
                    src="https://www.youtube.com/embed/Ke90Tje7VS0?autoplay=0"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="text-slate-400 p-8 text-center space-y-4">
                    <FileText className="w-16 h-16 text-indigo-500 mx-auto" />
                    <div>
                      <h4 className="font-bold text-white text-base">{selectedLesson.title}</h4>
                      <p className="text-xs text-slate-505 mt-1 uppercase font-semibold">Study guide document loaded in resources</p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                      <a
                        href={(selectedLesson as any).pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                        download
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700"
                      >
                        <Download className="w-4 h-4" /> Download Document
                      </a>
                      <a
                        href={(selectedLesson as any).pdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all"
                      >
                        <ExternalLink className="w-4 h-4" /> Open in Browser
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-5 bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest bg-indigo-950 border border-indigo-900 px-2.5 py-1 rounded">
                    Active Demo Lecture
                  </span>
                  <h3 className="font-extrabold text-lg mt-2 text-white">{selectedLesson.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Instructor: {selectedCourse.tutor} &bull; Duration: {selectedLesson.duration} mins
                  </p>
                </div>
                
                <button
                  onClick={() => handleToggleComplete(selectedLesson.id)}
                  className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${
                    completedLessons.includes(selectedLesson.id)
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700'
                  }`}
                >
                  {completedLessons.includes(selectedLesson.id) ? (
                    <><CheckSquare className="w-4 h-4" /> Completed</>
                  ) : (
                    <><Square className="w-4 h-4" /> Mark Complete</>
                  )}
                </button>
              </div>
            </div>

            {/* Course descriptions */}
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {selectedCourse.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-305 text-sm">
                This is a premium-designed course detailing architecture patterns, implementation rules, and production deployment scripts. Sign up to access full lifetime updates and interactive tutor Q&A.
              </p>
            </div>
          </div>

          {/* Sidebar Playlist */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Select Preview Course</h3>
              <div className="space-y-3">
                {SAMPLE_COURSES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCourse(c)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold flex gap-3 transition-colors cursor-pointer ${
                      selectedCourse.id === c.id
                        ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span className="truncate">{c.title}</span>
                  </button>
                ))}
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              <h3 className="font-bold text-slate-900 dark:text-white text-base">Syllabus Playlist</h3>
              <div className="space-y-3">
                {selectedCourse.lessons.map((lesson, idx) => {
                  const isDone = completedLessons.includes(lesson.id);
                  const isCur = selectedLesson.id === lesson.id;
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                        isCur
                          ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] text-slate-400 font-semibold">{idx + 1}</span>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{lesson.title}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleComplete(lesson.id);
                        }}
                        className={`text-slate-400 hover:text-indigo-600 cursor-pointer flex-shrink-0`}
                      >
                        {isDone ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
