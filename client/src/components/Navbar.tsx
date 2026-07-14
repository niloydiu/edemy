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
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-indigo-600 hover:opacity-90">
          <GraduationCap className="w-8 h-8 text-indigo-600" />
          EDEMY
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/courses" className="text-slate-600 hover:text-indigo-600 transition-all text-sm font-semibold tracking-wide">
            CATALOG
          </Link>
          {user && (
            <>
              {user.role === 'student' && (
                <Link href="/dashboard/student" className="text-slate-600 hover:text-indigo-600 transition-all text-sm font-semibold tracking-wide flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-500" /> Student Profile
                </Link>
              )}
              {user.role === 'teacher' && (
                <Link href="/dashboard/tutor" className="text-slate-600 hover:text-indigo-600 transition-all text-sm font-semibold tracking-wide flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-500" /> Instructor Panel
                </Link>
              )}
              {user.role === 'parent' && (
                <Link href="/dashboard/parent" className="text-slate-600 hover:text-indigo-600 transition-all text-sm font-semibold tracking-wide flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-500" /> Parent Portal
                </Link>
              )}
              {user.role === 'admin' && (
                <a href="http://localhost:3001" className="text-slate-600 hover:text-indigo-600 transition-all text-sm font-semibold tracking-wide flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-indigo-500" /> Admin
                </a>
              )}
              <Link href="/chat" className="text-slate-600 hover:text-indigo-600 transition-all text-sm font-semibold tracking-wide flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-500" /> Chat Messages
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                <img
                  src={user.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-6 h-6 rounded-full border border-indigo-100"
                />
                <span className="text-xs font-semibold text-slate-700 capitalize">{user.role}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-all cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-md shadow-sm transition-all duration-150"
            >
              Sign In
            </Link>
          )}

          {/* Quick Demo Switcher Panel */}
          <div className="flex items-center gap-1 ml-4 bg-slate-100 p-1 rounded-md border border-slate-200">
            <span className="text-[9px] text-slate-500 font-bold px-1.5 uppercase hidden lg:inline">Bypass Profile:</span>
            <button
              onClick={() => handleDemoSwitch('student')}
              className="text-[9px] bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-2 py-1 rounded transition-all font-bold"
            >
              Student
            </button>
            <button
              onClick={() => handleDemoSwitch('teacher')}
              className="text-[9px] bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-2 py-1 rounded transition-all font-bold"
            >
              Instructor
            </button>
            <button
              onClick={() => handleDemoSwitch('parent')}
              className="text-[9px] bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-2 py-1 rounded transition-all font-bold"
            >
              Parent
            </button>
            <button
              onClick={() => handleDemoSwitch('admin')}
              className="text-[9px] bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-2 py-1 rounded transition-all font-bold"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
