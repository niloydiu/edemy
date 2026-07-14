'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Compass, BookOpen, MessageSquare, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80 },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 bg-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Structured Hybrid Learning Platform
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Learn without limits. Start your <span className="text-indigo-600">Edemy Journey</span>
            </h1>
            
            <p className="text-slate-600 md:text-lg max-w-xl leading-relaxed">
              Unlock a world of possibilities with PDF resources, live online streaming meetups, physical classroom sessions, and direct mentor guidance.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/courses"
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow transition-all flex items-center gap-2"
              >
                Explore Courses <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-3.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-md transition-all"
              >
                Join Student Portal
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-xl"></div>
            <div className="relative bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=150&auto=format&fit=crop&q=60"
                  alt="Students learning"
                  className="w-16 h-16 rounded-full border-2 border-indigo-500 object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Interactive Syllabus</h4>
                  <p className="text-xs text-slate-500">Live streams & physical classes</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Digital Classroom Meet</span>
                  <span className="text-indigo-600 font-bold">14:00 Today</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Structured Lesson PDF</span>
                  <span className="text-emerald-600 font-bold">Unlocked</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-slate-50 border-y border-slate-200 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl font-bold text-slate-900">Why choose Edemy?</h2>
              <p className="text-slate-600 text-sm">Our platform combines the best features of Coursera and Udemy to make learning interactive and manageable.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="clean-card p-8 bg-white space-y-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Compass className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Hybrid Classroom Formats</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Attend offline classes with physical location support, or online live streams using Google Meet, PDF materials, and direct links.
                </p>
              </div>

              <div className="clean-card p-8 bg-white space-y-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Direct Instructor Chat</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Chat directly with your course instructors in real-time. Discuss course materials, assignments, or ask general career questions.
                </p>
              </div>

              <div className="clean-card p-8 bg-white space-y-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Parental Progress Feed</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Parents can link accounts to inspect purchase history, check course completion ratios, and get audit updates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-indigo-600">12,000+</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-2">Active Students</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-indigo-600">180+</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-2">Certified Tutors</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-indigo-600">99.8%</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-2">Completion Rate</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-indigo-600">4.9/5</div>
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-2">Average Rating</div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-12 text-center text-xs text-slate-500 font-semibold uppercase tracking-wider">
        &copy; {new Date().getFullYear()} EDEMY Platforms. All rights reserved.
      </footer>
    </div>
  );
}
