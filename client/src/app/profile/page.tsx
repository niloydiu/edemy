'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, Mail, ShieldAlert, Award, BookOpen, Heart, Save, 
  RefreshCw, UserPlus, CheckCircle, Sparkles, LogOut, ArrowRight, LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, token, api, refreshProfile, logout } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'info' | 'activity' | 'actions'>('info');

  // Activity/enrolled info
  const [courses, setCourses] = useState<any[]>([]);
  const [linkedStudents, setLinkedStudents] = useState<any[]>([]);
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      // Extract seed from dicebear url if present
      if (user.imageUrl && user.imageUrl.includes('seed=')) {
        const match = user.imageUrl.match(/seed=([^&]+)/);
        if (match) setAvatarSeed(match[1]);
      } else {
        setAvatarSeed(user.name || 'default');
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user || !token) return;

    // Load standard data based on role
    const loadData = async () => {
      try {
        const res = await api.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to load courses', err);
      }

      if (user.role === 'parent') {
        try {
          const res = await api.get('/users/parent/students');
          setLinkedStudents(res.data);
        } catch (err) {
          console.error('Failed to load linked students', err);
        }
      }
    };

    loadData();
  }, [user, token]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="glass-panel p-8 rounded-2xl max-w-md w-full text-center shadow-xl border border-slate-200 dark:border-slate-800"
          >
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShieldAlert className="w-8 h-8 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">
              Please sign in to view and manage your profile details.
            </p>
            <Link 
              href="/auth/login" 
              className="btn-primary w-full py-3 rounded-xl glow-hover premium-gradient font-bold transition-all shadow-lg"
            >
              Sign In to Account
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const userId = (user as any)._id || (user as any).id;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const generatedAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(avatarSeed)}`;
      const res = await api.put(`/users/${userId}`, {
        name,
        email,
        imageUrl: generatedAvatar,
      });
      await refreshProfile();
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentEmail) return;
    setLinking(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await api.post('/users/link-student', { email: newStudentEmail });
      const res = await api.get('/users/parent/students');
      setLinkedStudents(res.data);
      setNewStudentEmail('');
      setSuccessMsg('Student linked successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to link student. Verify email.');
    } finally {
      setLinking(false);
    }
  };

  // Find enrolled and wishlisted courses
  const enrolledList = courses.filter(c => (c.enrolledStudents || []).includes(userId));
  const wishlistList = courses.filter(c => (user.wishlist || []).includes(String(c._id || c.id)));

  // Role helper for display
  const roleDisplayNames = {
    student: 'Student',
    teacher: 'Instructor',
    parent: 'Parent',
    admin: 'Administrator'
  };

  // Get active dashboard href
  const getDashboardHref = () => {
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'teacher') return '/dashboard/tutor';
    if (user.role === 'parent') return '/dashboard/parent';
    return '/dashboard/student';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="pt-24 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Top Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden glass-panel border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 mb-8"
        >
          {/* Subtle colored background blobs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center gap-6 z-10">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center"
            >
              <img 
                src={user.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
                <span className="inline-flex self-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50">
                  {roleDisplayNames[user.role] || user.role}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                {user.email}
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2.5 justify-center sm:justify-start">
                <Link href={getDashboardHref()} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 transition-all border border-slate-200/60 dark:border-slate-800/80">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  View Dashboard
                </Link>
                <button onClick={logout} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all">
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alerts for Status Notifications */}
        <AnimatePresence>
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              {successMsg}
            </motion.div>
          )}
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-sm font-medium flex items-center gap-2"
            >
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800/80 mb-8 relative">
          {(['info', 'activity', 'actions'] as const).map((tab) => {
            const labelMap = {
              info: 'Personal Info',
              activity: 'My Activity',
              actions: 'Account Settings'
            };
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 font-bold text-sm transition-colors relative shrink-0 ${
                  active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                {labelMap[tab]}
                {active && (
                  <motion.div 
                    layoutId="profileActiveTabLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'info' && (
                <motion.div
                  key="info-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <form onSubmit={handleUpdateProfile} className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 sm:p-8 space-y-6">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                      Update Personal Details
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                        <div className="relative">
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            required
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold transition-all"
                            placeholder="Your Name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="email" 
                            required
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold transition-all"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Avatar Custom Seed</label>
                        <span className="text-xs text-indigo-500 dark:text-indigo-400 font-bold">Generates a unique profile bot</span>
                      </div>
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          value={avatarSeed} 
                          onChange={(e) => setAvatarSeed(e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold transition-all"
                          placeholder="Type anything to randomize image"
                        />
                        <button 
                          type="button"
                          onClick={() => setAvatarSeed(Math.random().toString(36).substring(7))}
                          className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 font-bold text-sm transition-all"
                        >
                          Randomize
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">Preview:</p>
                      <div className="mt-2 w-14 h-14 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-1.5">
                        <img 
                          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(avatarSeed)}`}
                          alt="preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={updating}
                        className="btn-primary px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 glow-hover shadow-lg transition-all"
                      >
                        {updating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {updating ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'activity' && (
                <motion.div
                  key="activity-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Student Activity: enrolled courses and wishlist */}
                  {user.role === 'student' && (
                    <div className="space-y-6">
                      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 sm:p-8">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                          <BookOpen className="w-5 h-5 text-indigo-500" />
                          Enrolled Courses ({enrolledList.length})
                        </h2>
                        {enrolledList.length === 0 ? (
                          <p className="text-sm text-slate-500 dark:text-slate-400">You are not enrolled in any courses yet.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {enrolledList.map(course => (
                              <motion.div 
                                whileHover={{ scale: 1.02 }}
                                key={course._id || course.id} 
                                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between"
                              >
                                <div>
                                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{course.title}</h3>
                                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{course.description}</p>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                  <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">Active</span>
                                  <Link href={`/courses/${course._id || course.id}`} className="text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white flex items-center gap-1">
                                    Go to course <ArrowRight className="w-3.5 h-3.5" />
                                  </Link>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 sm:p-8">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                          <Heart className="w-5 h-5 text-rose-500" />
                          My Wishlist ({wishlistList.length})
                        </h2>
                        {wishlistList.length === 0 ? (
                          <p className="text-sm text-slate-500 dark:text-slate-400">Your wishlist is empty.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {wishlistList.map(course => (
                              <motion.div 
                                whileHover={{ scale: 1.02 }}
                                key={course._id || course.id} 
                                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between"
                              >
                                <div>
                                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{course.title}</h3>
                                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{course.description}</p>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                  <span className="text-xs font-bold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">Wishlist</span>
                                  <Link href={`/courses/${course._id || course.id}`} className="text-xs font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white flex items-center gap-1">
                                    View details <ArrowRight className="w-3.5 h-3.5" />
                                  </Link>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Teacher view */}
                  {user.role === 'teacher' && (
                    <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 sm:p-8">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                        <BookOpen className="w-5 h-5 text-indigo-500" />
                        My Courses
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage all curriculum and students from your Instructor Workspace.</p>
                      <Link href="/dashboard/tutor" className="btn-primary py-3 rounded-xl glow-hover inline-flex items-center gap-2">
                        Open Instructor Workspace
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}

                  {/* Parent linked students */}
                  {user.role === 'parent' && (
                    <div className="space-y-6">
                      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 sm:p-8">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                          <UserIcon className="w-5 h-5 text-indigo-500" />
                          Linked Students ({linkedStudents.length})
                        </h2>
                        {linkedStudents.length === 0 ? (
                          <p className="text-sm text-slate-500 dark:text-slate-400">No students are linked to your profile yet.</p>
                        ) : (
                          <div className="space-y-4">
                            {linkedStudents.map(student => (
                              <div key={student.id || student._id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4">
                                <img src={student.imageUrl} className="w-10 h-10 rounded-full" alt="" />
                                <div className="flex-1">
                                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{student.name}</h3>
                                  <p className="text-xs text-slate-400">{student.email}</p>
                                </div>
                                <Link href={`/dashboard/parent`} className="text-xs font-bold text-indigo-500 hover:underline">
                                  Track progress
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Admin summary */}
                  {user.role === 'admin' && (
                    <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 sm:p-8">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                        <Award className="w-5 h-5 text-indigo-500" />
                        System Statistics
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage all students, teachers, workshops and settings from your master admin suite.</p>
                      <Link href="/dashboard/admin" className="btn-primary py-3 rounded-xl glow-hover inline-flex items-center gap-2">
                        Launch Administrator Panel
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'actions' && (
                <motion.div
                  key="actions-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Account Actions */}
                  <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 sm:p-8 space-y-6">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Account Safety & Roles</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Your account role is currently set to <strong className="text-indigo-600 dark:text-indigo-400 capitalize">{user.role}</strong>. 
                      Roles govern catalog enrollment scopes and student progress mapping options.
                    </p>

                    {/* Show Link Student form specifically for parents here as well */}
                    {user.role === 'parent' && (
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                        <h3 className="font-bold text-slate-950 dark:text-white mb-2 flex items-center gap-1.5">
                          <UserPlus className="w-4 h-4 text-indigo-500" />
                          Link Another Student (Child)
                        </h3>
                        <form onSubmit={handleLinkStudent} className="flex flex-col sm:flex-row gap-3 mt-3">
                          <input 
                            type="email" 
                            value={newStudentEmail}
                            onChange={(e) => setNewStudentEmail(e.target.value)}
                            required
                            placeholder="student@example.com"
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold transition-all"
                          />
                          <button
                            type="submit"
                            disabled={linking}
                            className="btn-primary py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shrink-0"
                          >
                            {linking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                            Link Student
                          </button>
                        </form>
                      </div>
                    )}

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80">
                      <h3 className="font-bold text-slate-950 dark:text-white mb-2">Need to adjust security?</h3>
                      <p className="text-xs text-slate-400 mb-4 leading-normal">
                        To request role changes or delete account history data completely, contact our global platform operations center at admin@edemy.com.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-panel border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
              <h3 className="font-black text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Edemy Certifications
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Complete and verify courses to obtain credentials shareable with LinkedIn, and accredited agencies worldwide.
              </p>
              
              <div className="border border-indigo-100 dark:border-indigo-950/40 p-4 rounded-2xl bg-indigo-50/20 dark:bg-indigo-950/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500">Current Status</span>
                <p className="text-sm font-black text-slate-900 dark:text-white mt-1">Verified Member</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Enrolled since July 2026</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-panel border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg p-6"
            >
              <h3 className="font-black text-slate-900 dark:text-white text-base mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">{enrolledList.filter(c => false).length}</span>
                </div>
                <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wishlist</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">{wishlistList.length}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
