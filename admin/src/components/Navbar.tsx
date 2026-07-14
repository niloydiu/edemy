'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Shield, LogOut, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout, loginDemo } = useAuth();
  const router = useRouter();

  const handleDemoSwitch = async () => {
    await loginDemo();
    router.push('/dashboard');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <Shield className="w-6 h-6 text-indigo-600" />
          <span>Edemy Admin Portal</span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                <img
                  src={user.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-5 h-5 rounded-full border border-slate-200"
                />
                <span className="text-xs font-semibold text-indigo-700 capitalize">{user.role}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="p-2 bg-slate-50 border border-slate-200 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-full transition-all cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleDemoSwitch}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
            >
              Demo Admin Login
            </button>
          )}

          {/* Quick Demo Switcher Panel */}
          <div className="flex items-center gap-1 ml-4 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <button
              onClick={handleDemoSwitch}
              className="text-[10px] bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded transition-all font-bold flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" /> Admin Bypass
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
