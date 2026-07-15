import React, { Suspense } from 'react';
import CoursesPageClient from './CoursesPageClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Courses — Ndemy hybrid learning platform',
  description: 'Browse our extensive library of live classes, offline workshops, and recorded video bootcamps. Filter by price, subject, level, duration, and ratings.',
};

async function getCourses() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${apiBase}/courses`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch courses server-side:', err);
    return [];
  }
}

export default async function CoursesPage() {
  const initialCourses = await getCourses();
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-indigo-650 rounded-full animate-spin"></div>
      </div>
    }>
      <CoursesPageClient initialCourses={initialCourses} />
    </Suspense>
  );
}

