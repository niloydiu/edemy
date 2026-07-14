'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, KeyRound, Lock, Cpu } from 'lucide-react';

export default function AdminLoginPage() {
  const { loginCustom, loginDemo, user } = useAuth();
  const router = useRouter();
  
  const [googleId, setGoogleId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/dashboard');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleId || !email || !name) return;
    setIsSubmitting(true);
    try {
      await loginCustom(googleId, email, name, 'admin');
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginDemo();
      router.push('/dashboard');
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
          className="w-full max-w-md glassmorphic p-8 md:p-10 rounded-lg border border-white/10"
        >
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-neonCyan/10 border border-neonCyan/40 rounded-full flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-neonCyan" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-neonCyan to-neonPurple bg-clip-text text-transparent">
              Admin Gateway
            </h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
              Sync administrative credentials
            </p>
          </div>

          <div className="mb-6 text-center">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleDemoLogin}
              className="w-full p-4 bg-cyan-950/20 hover:bg-cyan-900/40 text-cyan-400 border border-cyan-500/20 rounded-md text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4 animate-pulse" />
              <span>INITIALIZE ADMIN DEMO BYPASS</span>
            </button>
          </div>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-3 text-gray-600 text-[9px] font-bold uppercase tracking-widest">Or Google OAuth Link</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">
                Google Client ID
              </label>
              <input
                type="text"
                required
                value={googleId}
                onChange={(e) => setGoogleId(e.target.value)}
                placeholder="admin_oauth_key"
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-neonCyan"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@edemy.com"
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-neonCyan"
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Edemy Administrator"
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-neonCyan"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 bg-gradient-to-r from-neonCyan to-neonPurple text-black font-extrabold uppercase text-xs rounded hover:scale-[1.02] transition-all cursor-pointer"
            >
              Verify Portal Identity
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
