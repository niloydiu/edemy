'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Users, BookOpen, CreditCard, Trash2, Edit2, RefreshCw } from 'lucide-react';
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
  const [coursePrice, setCoursePrice] = useState('99.99');
  const [courseDiscount, setCourseDiscount] = useState('0');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const uRes = await api.get('/users');
      setUsersList(uRes.data);

      const cRes = await api.get('/courses');
      setCoursesList(cRes.data);

      const pRes = await api.get('/purchases/all');
      setPurchasesList(pRes.data);
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
  const handleEditCourse = (c: any) => {
    setEditingCourse(c);
    setCourseTitle(c.courseTitle);
    setCoursePrice(String(c.coursePrice));
    setCourseDiscount(String(c.discount));
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/courses/${editingCourse._id}`, {
        courseTitle,
        coursePrice: parseFloat(coursePrice),
        discount: parseInt(courseDiscount),
      });
      setEditingCourse(null);
      await loadAllData();
    } catch (err) {
      console.error(err);
      alert('Error updating course.');
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full space-y-8">
        
        {/* Admin stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glassmorphic p-6 rounded-lg border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Total Active Nodes (Users)</div>
              <div className="text-3xl font-black text-neonCyan mt-1">{usersList.length}</div>
            </div>
            <Users className="w-10 h-10 text-neonCyan opacity-60" />
          </div>
          <div className="glassmorphic p-6 rounded-lg border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Active Blueprints (Courses)</div>
              <div className="text-3xl font-black text-neonPurple mt-1">{coursesList.length}</div>
            </div>
            <BookOpen className="w-10 h-10 text-neonPurple opacity-60" />
          </div>
          <div className="glassmorphic p-6 rounded-lg border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Captured Transactions (Sales)</div>
              <div className="text-3xl font-black text-neonMagenta mt-1">{purchasesList.length}</div>
            </div>
            <CreditCard className="w-10 h-10 text-neonMagenta opacity-60" />
          </div>
        </section>

        {/* Tab Selection */}
        <div className="flex gap-4 border-b border-white/5 pb-2.5">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeTab === 'users' ? 'border-neonCyan text-neonCyan' : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            Users CRUD
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeTab === 'courses' ? 'border-neonPurple text-neonPurple' : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            Courses CRUD
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeTab === 'purchases' ? 'border-neonMagenta text-neonMagenta' : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            Purchases CRUD
          </button>

          <button
            onClick={loadAllData}
            className="ml-auto p-2 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer"
            title="Reload Data Matrix"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-xs text-gray-500 animate-pulse font-bold uppercase py-12 text-center">
              Revising Database Node Structures...
            </div>
          ) : (
            <>
              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  {editingUser && (
                    <form onSubmit={handleUpdateUser} className="glassmorphic p-6 rounded-lg border border-neonCyan/30 flex flex-col md:flex-row md:items-end gap-4">
                      <div className="flex-1">
                        <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">
                          Modify role for {editingUser.name}
                        </label>
                        <select
                          value={userRole}
                          onChange={(e) => setUserRole(e.target.value as any)}
                          className="w-full bg-background border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-neonCyan"
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
                          className="px-4 py-2 border border-white/10 rounded text-xs font-bold text-gray-400 uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-neonCyan text-black rounded text-xs font-black uppercase tracking-widest cursor-pointer"
                        >
                          Update
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="glassmorphic rounded-lg border border-white/10 overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-300">
                      <thead className="bg-white/5 text-[10px] text-gray-500 uppercase tracking-widest font-black border-b border-white/15">
                        <tr>
                          <th className="p-4">User</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Role</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {usersList.map((u) => (
                          <tr key={u._id} className="hover:bg-white/5">
                            <td className="p-4 flex items-center gap-2">
                              <img src={u.imageUrl} alt="" className="w-6 h-6 rounded-full border border-white/10" />
                              <span className="font-bold text-white uppercase">{u.name}</span>
                            </td>
                            <td className="p-4">{u.email}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                u.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                u.role === 'teacher' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                u.role === 'parent' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' :
                                'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => handleEditUser(u)}
                                className="p-1.5 bg-white/5 border border-white/10 rounded hover:text-neonCyan transition-all cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                className="p-1.5 bg-red-500/10 border border-red-500/20 rounded hover:text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
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
                  {editingCourse && (
                    <form onSubmit={handleUpdateCourse} className="glassmorphic p-6 rounded-lg border border-neonPurple/30 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Title</label>
                        <input
                          type="text"
                          required
                          value={courseTitle}
                          onChange={(e) => setCourseTitle(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-neonPurple"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Price</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={coursePrice}
                          onChange={(e) => setCoursePrice(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-neonPurple"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Discount (%)</label>
                        <input
                          type="number"
                          required
                          value={courseDiscount}
                          onChange={(e) => setCourseDiscount(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-neonPurple"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingCourse(null)}
                          className="px-4 py-2 border border-white/10 rounded text-xs font-bold text-gray-400 uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-neonPurple text-black rounded text-xs font-black uppercase tracking-widest cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="glassmorphic rounded-lg border border-white/10 overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-300">
                      <thead className="bg-white/5 text-[10px] text-gray-500 uppercase tracking-widest font-black border-b border-white/15">
                        <tr>
                          <th className="p-4">Course</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Discount</th>
                          <th className="p-4">Educator ID</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {coursesList.map((c) => (
                          <tr key={c._id} className="hover:bg-white/5">
                            <td className="p-4 font-bold text-white uppercase">{c.courseTitle}</td>
                            <td className="p-4">${c.coursePrice}</td>
                            <td className="p-4">{c.discount}%</td>
                            <td className="p-4 text-gray-500 font-bold">{c.educator}</td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => handleEditCourse(c)}
                                className="p-1.5 bg-white/5 border border-white/10 rounded hover:text-neonPurple transition-all cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(c._id)}
                                className="p-1.5 bg-red-500/10 border border-red-500/20 rounded hover:text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
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

              {/* Purchases Tab */}
              {activeTab === 'purchases' && (
                <div className="glassmorphic rounded-lg border border-white/10 overflow-hidden overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-white/5 text-[10px] text-gray-500 uppercase tracking-widest font-black border-b border-white/15">
                      <tr>
                        <th className="p-4">Purchase ID</th>
                        <th className="p-4">Buyer Email</th>
                        <th className="p-4">Course</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {purchasesList.map((p) => (
                        <tr key={p._id} className="hover:bg-white/5">
                          <td className="p-4 text-gray-500 font-bold">{p._id}</td>
                          <td className="p-4 font-bold text-white uppercase">{p.userId?.email || p.userId}</td>
                          <td className="p-4 uppercase">{p.courseId?.courseTitle || p.courseId}</td>
                          <td className="p-4 font-black text-neonCyan">${p.amount}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
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
