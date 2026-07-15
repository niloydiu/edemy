'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { Star, Clock, Users, Search, Filter, ChevronDown, BookOpen, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = [
  'All', 'Web Development', 'Data Science', 'Artificial Intelligence',
  'Mobile Development', 'Cloud Computing', 'Cybersecurity', 'UI/UX Design',
  'Digital Marketing', 'Business & Management', 'Photography',
  'Personal Development', 'Language Learning', 'Game Development',
  'Music & Audio', '3D Modeling & Animation', 'Health & Fitness',
  'Blockchain & Web3', 'E-Commerce', 'Database Design', 'Soft Skills',
];

const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: 999 },
  { label: 'Free', min: 0, max: 0 },
  { label: 'Under $50', min: 1, max: 50 },
  { label: '$50 – $100', min: 50, max: 100 },
  { label: '$100+', min: 100, max: 999 },
];

function StarRating({ rating }: { rating: number }) {
  const safeRating = isNaN(Number(rating)) ? 5 : Math.round(Number(rating));
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${
          i <= safeRating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'
        }`} />
      ))}
    </div>
  );
}

function CoursesPageContent() {
  const { api } = useAuth();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || '';
  const initialSearch = searchParams.get('search') || '';

  const [courses, setCourses] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All Levels');
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
  const [sort, setSort] = useState('popular');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
    }
  }, [initialSearch]);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/courses', {
        params: {
          search: search,
          type: typeParam,
        }
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setCourses(data);
      setFiltered(data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  }, [api, search, typeParam]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const applyFilters = useCallback(() => {
    let result = [...courses];
    if (category !== 'All') result = result.filter(c => c.category === category);
    if (level !== 'All Levels') result = result.filter(c => c.level === level);
    result = result.filter(c => {
      const price = Number(c.coursePrice) || 0;
      const discount = Number(c.discount) || 0;
      const p = price * (1 - discount / 100);
      return p >= priceRange.min && p <= priceRange.max;
    });

    if (sort === 'popular') {
      result.sort((a, b) => ((b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0)));
    } else if (sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sort === 'price-low') {
      result.sort((a, b) => (Number(a.coursePrice) || 0) - (Number(b.coursePrice) || 0));
    } else if (sort === 'price-high') {
      result.sort((a, b) => (Number(b.coursePrice) || 0) - (Number(a.coursePrice) || 0));
    } else if (sort === 'rating') {
      result.sort((a, b) => {
        const ra = a.ratings?.length ? a.ratings.reduce((s: number, r: any) => s + (Number(r.rating) || 0), 0) / a.ratings.length : 0;
        const rb = b.ratings?.length ? b.ratings.reduce((s: number, r: any) => s + (Number(r.rating) || 0), 0) / b.ratings.length : 0;
        return rb - ra;
      });
    }
    setFiltered(result);
  }, [courses, category, level, priceRange, sort]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-semibold text-slate-900 text-sm mb-3">Category</h3>
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                category === c ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Level */}
      <div>
        <h3 className="font-semibold text-slate-900 text-sm mb-3">Level</h3>
        <div className="space-y-1.5">
          {LEVELS.map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                level === l ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-semibold text-slate-900 text-sm mb-3">Price Range</h3>
        <div className="space-y-1.5">
          {PRICE_RANGES.map(p => (
            <button
              key={p.label}
              onClick={() => setPriceRange(p)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                priceRange.label === p.label ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => { setCategory('All'); setLevel('All Levels'); setPriceRange(PRICE_RANGES[0]); setSearch(''); }}
        className="w-full px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-6">
              {typeParam === 'online' ? 'Live Classes' : typeParam === 'offline' ? 'Workshops' : 'All Courses'}
            </h1>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses, topics, tutors, or institutions..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="input pr-10 appearance-none min-w-[180px] cursor-pointer bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              {/* Mobile filter toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center gap-2 btn-secondary cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar — Desktop */}
            <aside className="hidden lg:block w-60 flex-shrink-0">
              <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
                <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </h2>
                <FilterPanel />
              </div>
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div className="lg:hidden fixed inset-0 z-50 flex">
                <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                <div className="relative bg-white w-72 h-full overflow-y-auto p-5 shadow-2xl">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-slate-900">Filters</h2>
                    <button onClick={() => setSidebarOpen(false)} className="cursor-pointer">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                  <FilterPanel />
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-semibold text-slate-900">{filtered.length}</span> courses
                  {category !== 'All' && <span className="text-indigo-600 ml-1">in {category}</span>}
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="course-card animate-pulse bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-200 aspect-video" />
                      <div className="p-4 space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-1/3" />
                        <div className="h-4 bg-slate-200 rounded" />
                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                        <div className="h-3 bg-slate-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <BookOpen className="w-16 h-16 text-slate-200 mb-4" />
                  <h3 className="font-bold text-slate-900 text-lg">No courses found</h3>
                  <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or search query.</p>
                  <button
                    onClick={() => { setCategory('All'); setLevel('All Levels'); setPriceRange(PRICE_RANGES[0]); setSearch(''); }}
                    className="btn-primary mt-4 cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((course: any) => {
                    const ratings = Array.isArray(course.ratings) ? course.ratings : [];
                    const avgRating = ratings.length
                      ? (ratings.reduce((a: number, r: any) => a + (Number(r.rating) || 0), 0) / ratings.length)
                      : 4.8;
                    const price = Number(course.coursePrice) || 0;
                    const discount = Number(course.discount) || 0;
                    const finalPrice = price * (1 - discount / 100);
                    const lessonCount = course.lessons?.length || 0;
                    const studentCount = course.enrolledStudents?.length || 0;

                    return (
                      <Link
                        key={course._id || course.id}
                        href={`/courses/${course._id || course.id}`}
                        className="course-card group bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="relative overflow-hidden aspect-video bg-slate-100">
                          <img
                            src={course.courseThumbnail || 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop'}
                            alt={course.courseTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop';
                            }}
                          />
                          {discount > 0 && (
                            <span className="absolute top-2 left-2 badge bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 rounded">-{discount}%</span>
                          )}
                          {course.level && (
                            <span className="absolute top-2 right-2 badge bg-slate-800 text-white font-bold text-[10px] px-2 py-0.5 rounded capitalize">{course.level}</span>
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            {course.category && (
                              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">{course.category}</span>
                            )}
                            {course.institutionName && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded truncate max-w-[120px]" title={course.institutionName}>
                                {course.institutionName}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
                            {course.courseTitle}
                          </h3>
                          {course.tutorNames && (
                            <p className="text-[10px] text-slate-500 font-medium truncate">
                              By: {course.tutorNames}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {lessonCount} lessons</span>
                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {studentCount} enrolled</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-amber-600 font-bold text-xs">{Number(avgRating).toFixed(1)}</span>
                            <StarRating rating={avgRating} />
                          </div>
                          <div className="flex items-baseline gap-2 mt-auto pt-2 border-t border-slate-100">
                            <span className="font-extrabold text-slate-900">${Number(finalPrice).toFixed(2)}</span>
                            {discount > 0 && (
                              <span className="text-xs text-slate-400 line-through">${Number(price).toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex flex-col justify-center items-center gap-4">
        <div className="w-14 h-14 border-4 border-slate-700 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-white text-xs font-black uppercase tracking-widest animate-pulse">Loading Courses...</p>
      </div>
    }>
      <CoursesPageContent />
    </Suspense>
  );
}
