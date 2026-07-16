'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Cpu, Mail, Lock, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const { loginEmail, loginDemo, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/dashboard');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await loginEmail(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
        err?.message ||
        'Authentication failed. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await loginDemo();
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMsg('Demo login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white p-8 md:p-10 rounded-xl border border-slate-200 shadow-lg"
        >
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Admin Gateway
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              Verify credentials to establish admin sync
            </p>
          </div>

          {/* Demo bypass */}
          <div className="mb-6">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleDemoLogin}
              className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Bypass &amp; Log In with Admin Account</span>
            </button>
          </div>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[9px] font-bold uppercase tracking-wider">Or sign in with credentials</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@edemy.com"
                  className="w-full bg-white border border-slate-200 rounded pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase text-xs rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Verify Portal Identity'}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
