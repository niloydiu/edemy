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
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full space-y-8">
        
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
                          <tr key={u._id} className="hover:bg-slate-50/50">
                            <td className="p-4 flex items-center gap-2">
                              <img src={u.imageUrl} alt="" className="w-6 h-6 rounded-full border border-slate-200" />
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
                                onClick={() => handleDeleteUser(u._id)}
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
                  {editingCourse && (
                    <form onSubmit={handleUpdateCourse} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Title</label>
                        <input
                          type="text"
                          required
                          value={courseTitle}
                          onChange={(e) => setCourseTitle(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Price</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={coursePrice}
                          onChange={(e) => setCoursePrice(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Discount (%)</label>
                        <input
                          type="number"
                          required
                          value={courseDiscount}
                          onChange={(e) => setCourseDiscount(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                      <div className="flex gap-2">
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
                          Save
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-4">Course Name</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Discount</th>
                          <th className="p-4">Educator ID</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {coursesList.map((c) => (
                          <tr key={c._id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-bold text-slate-800 uppercase">{c.courseTitle}</td>
                            <td className="p-4">${c.coursePrice}</td>
                            <td className="p-4">{c.discount}%</td>
                            <td className="p-4 text-slate-500 font-bold">{c.educator}</td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => handleEditCourse(c)}
                                className="p-1.5 bg-slate-50 border border-slate-200 rounded hover:text-indigo-600 hover:border-indigo-600 transition-all cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(c._id)}
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
                      {purchasesList.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/50">
                          <td className="p-4 text-slate-500 font-mono font-bold">{p._id}</td>
                          <td className="p-4 font-bold text-slate-800 uppercase">{p.userId?.email || p.userId}</td>
                          <td className="p-4 uppercase">{p.courseId?.courseTitle || p.courseId}</td>
                          <td className="p-4 font-bold text-indigo-600">${p.amount}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 border border-emerald-200 text-emerald-700">
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
