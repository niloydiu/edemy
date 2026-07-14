'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, LogOut, MessageSquare, Shield, User as UserIcon, Users, Calendar, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout, loginDemo } = useAuth();
  const router = useRouter();

  const handleDemoSwitch = async (role: 'student' | 'teacher' | 'parent' | 'admin') => {
    if (role === 'admin') {
      window.location.href = 'http://localhost:3001';
      return;
    }
    await loginDemo(role);
    router.push(`/dashboard/${role === 'teacher' ? 'tutor' : role}`);
  };

  return (
    <nav className="glassmorphic sticky top-0 z-50 px-6 py-4 shadow-neonPurple/10 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-wider bg-gradient-to-r from-neonCyan via-neonPurple to-neonMagenta bg-clip-text text-transparent cyber-glow">
          <GraduationCap className="w-8 h-8 text-neonCyan" />
          EDEMY.OS
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/courses" className="text-gray-300 hover:text-neonCyan transition-all text-sm font-semibold tracking-wide">
            CATALOG
          </Link>
          {user && (
            <>
              {user.role === 'student' && (
                <Link href="/dashboard/student" className="text-gray-300 hover:text-neonCyan transition-all text-sm font-semibold tracking-wide flex items-center gap-1">
                  <Award className="w-4 h-4" /> STUDENT
                </Link>
              )}
              {user.role === 'teacher' && (
                <Link href="/dashboard/tutor" className="text-gray-300 hover:text-neonCyan transition-all text-sm font-semibold tracking-wide flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> TUTOR WORKSPACE
                </Link>
              )}
              {user.role === 'parent' && (
                <Link href="/dashboard/parent" className="text-gray-300 hover:text-neonCyan transition-all text-sm font-semibold tracking-wide flex items-center gap-1">
                  <Users className="w-4 h-4" /> PARENT PORTAL
                </Link>
              )}
              {user.role === 'admin' && (
                <a href="http://localhost:3001" className="text-gray-300 hover:text-neonCyan transition-all text-sm font-semibold tracking-wide flex items-center gap-1">
                  <Shield className="w-4 h-4" /> ADMIN PANEL
                </a>
              )}
              <Link href="/chat" className="text-gray-300 hover:text-neonCyan transition-all text-sm font-semibold tracking-wide flex items-center gap-1">
                <MessageSquare className="w-4 h-4" /> CHAT
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <img
                  src={user.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-6 h-6 rounded-full border border-neonCyan/50"
                />
                <span className="text-xs font-semibold text-neonCyan capitalize">{user.role}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-full transition-all cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-gradient-to-r from-neonCyan to-neonPurple text-black text-sm font-extrabold rounded-md shadow-neon transition-all hover:scale-105 duration-200"
            >
              ACCESS CORE
            </Link>
          )}

          {/* Quick Demo Switcher Panel */}
          <div className="flex items-center gap-1 ml-4 bg-white/5 p-1 rounded-md border border-white/10">
            <span className="text-[10px] text-gray-500 font-bold px-1 uppercase hidden lg:inline">Quick Link:</span>
            <button
              onClick={() => handleDemoSwitch('student')}
              className="text-[10px] bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded transition-all font-bold"
            >
              STUDENT
            </button>
            <button
              onClick={() => handleDemoSwitch('teacher')}
              className="text-[10px] bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded transition-all font-bold"
            >
              TUTOR
            </button>
            <button
              onClick={() => handleDemoSwitch('parent')}
              className="text-[10px] bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 px-2 py-0.5 rounded transition-all font-bold"
            >
              PARENT
            </button>
            <button
              onClick={() => handleDemoSwitch('admin')}
              className="text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded transition-all font-bold"
            >
              ADMIN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
