import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex flex-col justify-center items-center gap-4">
      <div className="w-14 h-14 border-4 border-slate-700 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-white text-xs font-black uppercase tracking-widest animate-pulse">Loading Edemy Platform...</p>
    </div>
  );
}
