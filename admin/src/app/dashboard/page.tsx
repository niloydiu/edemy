'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Users, BookOpen, CreditCard, Trash2, Edit2, RefreshCw, Plus, Upload, Trash, Play, FileText, Link as LinkIcon, Video, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { api, user } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'purchases'>('users');
  const [loading, setLoading] = useState(true);

  // Entities state
  const [usersList, setUsersList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [purchasesList, setPurchasesList] = useState<any[]>([]);

  // User form / edit state
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'parent' | 'admin'>('student');

  // Course form / edit state
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseThumbnail, setCourseThumbnail] = useState('');
  const [coursePrice, setCoursePrice] = useState('99.99');
  const [courseDiscount, setCourseDiscount] = useState('0');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseLevel, setCourseLevel] = useState('beginner');
  const [courseLanguage, setCourseLanguage] = useState('english');
  const [courseInstitution, setCourseInstitution] = useState('');
  const [courseTutors, setCourseTutors] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  
  // Lessons editor state
  const [courseLessons, setCourseLessons] = useState<any[]>([]);
  const [uploadingVideoId, setUploadingVideoId] = useState<string | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const uRes = await api.get('/users');
      setUsersList(Array.isArray(uRes.data) ? uRes.data : []);

      const cRes = await api.get('/courses');
      setCoursesList(Array.isArray(cRes.data) ? cRes.data : []);

      const pRes = await api.get('/purchases/all');
      setPurchasesList(Array.isArray(pRes.data) ? pRes.data : []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role !== 'admin') {
        router.push('/');
      } else {
        loadAllData();
      }
    } else {
      router.push('/');
    }
  }, [user]);

  // User Operations
  const handleEditUser = (u: any) => {
    setEditingUser(u);
    setUserRole(u.role);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/users/${editingUser._id}`, { role: userRole });
      setEditingUser(null);
      await loadAllData();
    } catch (err) {
      console.error(err);
      alert('Error updating user role.');
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${uid}`);
      await loadAllData();
    } catch (err) {
      console.error(err);
      alert('Error deleting user.');
    }
  };

  // Course Operations
  const handleAddCourseClick = () => {
    setEditingCourse({ _id: 'new' });
    setCourseTitle('');
    setCourseDescription('');
    setCourseThumbnail('');
    setCoursePrice('99.99');
    setCourseDiscount('0');
    setCourseCategory('Web Development');
    setCourseLevel('beginner');
    setCourseLanguage('english');
    setCourseInstitution('');
    setCourseTutors('');
    setIsPublished(true);
    setCourseLessons([]);
  };

  const handleEditCourse = (c: any) => {
    setEditingCourse(c);
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
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
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
      if (editingCourse._id === 'new') {
        await api.post('/courses', payload);
      } else {
        await api.put(`/courses/${editingCourse._id || editingCourse.id}`, payload);
      }
      setEditingCourse(null);
      await loadAllData();
    } catch (err) {
      console.error(err);
      alert('Error saving course.');
    }
  };

  const handleDeleteCourse = async (cid: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${cid}`);
      await loadAllData();
    } catch (err) {
      console.error(err);
      alert('Error deleting course.');
    }
  };

  // Lesson CRUD within Form
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

  // Video Uploading for lessons
  const handleVideoUpload = async (idx: number, file: File) => {
    const lesson = courseLessons[idx];
    const lid = lesson.lessonId;
    setUploadingVideoId(lid);
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
      alert('Upload failed. Check server logs.');
    } finally {
      setUploadingVideoId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full space-y-8 pt-24">
        
        {/* Admin stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Active Users</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{usersList.length}</div>
            </div>
            <Users className="w-10 h-10 text-indigo-600 opacity-80" />
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Blueprints</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{coursesList.length}</div>
            </div>
            <BookOpen className="w-10 h-10 text-indigo-600 opacity-80" />
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Captured Purchases</div>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{purchasesList.length}</div>
            </div>
            <CreditCard className="w-10 h-10 text-indigo-600 opacity-80" />
          </div>
        </section>

        {/* Tab Selection */}
        <div className="flex gap-4 border-b border-slate-200 pb-2.5">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'users' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Users CRUD
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'courses' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Courses CRUD
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'purchases' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Purchases CRUD
          </button>

          <button
            onClick={loadAllData}
            className="ml-auto p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-all cursor-pointer shadow-sm"
            title="Reload Data Matrix"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-xs text-slate-400 animate-pulse font-bold uppercase py-12 text-center">
              Revising database schema records...
            </div>
          ) : (
            <>
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  {editingUser && (
                    <form onSubmit={handleUpdateUser} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-end gap-4">
                      <div className="flex-1">
                        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                          Modify role for {editingUser.name}
                        </label>
                        <select
                          value={userRole}
                          onChange={(e) => setUserRole(e.target.value as any)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Tutor / Teacher</option>
                          <option value="parent">Parent</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingUser(null)}
                          className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase cursor-pointer"
                        >
                          Update
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-4">User Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Role</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {usersList.map((u) => (
                          <tr key={u._id || u.id} className="hover:bg-slate-50/50">
                            <td className="p-4 flex items-center gap-2">
                              <img
                                src={u.imageUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                                alt=""
                                className="w-6 h-6 rounded-full border border-slate-200"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=user';
                                }}
                              />
                              <span className="font-bold text-slate-800 uppercase">{u.name}</span>
                            </td>
                            <td className="p-4">{u.email}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                u.role === 'admin' ? 'bg-amber-50 border border-amber-200 text-amber-700' :
                                u.role === 'teacher' ? 'bg-purple-50 border border-purple-200 text-purple-700' :
                                u.role === 'parent' ? 'bg-pink-50 border border-pink-200 text-pink-700' :
                                'bg-cyan-50 border border-cyan-200 text-cyan-700'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => handleEditUser(u)}
                                className="p-1.5 bg-slate-50 border border-slate-200 rounded hover:text-indigo-600 hover:border-indigo-600 transition-all cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u._id || u.id)}
                                className="p-1.5 bg-red-50 border border-red-200 rounded hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Courses Tab */}
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800 uppercase">Manage Course Blueprints</h3>
                    <button
                      onClick={handleAddCourseClick}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-4 h-4" /> Add Course
                    </button>
                  </div>

                  {editingCourse && (
                    <form onSubmit={handleSaveCourse} className="bg-white p-6 rounded-lg border border-slate-200 shadow-md space-y-6">
                      <h4 className="font-extrabold text-sm text-slate-800 uppercase border-b pb-2">
                        {editingCourse._id === 'new' ? 'Build New Course' : `Modify Course: ${editingCourse.courseTitle}`}
                      </h4>

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
                            className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-indigo-600"
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
                                        {uploadingVideoId === lesson.lessonId ? 'Uploading to Cloudinary...' : 'Upload Video File'}
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
                        <button
                          type="button"
                          onClick={() => setEditingCourse(null)}
                          className="px-4 py-2 border border-slate-200 rounded text-xs font-bold text-slate-500 hover:bg-slate-50 uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold uppercase cursor-pointer"
                        >
                          Save Course Blueprint
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-4">Course Name</th>
                          <th className="p-4">Publisher / Tutor</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Discount</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {coursesList.map((c) => {
                          const price = Number(c.coursePrice) || 0;
                          const discount = Number(c.discount) || 0;
                          const tutors = c.tutorNames || 'Professor Tech';
                          const inst = c.institutionName ? ` (${c.institutionName})` : '';

                          return (
                            <tr key={c._id || c.id} className="hover:bg-slate-50/50">
                              <td className="p-4 font-bold text-slate-800 uppercase">{c.courseTitle}</td>
                              <td className="p-4 text-slate-500 font-bold">{tutors}{inst}</td>
                              <td className="p-4">${price.toFixed(2)}</td>
                              <td className="p-4">{discount}%</td>
                              <td className="p-4 text-right space-x-2">
                                <button
                                  onClick={() => handleEditCourse(c)}
                                  className="p-1.5 bg-slate-50 border border-slate-200 rounded hover:text-indigo-600 hover:border-indigo-600 transition-all cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(c._id || c.id)}
                                  className="p-1.5 bg-red-50 border border-red-200 rounded hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Purchases Tab */}
              {activeTab === 'purchases' && (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-4">Purchase ID</th>
                        <th className="p-4">Buyer Email</th>
                        <th className="p-4">Course</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {purchasesList.map((p) => {
                        const amount = Number(p.amount) || 0;
                        const email = p.userId?.email || p.userId || 'Unknown';
                        const title = p.courseId?.courseTitle || p.courseId || 'Course';

                        return (
                          <tr key={p._id || p.id} className="hover:bg-slate-50/50">
                            <td className="p-4 text-slate-500 font-mono font-bold">{p._id || p.id}</td>
                            <td className="p-4 font-bold text-slate-800 uppercase">{email}</td>
                            <td className="p-4 uppercase">{title}</td>
                            <td className="p-4 font-bold text-indigo-600">${amount.toFixed(2)}</td>
                            <td className="p-4">
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 border border-emerald-200 text-emerald-700">
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

      </main>
    </div>
  );
}
