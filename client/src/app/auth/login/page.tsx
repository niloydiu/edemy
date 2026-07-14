'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, Compass, User, KeyRound, Globe, GraduationCap } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl glassmorphic p-8 md:p-12 rounded-lg border border-white/10"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black uppercase tracking-wider bg-gradient-to-r from-neonCyan via-neonPurple to-neonMagenta bg-clip-text text-transparent">
              Access Interface
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">
              Sync your neural credentials with edemy.os
            </p>
          </div>

          {/* Demo Login Grid */}
          <div className="mb-8">
            <label className="block text-[10px] text-gray-500 font-extrabold uppercase tracking-widest mb-3 text-center">
              Acknowledge & Connect with seeded profiles
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDemoLogin('student')}
                className="p-3 bg-cyan-950/20 hover:bg-cyan-900/40 text-cyan-400 border border-cyan-500/20 rounded-md text-xs font-bold transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
              >
                <GraduationCap className="w-5 h-5" />
                <span>STUDENT DEV</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDemoLogin('teacher')}
                className="p-3 bg-purple-950/20 hover:bg-purple-900/40 text-purple-400 border border-purple-500/20 rounded-md text-xs font-bold transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
              >
                <User className="w-5 h-5" />
                <span>TUTOR DEV</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDemoLogin('parent')}
                className="p-3 bg-pink-950/20 hover:bg-pink-900/40 text-pink-400 border border-pink-500/20 rounded-md text-xs font-bold transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
              >
                <Globe className="w-5 h-5" />
                <span>PARENT DEV</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDemoLogin('admin')}
                className="p-3 bg-amber-950/20 hover:bg-amber-900/40 text-amber-400 border border-amber-500/20 rounded-md text-xs font-bold transition-all text-center flex flex-col items-center gap-1 cursor-pointer"
              >
                <KeyRound className="w-5 h-5" />
                <span>ADMIN DEV</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-gray-600 text-[10px] font-bold uppercase tracking-widest">Or Custom google sign up</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* Custom Google/Manual Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1.5">
                Google ID / Auth Token
              </label>
              <input
                type="text"
                required
                value={googleId}
                onChange={(e) => setGoogleId(e.target.value)}
                placeholder="google_oauth_12345"
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neonCyan"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neonCyan"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neonCyan"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1.5">
                Access Tier Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-background border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neonCyan"
              >
                <option value="student">Student</option>
                <option value="teacher">Tutor / Teacher</option>
                <option value="parent">Parent</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 bg-gradient-to-r from-neonCyan via-neonPurple to-neonMagenta text-black font-extrabold uppercase tracking-wider text-xs rounded hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            >
              {isSubmitting ? 'Verifying Neural Pattern...' : 'Sync Oauth Google Identity'}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
