'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen, LogOut, User, LayoutDashboard, Search,
  Bell, ChevronDown, Menu, X, GraduationCap, Sun, Moon
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const getDashboardHref = () => {
    if (!user) return '/auth/login';
    const roleMap: Record<string, string> = {
      admin: '/dashboard/admin',
      teacher: '/dashboard/tutor',
      parent: '/dashboard/parent',
      student: '/dashboard/student',
    };
    return roleMap[user.role] || '/dashboard/student';
  };

  const isHeroPage = pathname === '/';
  const navClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled || !isHeroPage
      ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm'
      : 'bg-transparent'
  }`;
  const textClass = scrolled || !isHeroPage ? 'text-slate-700 dark:text-slate-200' : 'text-white';
  const logoClass = scrolled || !isHeroPage ? 'text-indigo-600 dark:text-indigo-400' : 'text-indigo-300';

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className={`font-extrabold text-xl ${scrolled || !isHeroPage ? 'text-slate-900' : 'text-white'}`}>
              Edemy
            </span>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '/courses', label: 'Courses' },
              { href: '/courses?type=online', label: 'Live Classes' },
              { href: '/courses?type=offline', label: 'Workshops' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-indigo-50 text-indigo-700'
                    : `${textClass} hover:bg-slate-100/50`
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                scrolled || !isHeroPage
                  ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
            </button>

            {user ? (
              <>
                <Link
                  href="/courses"
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Search className="w-4 h-4" /> Search
                </Link>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm transition-all"
                  >
                    {user.imageUrl ? (
                      <img src={user.imageUrl} alt={user.name}
                        className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="font-semibold text-sm text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        <span className="mt-1.5 inline-block badge badge-primary capitalize">
                          {user.role}
                        </span>
                      </div>
                      <div className="py-1.5">
                        <Link
                          href={getDashboardHref()}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Profile
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 py-1.5">
                        <button
                          onClick={() => { setProfileOpen(false); logout(); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    scrolled || !isHeroPage
                      ? 'text-slate-700 hover:bg-slate-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Sign Up Free
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2 rounded-lg ${textClass} hover:bg-slate-100 transition-colors`}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <Link href="/courses" onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Courses</Link>
            <Link href="/courses?type=online" onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Live Classes</Link>
            <Link href="/courses?type=offline" onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">Workshops</Link>
            {user ? (
              <>
                <Link href={getDashboardHref()} onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40">My Dashboard</Link>
                <button onClick={() => { setMenuOpen(false); logout(); }}
                  className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20">Sign Out</button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-white bg-indigo-600 text-center">Sign In / Register</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
