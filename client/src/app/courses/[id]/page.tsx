import React from 'react';
import CourseDetailsPageClient from './CourseDetailsPageClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getCourse(id: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://lms-backend-chi-orcin.vercel.app/api';
  try {
    const res = await fetch(`${apiBase}/courses/${id}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch course server-side:', err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const course = await getCourse(params.id);
  if (!course) {
    return {
      title: 'Course Not Found — Edemy',
      description: 'The requested course could not be located on Edemy.',
    };
  }
  return {
    title: `${course.courseTitle} — Edemy`,
    description: course.courseDescription || 'Join this hybrid course on Edemy to learn skills that matter.',
  };
}

export default async function CourseDetailsPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);
  return <CourseDetailsPageClient initialCourse={course} />;
}
