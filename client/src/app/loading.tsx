import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col justify-center items-center py-12 bg-slate-50 dark:bg-slate-955 transition-colors">
      <div className="relative w-12 h-12">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
        {/* Spinning Segment */}
        <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 animate-pulse uppercase">
        Loading...
      </p>
    </div>
  );
}
