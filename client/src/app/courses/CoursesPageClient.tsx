'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Star, Clock, Users, Search, Filter, ChevronDown, BookOpen, SlidersHorizontal, X, Heart } from 'lucide-react';

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

const RATING_OPTIONS = [
  { label: 'All Ratings', min: 0 },
  { label: '4.5 & Up', min: 4.5 },
  { label: '4.0 & Up', min: 4.0 },
  { label: '3.5 & Up', min: 3.5 },
];

const DURATION_OPTIONS = [
  { label: 'All Durations', min: 0, max: 99999 },
  { label: 'Short (< 2 hrs)', min: 0, max: 120 },
  { label: 'Medium (2-10 hrs)', min: 120, max: 600 },
  { label: 'Long (10+ hrs)', min: 600, max: 99999 },
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

export default function CoursesPageClient({ initialCourses }: { initialCourses: any[] }) {
  const { user, api, refreshProfile } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState<any[]>(initialCourses);
  const [filtered, setFiltered] = useState<any[]>(initialCourses);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All Levels');
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
  const [ratingFilter, setRatingFilter] = useState(RATING_OPTIONS[0]);
  const [durationFilter, setDurationFilter] = useState(DURATION_OPTIONS[0]);
  const [sort, setSort] = useState('popular');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const applyFilters = useCallback(() => {
    let result = [...courses];

    // Search query
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.courseTitle?.toLowerCase().includes(q) ||
        c.courseDescription?.toLowerCase().includes(q) ||
        c.institutionName?.toLowerCase().includes(q) ||
        c.tutorNames?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category !== 'All') {
      result = result.filter(c => c.category === category);
    }

    // Level filter
    if (level !== 'All Levels') {
      result = result.filter(c => c.level === level);
    }

    // Price filter
    result = result.filter(c => {
      const price = Number(c.coursePrice) || 0;
      const discount = Number(c.discount) || 0;
      const p = price * (1 - discount / 100);
      return p >= priceRange.min && p <= priceRange.max;
    });

    // Rating filter
    result = result.filter(c => {
      const ratings = Array.isArray(c.ratings) ? c.ratings : [];
      const avg = ratings.length
        ? (ratings.reduce((acc: number, r: any) => acc + (Number(r.rating) || 0), 0) / ratings.length)
        : 4.8;
      return avg >= ratingFilter.min;
    });

    // Duration filter
    result = result.filter(c => {
      const lessons = Array.isArray(c.lessons) ? c.lessons : [];
      const totalMinutes = lessons.reduce((acc: number, l: any) => acc + (Number(l.duration) || 0), 0);
      return totalMinutes >= durationFilter.min && totalMinutes <= durationFilter.max;
    });

    // Sorting
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
  }, [courses, search, category, level, priceRange, ratingFilter, durationFilter, sort]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleToggleWishlist = async (e: React.MouseEvent, courseId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    try {
      await api.post('/users/wishlist', { courseId });
      await refreshProfile();
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
    }
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3">Category</h3>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                category === c ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Level */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3">Level</h3>
        <div className="space-y-1.5">
          {LEVELS.map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                level === l ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3">Price Range</h3>
        <div className="space-y-1.5">
          {PRICE_RANGES.map(p => (
            <button
              key={p.label}
              onClick={() => setPriceRange(p)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                priceRange.label === p.label ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3">Rating</h3>
        <div className="space-y-1.5">
          {RATING_OPTIONS.map(r => (
            <button
              key={r.label}
              onClick={() => setRatingFilter(r)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                ratingFilter.label === r.label ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3">Duration</h3>
        <div className="space-y-1.5">
          {DURATION_OPTIONS.map(d => (
            <button
              key={d.label}
              onClick={() => setDurationFilter(d)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                durationFilter.label === d.label ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          setCategory('All');
          setLevel('All Levels');
          setPriceRange(PRICE_RANGES[0]);
          setRatingFilter(RATING_OPTIONS[0]);
          setDurationFilter(DURATION_OPTIONS[0]);
          setSearch('');
        }}
        className="w-full px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
              All Platform Courses
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
                  className="input pr-10 appearance-none min-w-[180px] cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs"
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
                className="lg:hidden flex items-center gap-2 btn-secondary dark:bg-slate-800 dark:border-slate-700 cursor-pointer"
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
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sticky top-24">
                <h2 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </h2>
                <FilterPanel />
              </div>
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div className="lg:hidden fixed inset-0 z-50 flex">
                <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                <div className="relative bg-white dark:bg-slate-900 w-72 h-full overflow-y-auto p-5 shadow-2xl">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-slate-900 dark:text-white">Filters</h2>
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
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing <span className="font-semibold text-slate-900 dark:text-white">{filtered.length}</span> courses
                  {category !== 'All' && <span className="text-indigo-600 dark:text-indigo-400 ml-1">in {category}</span>}
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="course-card animate-pulse bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                      <div className="bg-slate-200 dark:bg-slate-800 aspect-video" />
                      <div className="p-4 space-y-2">
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <BookOpen className="w-16 h-16 text-slate-200 dark:text-slate-800 mb-4" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">No courses found</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Try adjusting your filters or search query.</p>
                  <button
                    onClick={() => {
                      setCategory('All');
                      setLevel('All Levels');
                      setPriceRange(PRICE_RANGES[0]);
                      setRatingFilter(RATING_OPTIONS[0]);
                      setDurationFilter(DURATION_OPTIONS[0]);
                      setSearch('');
                    }}
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
                    const isWishlisted = user?.wishlist?.includes(String(course._id || course.id));

                    return (
                      <Link
                        key={course._id || course.id}
                        href={`/courses/${course._id || course.id}`}
                        className="course-card group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden flex flex-col shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="relative overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
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

                          {/* Wishlist Button */}
                          <button
                            onClick={(e) => handleToggleWishlist(e, String(course._id || course.id))}
                            className="absolute bottom-2 right-2 p-1.5 bg-white/90 dark:bg-slate-900/90 rounded-full hover:bg-indigo-50 dark:hover:bg-slate-800 shadow transition-colors cursor-pointer text-red-500"
                            aria-label="Save for later"
                          >
                            <Heart className={`w-4.5 h-4.5 ${isWishlisted ? 'fill-current' : 'text-slate-400 hover:text-red-500'}`} />
                          </button>
                        </div>
                        <div className="p-4 flex-1 flex flex-col space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            {course.category && (
                              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{course.category}</span>
                            )}
                            {course.institutionName && (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded truncate max-w-[120px]" title={course.institutionName}>
                                {course.institutionName}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                            {course.courseTitle}
                          </h3>
                          {course.tutorNames && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                              By: {course.tutorNames}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {lessonCount} lessons</span>
                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {studentCount} enrolled</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-amber-600 dark:text-amber-400 font-bold text-xs">{Number(avgRating).toFixed(1)}</span>
                            <StarRating rating={avgRating} />
                          </div>
                          <div className="flex items-baseline gap-2 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
                            <span className="font-extrabold text-slate-900 dark:text-white">${Number(finalPrice).toFixed(2)}</span>
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
