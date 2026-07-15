import React from 'react';
import { GraduationCap, BookOpen, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex flex-col justify-center items-center p-4">
      {/* Outer pulsing ring */}
      <div className="relative flex items-center justify-center w-32 h-32 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping duration-1000"></div>
        <div className="absolute inset-2 rounded-full border border-indigo-400/30 animate-pulse"></div>
        
        {/* Glowing glass card */}
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/15 border border-indigo-500/30 backdrop-blur-lg flex items-center justify-center shadow-xl shadow-indigo-500/5">
          <GraduationCap className="w-12 h-12 text-indigo-400 animate-bounce" style={{ animationDuration: '2s' }} />
        </div>

        {/* Small floating accents */}
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center animate-spin" style={{ animationDuration: '6s' }}>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="absolute -bottom-2 left-2 w-7 h-7 rounded-full bg-violet-500/20 border border-violet-400/40 flex items-center justify-center animate-pulse">
          <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-white text-base font-extrabold tracking-wider uppercase bg-gradient-to-r from-indigo-200 to-indigo-400 bg-clip-text text-transparent">
          Edemy Classroom
        </h3>
        <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase animate-pulse">
          Preparing your lessons...
        </p>
      </div>
    </div>
  );
}

