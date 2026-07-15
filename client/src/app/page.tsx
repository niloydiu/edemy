'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
  ArrowRight, Star, Users, BookOpen, Award, TrendingUp, CheckCircle,
  Monitor, MapPin, FileText, Globe, Play, ChevronRight, Zap,
  BarChart2, MessageSquare, Shield, Clock, Search, Cpu, Smartphone, Cloud, Palette, Megaphone
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Web Development', icon: Globe, count: '48 courses' },
  { name: 'Data Science', icon: BarChart2, count: '36 courses' },
  { name: 'Artificial Intelligence', icon: Cpu, count: '28 courses' },
  { name: 'Mobile Development', icon: Smartphone, count: '22 courses' },
  { name: 'Cloud & DevOps', icon: Cloud, count: '30 courses' },
  { name: 'Cybersecurity', icon: Shield, count: '18 courses' },
  { name: 'UI/UX Design', icon: Palette, count: '24 courses' },
  { name: 'Digital Marketing', icon: Megaphone, count: '20 courses' },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Chen', role: 'Sample Success Story (React Bootcamp Alumnus)', rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
    text: 'Edemy completely transformed my career. I landed my dream job 3 months after finishing the React Bootcamp. The offline lab sessions were incredibly effective.',
  },
  {
    name: 'Marcus Johnson', role: 'Sample Success Story (Data Science Alumnus)', rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
    text: 'The Data Science track is world-class. Real projects, live online sessions with tutors, and offline workshops that helped me build an actual portfolio. Best investment ever.',
  },
  {
    name: 'Priya Patel', role: 'Sample Success Story (UX Design Alumnus)', rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
    text: 'I\'ve tried Udemy, Coursera — Edemy\'s hybrid approach (online + offline + PDF resources) is simply unmatched. The parent monitoring feature let my family support my learning journey.',
  },
];

const FEATURES = [
  {
    icon: Monitor, title: 'Live Online Classes', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    desc: 'Join live video sessions with Google Meet integration. Interactive, recorded, and available on-demand.',
  },
  {
    icon: MapPin, title: 'Physical Classrooms', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    desc: 'Attend real in-person workshops at our learning centers with hands-on labs and group projects.',
  },
  {
    icon: FileText, title: 'PDF & Study Materials', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30',
    desc: 'Download comprehensive PDF resources, reference guides, and cheat sheets for every lesson.',
  },
  {
    icon: BarChart2, title: 'Progress Tracking', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30',
    desc: 'Track lesson completion, quiz scores, and certificates. Parents can monitor their child\'s learning.',
  },
  {
    icon: MessageSquare, title: 'Tutor Direct Chat', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30',
    desc: 'Message instructors directly for personalized guidance, career advice, and code reviews.',
  },
  {
    icon: Award, title: 'Verified Certificates', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    desc: 'Earn shareable completion certificates recognized by top employers in 50+ countries.',
  },
];

const STATS = [
  { value: '100+', label: 'Expert Courses', icon: BookOpen },
  { value: '12,000+', label: 'Active Students', icon: Users },
  { value: '180+', label: 'Certified Tutors', icon: Award },
  { value: '98%', label: 'Satisfaction Rate', icon: Star },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }),
};

export default function Home() {
  const { api } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/courses').then(res => {
      setFeaturedCourses(res.data.slice(0, 8));
    }).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/courses?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* ════════ HERO ════════ */}
      <section className="hero-gradient text-white py-20 lg:py-28 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden" animate="visible"
              className="space-y-8"
            >
              <motion.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-sm font-medium text-indigo-200 backdrop-blur-sm">
                  <Zap className="w-4 h-4" /> New: 100+ Courses Just Added
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
                Learn skills that
                <span className="block text-indigo-300"> move you forward.</span>
              </motion.h1>

              <motion.p variants={fadeUp} custom={2} className="text-lg text-indigo-100 max-w-xl leading-relaxed">
                Join 12,000+ students in live online classes, in-person workshops, and structured courses taught by industry experts.
              </motion.p>

              {/* Search Bar */}
              <motion.form variants={fadeUp} custom={3} onSubmit={handleSearch} className="flex gap-0 w-full max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for courses, topics, or skills..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-l-xl text-slate-900 bg-white text-sm font-medium focus:outline-none border-0"
                  />
                </div>
                <button type="submit" className="px-6 py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-r-xl transition-colors text-sm whitespace-nowrap">
                  Search
                </button>
              </motion.form>

              {/* Quick Links */}
              <motion.div variants={fadeUp} custom={4} className="flex items-center gap-2 text-sm text-indigo-200">
                <span className="font-medium">Popular:</span>
                {['React', 'Python', 'Figma', 'AWS'].map(tag => (
                  <Link key={tag} href={`/courses?search=${tag}`}
                    className="px-3 py-1 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors">
                    {tag}
                  </Link>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Right — Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="hidden lg:block"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl border border-white/10">
                  <div className="w-12 h-12 rounded-lg bg-indigo-500/30 flex items-center justify-center text-2xl">🚀</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Next Live Session</p>
                    <p className="text-indigo-200 text-xs">React 18 Deep Dive — Today at 14:00</p>
                  </div>
                  <span className="ml-auto bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">LIVE</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {STATS.map(s => (
                    <div key={s.label} className="p-4 bg-white/10 rounded-xl border border-white/10 text-center">
                      <div className="text-2xl font-extrabold text-white">{s.value}</div>
                      <div className="text-xs text-indigo-200 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 p-3 bg-white/10 rounded-xl border border-white/10">
                  <div className="flex -space-x-2">
                    {['photo-1494790108377-be9c29b29330', 'photo-1507003211169-0a1dd7228f2d', 'photo-1438761681033-6461ffad8d80'].map((p, i) => (
                      <img key={i} src={`https://images.unsplash.com/${p}?w=40&h=40&fit=crop`}
                        className="w-8 h-8 rounded-full border-2 border-indigo-800 object-cover" alt="" />
                    ))}
                  </div>
                  <p className="text-xs text-indigo-100 font-medium">
                    <span className="text-white font-bold">2,340 students</span> enrolled this week
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════ TRUSTED BY ════════ */}
      <section className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
            Trusted by professionals at leading companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale dark:invert">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Stripe', 'Airbnb'].map(c => (
              <span key={c} className="text-lg font-black text-slate-700 dark:text-slate-300 tracking-tight">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CATEGORIES ════════ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="section-eyebrow mb-2">
                <TrendingUp className="w-4 h-4" /> Top Categories
              </p>
              <h2 className="section-title">Explore by subject</h2>
            </div>
            <Link href="/courses" className="hidden sm:flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline">
              Browse All Subjects <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link href={`/courses?category=${encodeURIComponent(cat.name)}`}
                  className="group flex flex-col items-center p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md hover:shadow-indigo-50/20 transition-all duration-200 text-center cursor-pointer">
                  <cat.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-3" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">{cat.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cat.count}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ FEATURED COURSES ════════ */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="section-eyebrow mb-2">
                <Star className="w-4 h-4" /> Most Popular
              </p>
              <h2 className="section-title">Featured Courses</h2>
            </div>
            <Link href="/courses" className="btn-secondary dark:bg-slate-800 dark:border-slate-700 dark:text-white text-sm">
              All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredCourses.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="course-card animate-pulse">
                  <div className="bg-slate-200 aspect-video w-full" />
                  <div className="course-card-body">
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                    <div className="h-8 bg-slate-200 rounded mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map((course, i) => {
                const avgRating = course.ratings?.length
                  ? (course.ratings.reduce((a: number, r: any) => a + (Number(r.rating) || 0), 0) / course.ratings.length)
                  : 4.8;
                const finalPrice = (Number(course.coursePrice) || 0) * (1 - (Number(course.discount) || 0) / 100);
                const lessonCount = course.lessons?.length || 0;

                return (
                  <motion.div
                    key={course._id || course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link href={`/courses/${course._id || course.id}`} className="course-card group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                      <div className="relative overflow-hidden aspect-video bg-slate-100 dark:bg-slate-800">
                        <img
                          src={course.courseThumbnail || `https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop`}
                          alt={course.courseTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1587620962725-abab19836100?w=400&h=225&fit=crop';
                          }}
                        />
                        {course.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                            -{course.discount}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-2 flex flex-col h-full">
                        {course.category && (
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{course.category}</span>
                        )}
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                          {course.courseTitle}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{lessonCount} lessons</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-600 dark:text-amber-400 font-bold text-xs">{Number(avgRating).toFixed(1)}</span>
                          <StarRating rating={avgRating} />
                          <span className="text-xs text-slate-400 dark:text-slate-550">({course.ratings?.length || 0})</span>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white text-base">${Number(finalPrice).toFixed(2)}</span>
                            {course.discount > 0 && (
                              <span className="text-xs text-slate-400 line-through">${Number(course.coursePrice).toFixed(2)}</span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center gap-0.5">
                            Enroll <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ════════ WHY EDEMY (Features Grid) ════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-4">
            <p className="section-eyebrow justify-center">
              <CheckCircle className="w-4 h-4" /> Why Choose Edemy
            </p>
            <h2 className="section-title">Everything you need to succeed</h2>
            <p className="section-subtitle mx-auto text-center">
              We combine the flexibility of online learning with the depth of in-person instruction — creating a truly hybrid educational experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-6 group"
              >
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-2">{f.desc}</p>
                {f.title === 'Progress Tracking' && (
                  <Link href="/dashboard-preview" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold inline-flex items-center gap-1">
                    Try interactive preview &rarr;
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ STATS BAND ════════ */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '100+', label: 'Expert Courses', sub: 'Across 10+ subjects' },
              { value: '12,000+', label: 'Active Students', sub: 'In 40+ countries' },
              { value: '180+', label: 'Certified Tutors', sub: 'Industry professionals' },
              { value: '98%', label: 'Satisfaction Rate', sub: 'Based on 5,000 reviews' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-black text-white">{s.value}</div>
                <div className="text-indigo-100 font-semibold mt-1">{s.label}</div>
                <div className="text-indigo-305 text-indigo-200 text-sm mt-0.5">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-4">
            <p className="section-eyebrow justify-center">
              <Star className="w-4 h-4" /> Student Reviews
            </p>
            <h2 className="section-title">Loved by learners worldwide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="card p-6 space-y-4"
              >
                <StarRating rating={t.rating} />
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 dark:border-indigo-950" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA BANNER ════════ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-2xl shadow-indigo-500/30"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
              Ready to start your learning journey?
            </h2>
            <p className="text-indigo-100 mb-8 text-lg max-w-xl mx-auto">
              Join 12,000+ students already learning. Enroll in any course today and get lifetime access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors text-base">
                Browse Courses
              </Link>
              <Link href="/auth/login" className="px-8 py-4 bg-white/10 backdrop-blur text-white font-bold rounded-xl border border-white/30 hover:bg-white/20 transition-colors text-base">
                Create Free Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold text-xl">Edemy</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                A hybrid learning platform offering live classes, in-person workshops, and expert-curated courses.
              </p>
            </div>
            {[
              {
                title: 'Platform',
                links: [
                  { label: 'Browse Courses', href: '/courses' },
                  { label: 'Become a Tutor', href: '/auth/login' },
                  { label: 'For Parents', href: '/auth/login' }
                ]
              }
            ].map(col => (
              <div key={col.title}>
                <p className="text-white font-semibold text-sm mb-4">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map(l => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} Edemy Platforms Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-500">Demo Platform • Secure SSL Connection</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
