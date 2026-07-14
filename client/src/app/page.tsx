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
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl flex flex-col items-center gap-6"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 bg-neonCyan/10 border border-neonCyan/30 text-neonCyan px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest animate-neon-pulse"
          >
            <Cpu className="w-4 h-4" /> Systems Operational: v4.2
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black leading-tight tracking-tight uppercase"
          >
            Empower Your Mind in the{' '}
            <span className="bg-gradient-to-r from-neonCyan via-neonPurple to-neonMagenta bg-clip-text text-transparent cyber-glow font-extrabold">
              Edemy Metaverse
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-gray-400 md:text-lg tracking-wide max-w-2xl"
          >
            Access interactive online & offline courses, track progression in real-time, message top-tier tutors, and connect parental terminals for continuous evaluation.
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4 mt-4">
            <Link
              href="/courses"
              className="px-8 py-4 bg-gradient-to-r from-neonCyan to-neonPurple hover:from-neonPurple hover:to-neonCyan text-black font-extrabold rounded-md shadow-neon flex items-center gap-2 transition-all hover:scale-105"
            >
              BROWSE CATALOG <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 glassmorphic hover:bg-white/5 border border-white/10 text-white font-extrabold rounded-md transition-all flex items-center gap-2"
            >
              INITIALIZE PORTAL
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-32"
        >
          <div className="glassmorphic glassmorphic-hover p-8 rounded-lg flex flex-col gap-4">
            <Compass className="w-12 h-12 text-neonCyan" />
            <h3 className="text-xl font-bold tracking-wider uppercase text-neonCyan">Hybrid Curriculums</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Take PDF reference courses, access web references, attend interactive online Google Meet streams or locate physical offline lab classes nearby.
            </p>
          </div>
          <div className="glassmorphic glassmorphic-hover p-8 rounded-lg flex flex-col gap-4">
            <MessageSquare className="w-12 h-12 text-neonPurple" />
            <h3 className="text-xl font-bold tracking-wider uppercase text-neonPurple">Active Tutor Chats</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connect directly with industry leading tutors in real-time. Tutors can view student logs and schedule classes seamlessly.
            </p>
          </div>
          <div className="glassmorphic glassmorphic-hover p-8 rounded-lg flex flex-col gap-4">
            <ShieldCheck className="w-12 h-12 text-neonMagenta" />
            <h3 className="text-xl font-bold tracking-wider uppercase text-neonMagenta">Parental Terminals</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Link parental accounts to student profiles, allowing instant visibility of child purchase histories and progress ratios.
            </p>
          </div>
        </motion.section>

        {/* Quick Stats */}
        <section className="w-full mt-32 border-y border-white/5 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-neonCyan cyber-glow">12,000+</div>
            <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-2">Active Students</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-neonPurple cyber-glow">180+</div>
            <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-2">Certified Tutors</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-neonMagenta cyber-glow">99.8%</div>
            <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-2">Completion Rate</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-yellow-400 cyber-glow">4.9/5</div>
            <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-2">Average Rating</div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-600 uppercase tracking-widest">
        &copy; {new Date().getFullYear()} EDEMY.OS. All neural interfaces reserved.
      </footer>
    </div>
  );
}
