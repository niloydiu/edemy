'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraduationCap, User, Users, Shield, ArrowRight, Chrome } from 'lucide-react';

export default function LoginPage() {
  const { loginCustom, loginDemo } = useAuth();
  const router = useRouter();
  
  const [googleId, setGoogleId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'parent' | 'admin'>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleId || !email || !name) return;
    setIsSubmitting(true);
    try {
      await loginCustom(googleId, email, name, role);
      router.push(`/dashboard/${role === 'teacher' ? 'tutor' : role}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (selectedRole: 'student' | 'teacher' | 'parent' | 'admin') => {
    setIsSubmitting(true);
    try {
      await loginDemo(selectedRole);
      router.push(`/dashboard/${selectedRole === 'teacher' ? 'tutor' : selectedRole}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 p-8 md:p-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome to Edemy
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Sign in with a pre-seeded developer profile or custom credentials
            </p>
          </div>

          {/* Quick Demo Switcher Panel */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">
              Quick Connect Demo Accounts
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDemoLogin('student')}
                className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all font-semibold text-slate-700 text-sm justify-center cursor-pointer disabled:opacity-50"
              >
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                Student
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDemoLogin('teacher')}
                className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl hover:border-violet-300 hover:bg-violet-50/30 transition-all font-semibold text-slate-700 text-sm justify-center cursor-pointer disabled:opacity-50"
              >
                <User className="w-5 h-5 text-violet-600" />
                Tutor
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDemoLogin('parent')}
                className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-all font-semibold text-slate-700 text-sm justify-center cursor-pointer disabled:opacity-50"
              >
                <Users className="w-5 h-5 text-emerald-600" />
                Parent
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDemoLogin('admin')}
                className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl hover:border-amber-300 hover:bg-amber-50/30 transition-all font-semibold text-slate-700 text-sm justify-center cursor-pointer disabled:opacity-50"
              >
                <Shield className="w-5 h-5 text-amber-600" />
                Admin
              </button>
            </div>
          </div>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs font-medium uppercase">Or sign up manually</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Custom Google/Manual Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Google ID / Identity Token
              </label>
              <input
                type="text"
                required
                value={googleId}
                onChange={(e) => setGoogleId(e.target.value)}
                placeholder="google_1092834012"
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@gmail.com"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Thompson"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Role Select
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="input pr-10 appearance-none cursor-pointer"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Tutor / Instructor</option>
                  <option value="parent">Parent</option>
                  <option value="admin">Administrator</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
            >
              <Chrome className="w-4 h-4" />
              {isSubmitting ? 'Authenticating...' : 'Sign In / Sign Up with Google'}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
