import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-[3px] border-slate-200 dark:border-slate-800" />
        <div className="absolute inset-0 rounded-full border-[3px] border-indigo-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 animate-pulse">
        Loading…
      </p>
    </div>
  );
}
