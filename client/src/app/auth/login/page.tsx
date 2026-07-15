'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraduationCap, User, Users, Shield, ArrowRight, Chrome, Mail, Lock, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const { loginEmail, registerEmail, loginDemo } = useAuth();
  const router = useRouter();
  
  // Tabs: 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'parent' | 'admin'>('student');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Gate demo logins via env flag
  const enableDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO_LOGIN === 'true';

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (activeTab === 'signin') {
        await loginEmail(email, password);
      } else {
        await registerEmail(email, name, password, role);
      }
      // Redirect to correct dashboard based on role
      const userRole = activeTab === 'signup' ? role : JSON.parse(localStorage.getItem('edemy_user') || '{}').role || 'student';
      router.push(`/dashboard/${userRole === 'teacher' ? 'tutor' : userRole}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (selectedRole: 'student' | 'teacher' | 'parent' | 'admin') => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await loginDemo(selectedRole);
      router.push(`/dashboard/${selectedRole === 'teacher' ? 'tutor' : selectedRole}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed demo login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/60 dark:shadow-none p-8 md:p-10"
        >
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8">
            <button
              onClick={() => { setActiveTab('signin'); setErrorMsg(''); }}
              className={`flex-1 pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === 'signin'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setErrorMsg(''); }}
              className={`flex-1 pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === 'signup'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {activeTab === 'signin'
                ? 'Sign in to access your customized learning dashboards'
                : 'Join Edemy hybrid learning platform today'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleManualSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Thompson"
                    className="input pl-10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@student.com"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10"
                />
              </div>
            </div>

            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Register As
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="input pr-10 appearance-none cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
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
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                'Authenticating...'
              ) : activeTab === 'signin' ? (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Create Free Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher Panel - Gated */}
          {enableDemo && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4 text-center">
                Quick Connect Demo Accounts
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleDemoLogin('student')}
                  className="flex items-center gap-2 p-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all font-semibold text-slate-700 dark:text-slate-300 text-sm justify-center cursor-pointer disabled:opacity-50"
                >
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  Student
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleDemoLogin('teacher')}
                  className="flex items-center gap-2 p-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/30 dark:hover:bg-violet-950/20 transition-all font-semibold text-slate-700 dark:text-slate-300 text-sm justify-center cursor-pointer disabled:opacity-50"
                >
                  <User className="w-5 h-5 text-violet-600" />
                  Tutor
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleDemoLogin('parent')}
                  className="flex items-center gap-2 p-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all font-semibold text-slate-700 dark:text-slate-300 text-sm justify-center cursor-pointer disabled:opacity-50"
                >
                  <Users className="w-5 h-5 text-emerald-600" />
                  Parent
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleDemoLogin('admin')}
                  className="flex items-center gap-2 p-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 transition-all font-semibold text-slate-700 dark:text-slate-300 text-sm justify-center cursor-pointer disabled:opacity-50"
                >
                  <Shield className="w-5 h-5 text-amber-600" />
                  Admin
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
