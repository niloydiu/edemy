'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Users, Link2, BookOpen, Award, CheckCircle, ChevronRight, ShoppingBag } from 'lucide-react';

export default function ParentDashboard() {
  const { api, user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentEmail, setStudentEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentProgress, setStudentProgress] = useState<any[]>([]);
  const [studentPurchases, setStudentPurchases] = useState<any[]>([]);

  const loadParentData = async () => {
    if (!user) return;
    try {
      const res = await api.get('/users/parent/students');
      setStudents(res.data);
      if (res.data.length > 0) {
        setSelectedStudent(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParentData();
  }, [user]);

  // Load selected student progress & purchases
  useEffect(() => {
    async function loadStudentStats() {
      if (!selectedStudent) return;
      try {
        // Fetch all courses
        const coursesRes = await api.get('/courses');
        // Filter those where student is enrolled
        const enrolled = coursesRes.data.filter((c: any) => c.enrolledStudents?.includes(selectedStudent._id));
        
        // Load progress for each enrolled course
        const progressList = [];
        for (const course of enrolled) {
          try {
            const progRes = await api.get(`/courses/${course._id}/progress?studentId=${selectedStudent._id}`);
            progressList.push({
              course,
              progress: progRes.data,
            });
          } catch (e) {
            console.error(e);
          }
        }
        setStudentProgress(progressList);

        // Fetch purchases for student
        const purchasesRes = await api.get(`/purchases?studentId=${selectedStudent._id}`);
        setStudentPurchases(purchasesRes.data);
      } catch (err) {
        console.error('Failed to load student progress/purchases:', err);
      }
    }
    loadStudentStats();
  }, [selectedStudent]);

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail) return;
    setIsSubmitting(true);
    try {
      await api.post('/users/link-student', { email: studentEmail });
      setStudentEmail('');
      alert('Student linked successfully!');
      await loadParentData();
    } catch (err: any) {
      console.error('Linking error:', err);
      alert(err.response?.data?.message || 'Failed to link student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Link Form & Child List */}
        <div className="space-y-6">
          
          {/* Link student Form */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-indigo-600" /> Link Child Account
            </h3>
            <form onSubmit={handleLinkStudent} className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                  Student Email Address
                </label>
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="jane@student.com"
                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase text-xs rounded-lg transition-all cursor-pointer"
              >
                {isSubmitting ? 'Establishing Link...' : 'Link Child Profile'}
              </button>
            </form>
          </div>

          {/* Child Profiles list */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" /> Connected Children
            </h3>
            
            {loading ? (
              <div className="text-xs text-slate-400 animate-pulse font-bold uppercase">Scanning linked channels...</div>
            ) : students.length === 0 ? (
              <p className="text-xs text-slate-400 font-bold uppercase">No child accounts connected.</p>
            ) : (
              <div className="space-y-2">
                {students.map((child) => (
                  <button
                    key={child._id}
                    onClick={() => setSelectedStudent(child)}
                    className={`w-full text-left p-3 rounded-lg flex items-center gap-3 border transition-all cursor-pointer ${
                      selectedStudent?._id === child._id
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <img
                      src={child.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${child.name}`}
                      alt={child.name}
                      className="w-8 h-8 rounded-full border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold uppercase truncate">{child.name}</h4>
                      <p className="text-[9px] text-slate-400">{child.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Columns: Selected Student Overview */}
        <div className="lg:col-span-2 space-y-6">
          {selectedStudent ? (
            <div className="space-y-6">
              
              {/* Child Header Card */}
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4">
                <img
                  src={selectedStudent.imageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedStudent.name}`}
                  alt={selectedStudent.name}
                  className="w-16 h-16 rounded-full border border-slate-200"
                />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedStudent.name} Performance Log
                  </h2>
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-0.5">
                    Student Account Linked & Verified
                  </p>
                </div>
              </div>

              {/* Progress Tracker list */}
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-3">
                  <Award className="w-4 h-4 text-indigo-600" /> Syllabus Progress
                </h3>
                
                {studentProgress.length === 0 ? (
                  <p className="text-xs text-slate-400 font-bold text-center py-6">
                    Student has not enrolled in any courses yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {studentProgress.map((item, idx) => {
                      const completedCount = item.progress?.completedLessons?.length || 0;
                      const totalLessons = item.course.lessons?.length || 0;
                      const percent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;
                      
                      return (
                        <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-800 uppercase truncate max-w-md">
                              {item.course.courseTitle}
                            </span>
                            <span className="font-bold text-indigo-600">{percent}% Complete</span>
                          </div>

                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600" style={{ width: `${percent}%` }} />
                          </div>

                          <div className="flex justify-between text-[9px] text-slate-500">
                            <span>Completed {completedCount} of {totalLessons} modules</span>
                            {item.progress?.completed && (
                              <span className="text-emerald-700 font-bold uppercase flex items-center gap-0.5">
                                <CheckCircle className="w-3 h-3" /> Syllabus Complete
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Purchase Log */}
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-3">
                  <ShoppingBag className="w-4 h-4 text-indigo-600" /> Invoice Archive
                </h3>
                {studentPurchases.length === 0 ? (
                  <p className="text-xs text-slate-400 font-bold text-center py-6">
                    No transactions captured.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {studentPurchases.map((purchase) => (
                      <div key={purchase._id} className="flex justify-between items-center text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div>
                          <span className="font-bold text-slate-800 uppercase block font-sans">
                            {purchase.courseId?.courseTitle || 'Syllabus Course'}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Date: {new Date(purchase.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-indigo-600 block">${purchase.amount}</span>
                          <span className="text-[9px] text-emerald-700 font-bold uppercase">
                            {purchase.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-lg border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-400 font-bold uppercase">
                Select a child profile from the left list to begin tracking progress.
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
