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
    <nav className="glassmorphic sticky top-0 z-50 px-6 py-4 shadow-neonPurple/10 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-wider bg-gradient-to-r from-neonCyan via-neonPurple to-neonMagenta bg-clip-text text-transparent cyber-glow">
          <Shield className="w-8 h-8 text-neonCyan" />
          EDEMY.ADMIN
        </Link>

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
            <button
              onClick={handleDemoSwitch}
              className="px-4 py-2 bg-gradient-to-r from-neonCyan to-neonPurple text-black text-sm font-extrabold rounded-md shadow-neon transition-all hover:scale-105 duration-200 cursor-pointer"
            >
              INITIALIZE BYPASS
            </button>
          )}

          {/* Quick Demo Switcher Panel */}
          <div className="flex items-center gap-1 ml-4 bg-white/5 p-1 rounded-md border border-white/10">
            <button
              onClick={handleDemoSwitch}
              className="text-[10px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded transition-all font-bold flex items-center gap-1"
            >
              <KeyRound className="w-3.5 h-3.5" /> ADMIN BYPASS
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
