'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Upload, Trash, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditCoursePage() {
  const { api, user } = useAuth();
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseThumbnail, setCourseThumbnail] = useState('');
  const [coursePrice, setCoursePrice] = useState('99.99');
  const [courseDiscount, setCourseDiscount] = useState('0');
  const [courseCategory, setCourseCategory] = useState('Web Development');
  const [courseLevel, setCourseLevel] = useState('beginner');
  const [courseLanguage, setCourseLanguage] = useState('english');
  const [courseInstitution, setCourseInstitution] = useState('');
  const [courseTutors, setCourseTutors] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  
  const [courseLessons, setCourseLessons] = useState<any[]>([]);
  const [uploadingVideoId, setUploadingVideoId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCourse = useCallback(async () => {
    try {
      const res = await api.get(`/courses/${id}`);
      const c = res.data;
      
      // Verification: only authorized educator can edit
      if (user && c.educator !== ((user as any).id || (user as any).sub) && user.role !== 'admin') {
        alert('Unauthorized access to course editor');
        router.push('/dashboard/tutor');
        return;
      }
      
      setCourseTitle(c.courseTitle || '');
      setCourseDescription(c.courseDescription || '');
      setCourseThumbnail(c.courseThumbnail || '');
      setCoursePrice(String(Number(c.coursePrice) || 0));
      setCourseDiscount(String(Number(c.discount) || 0));
      setCourseCategory(c.category || 'Web Development');
      setCourseLevel(c.level || 'beginner');
      setCourseLanguage(c.language || 'english');
      setCourseInstitution(c.institutionName || '');
      setCourseTutors(c.tutorNames || '');
      setIsPublished(c.isPublished !== false);
      setCourseLessons(Array.isArray(c.lessons) ? c.lessons : []);
    } catch (err) {
      console.error(err);
      alert('Failed to load course blueprint.');
      router.push('/dashboard/tutor');
    } finally {
      setLoading(false);
    }
  }, [id, api, user, router]);

  useEffect(() => {
    if (id && user) {
      fetchCourse();
    }
  }, [id, user, fetchCourse]);

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = {
      courseTitle,
      courseDescription,
      courseThumbnail,
      coursePrice: parseFloat(coursePrice) || 0,
      discount: parseInt(courseDiscount) || 0,
      category: courseCategory,
      level: courseLevel,
      language: courseLanguage,
      institutionName: courseInstitution,
      tutorNames: courseTutors,
      isPublished,
      lessons: courseLessons.map((l, idx) => ({
        ...l,
        sortOrder: idx,
        lessonId: l.lessonId || `lesson_${Date.now()}_${idx}`,
      })),
    };
    try {
      await api.put(`/courses/${id}`, payload);
      alert('Course blueprint updated successfully!');
      router.push('/dashboard/tutor');
    } catch (err) {
      console.error(err);
      alert('Failed to update course.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLesson = () => {
    setCourseLessons(prev => [
      ...prev,
      {
        lessonId: `lesson_${Date.now()}`,
        lessonTitle: 'New Lesson',
        lessonType: 'video',
        videoUrl: '',
        pdfUrl: '',
        webLink: '',
        meetLink: '',
        locationDetails: '',
        timeSchedule: new Date().toISOString(),
        duration: 30,
      }
    ]);
  };

  const handleRemoveLesson = (idx: number) => {
    setCourseLessons(prev => prev.filter((_, i) => i !== idx));
  };

  const handleLessonChange = (idx: number, field: string, value: any) => {
    setCourseLessons(prev => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  };

  const handleVideoUpload = async (idx: number, file: File) => {
    const lesson = courseLessons[idx];
    setUploadingVideoId(lesson.lessonId);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/upload/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.url) {
        handleLessonChange(idx, 'videoUrl', res.data.url);
        alert('Video uploaded successfully!');
      } else {
        alert('Upload failed: No URL returned');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setUploadingVideoId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <span className="text-xs font-bold text-indigo-600 animate-pulse uppercase tracking-wider">Syncing Course Blueprints...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/tutor" className="p-2 bg-white rounded-lg border hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-700" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 uppercase">Edit Course Blueprint</h1>
            <p className="text-slate-500 text-xs mt-0.5 font-bold uppercase tracking-wider">Modify syllabus details and materials</p>
          </div>
        </div>

        <form onSubmit={handleSaveCourse} className="bg-white p-6 rounded-lg border border-slate-200 shadow-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Course Title</label>
              <input
                type="text"
                required
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Discount (%)</label>
              <input
                type="number"
                required
                value={courseDiscount}
                onChange={(e) => setCourseDiscount(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Category</label>
              <input
                type="text"
                required
                value={courseCategory}
                onChange={(e) => setCourseCategory(e.target.value)}
                placeholder="Web Development, Data Science etc."
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Level</label>
              <select
                value={courseLevel}
                onChange={(e) => setCourseLevel(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Language</label>
              <input
                type="text"
                required
                value={courseLanguage}
                onChange={(e) => setCourseLanguage(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Institution Publisher (Optional)</label>
              <input
                type="text"
                value={courseInstitution}
                onChange={(e) => setCourseInstitution(e.target.value)}
                placeholder="e.g. MIT, Google Academy"
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Tutors / Instructors (Comma separated)</label>
              <input
                type="text"
                value={courseTutors}
                onChange={(e) => setCourseTutors(e.target.value)}
                placeholder="e.g. Jane Doe, John Smith"
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Thumbnail Image URL</label>
              <input
                type="text"
                value={courseThumbnail}
                onChange={(e) => setCourseThumbnail(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="cursor-pointer"
            />
            <label htmlFor="isPublished" className="text-xs text-slate-700 font-bold uppercase cursor-pointer select-none">
              Publish Immediately
            </label>
          </div>

          {/* Lesson builder */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Lesson Syllabus ({courseLessons.length})</h5>
              <button
                type="button"
                onClick={handleAddLesson}
                className="px-3 py-1.5 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-[10px] font-bold uppercase cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Lesson
              </button>
            </div>

            <div className="space-y-4">
              {courseLessons.map((lesson, idx) => (
                <div key={lesson.lessonId || idx} className="bg-slate-50 p-4 border rounded-lg space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveLesson(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 border border-red-200 rounded hover:bg-red-100 cursor-pointer"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Lesson Title</label>
                      <input
                        type="text"
                        required
                        value={lesson.lessonTitle}
                        onChange={(e) => handleLessonChange(idx, 'lessonTitle', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Lesson Type</label>
                      <select
                        value={lesson.lessonType}
                        onChange={(e) => handleLessonChange(idx, 'lessonType', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                      >
                        <option value="video">Video Class</option>
                        <option value="pdf">Reference PDF</option>
                        <option value="link">Web Resource Link</option>
                        <option value="online">Live Online Session (Meet)</option>
                        <option value="offline">In-person Classroom (Workshop)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Duration (mins)</label>
                      <input
                        type="number"
                        required
                        value={lesson.duration}
                        onChange={(e) => handleLessonChange(idx, 'duration', parseInt(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Schedule</label>
                      <input
                        type="datetime-local"
                        value={lesson.timeSchedule ? new Date(lesson.timeSchedule).toISOString().substring(0, 16) : ''}
                        onChange={(e) => handleLessonChange(idx, 'timeSchedule', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Lesson-type specific fields */}
                  {lesson.lessonType === 'video' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-white p-3 border rounded">
                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">YouTube or Direct Video URL</label>
                        <input
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={lesson.videoUrl || ''}
                          onChange={(e) => handleLessonChange(idx, 'videoUrl', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Or Upload Local Video File</label>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleVideoUpload(idx, file);
                            }}
                            className="hidden"
                            id={`video-file-${idx}`}
                          />
                          <label
                            htmlFor={`video-file-${idx}`}
                            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 flex-1 justify-center"
                          >
                            <Upload className="w-4 h-4" />
                            {uploadingVideoId === lesson.lessonId ? 'Uploading...' : 'Upload Video File'}
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {lesson.lessonType === 'pdf' && (
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">PDF Document URL</label>
                      <input
                        type="text"
                        required
                        placeholder="https://example.com/syllabus.pdf"
                        value={lesson.pdfUrl || ''}
                        onChange={(e) => handleLessonChange(idx, 'pdfUrl', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  )}

                  {lesson.lessonType === 'link' && (
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Web Link URL</label>
                      <input
                        type="text"
                        required
                        placeholder="https://example.com"
                        value={lesson.webLink || ''}
                        onChange={(e) => handleLessonChange(idx, 'webLink', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  )}

                  {lesson.lessonType === 'online' && (
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Google Meet / Video Room Link</label>
                      <input
                        type="text"
                        required
                        placeholder="https://meet.google.com/abc-defg-hij"
                        value={lesson.meetLink || ''}
                        onChange={(e) => handleLessonChange(idx, 'meetLink', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  )}

                  {lesson.lessonType === 'offline' && (
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase mb-0.5">Location details (Workshops)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Room 402, Dhaka Center"
                        value={lesson.locationDetails || ''}
                        onChange={(e) => handleLessonChange(idx, 'locationDetails', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end border-t border-slate-100 pt-4">
            <Link
              href="/dashboard/tutor"
              className="px-4 py-2 border border-slate-200 rounded text-xs font-bold text-slate-500 hover:bg-slate-50 uppercase cursor-pointer"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Updating blueprint...' : 'Save Course Blueprint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
