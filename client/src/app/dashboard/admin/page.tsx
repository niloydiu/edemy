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
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-grow flex flex-col justify-center items-center p-6 text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-full flex items-center justify-center animate-pulse">
          <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-black uppercase text-slate-900 dark:text-white tracking-widest">
          ADMIN PANEL MOVED
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold max-w-md tracking-wider">
          The administration portal has been partitioned into a separate micro-frontend for security.
          You are being redirected to the new port:
        </p>
        <a
          href="http://localhost:3001"
          className="px-6 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-200 rounded font-black text-xs uppercase tracking-widest flex items-center gap-1.5 transition-all"
        >
          Open admin.edemy (Port 3001) <ArrowUpRight className="w-4 h-4" />
        </a>
      </main>
    </div>
  );
}
