import React from 'react';
import CoursesPageClient from './CoursesPageClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Courses — Edemy hybrid learning platform',
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
  return <CoursesPageClient initialCourses={initialCourses} />;
}
