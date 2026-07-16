import React, { Suspense } from 'react';
import CoursesPageClient from '../courses/CoursesPageClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Live Online Classes — Ndemy hybrid learning platform',
  description: 'Join real-time online classes with expert instructors via Google Meet. Interactive, recorded, and available on-demand.',
};

async function getCourses() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://lms-backend-chi-orcin.vercel.app/api';
  try {
    const res = await fetch(`${apiBase}/courses?type=online`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch courses server-side:', err);
    return [];
  }
}

export default async function LiveClassesPage() {
  const initialCourses = await getCourses();
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    }>
      <CoursesPageClient initialCourses={initialCourses} forceType="online" />
    </Suspense>
  );
}
