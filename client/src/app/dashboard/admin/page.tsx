'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Shield, ArrowUpRight } from 'lucide-react';

export default function AdminRedirectPage() {
  useEffect(() => {
    // Attempt automatic redirect to the new dedicated admin portal
    setTimeout(() => {
      window.location.href = 'http://localhost:3001';
    }, 3000);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow flex flex-col justify-center items-center p-6 text-center space-y-6">
        <div className="w-16 h-16 bg-neonCyan/10 border border-neonCyan/40 rounded-full flex items-center justify-center animate-pulse">
          <Shield className="w-8 h-8 text-neonCyan" />
        </div>
        <h2 className="text-xl font-black uppercase text-white tracking-widest">
          ADMIN PANEL MOVED
        </h2>
        <p className="text-xs text-gray-500 uppercase font-semibold max-w-md tracking-wider">
          The administration portal has been partitioned into a separate micro-frontend for security.
          You are being redirected to the new port:
        </p>
        <a
          href="http://localhost:3001"
          className="px-6 py-3 bg-white/5 border border-white/10 hover:border-neonCyan hover:text-neonCyan rounded font-black text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all"
        >
          Open admin.edemy (Port 3001) <ArrowUpRight className="w-4 h-4" />
        </a>
      </main>
    </div>
  );
}
