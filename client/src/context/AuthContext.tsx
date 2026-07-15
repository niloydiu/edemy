'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  imageUrl: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  studentIds?: string[];
  parentId?: string;
  enrolledCourses?: string[];
  wishlist?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  loginDemo: (role: 'student' | 'teacher' | 'parent' | 'admin') => Promise<void>;
  loginCustom: (googleId: string, email: string, name: string, role: 'student' | 'teacher' | 'parent' | 'admin') => Promise<void>;
  loginEmail: (email: string, password?: string) => Promise<void>;
  registerEmail: (email: string, name: string, password?: string, role?: 'student' | 'teacher' | 'parent' | 'admin') => Promise<void>;
  logout: () => void;
  api: any;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const api = axios.create({
    baseURL: API_BASE,
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('edemy_token');
    const savedUser = localStorage.getItem('edemy_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginDemo = async (role: 'student' | 'teacher' | 'parent' | 'admin') => {
    // Determine demo credentials matching seeded database entries
    let googleId = 'student_test_123';
    let email = 'jane@student.com';
    let name = 'Jane Student';

    if (role === 'teacher') {
      googleId = 'teacher_test_123';
      email = 'prof@teacher.com';
      name = 'Professor Tech';
    } else if (role === 'parent') {
      googleId = 'parent_test_123';
      email = 'robert@parent.com';
      name = 'Robert Parent';
    } else if (role === 'admin') {
      googleId = 'admin_test_123';
      email = 'admin@edemy.com';
      name = 'Edemy Administrator';
    }

    await loginCustom(googleId, email, name, role);
  };

  const loginCustom = async (
    googleId: string,
    email: string,
    name: string,
    role: 'student' | 'teacher' | 'parent' | 'admin',
  ) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/google`, {
        googleId,
        email,
        name,
        imageUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
        role,
      });

      const { token: jwtToken, user: loggedUser } = res.data;
      setToken(jwtToken);
      setUser(loggedUser);
      localStorage.setItem('edemy_token', jwtToken);
      localStorage.setItem('edemy_user', JSON.stringify(loggedUser));
    } catch (err) {
      console.error('Google Sign In error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginEmail = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });
      const { token: jwtToken, user: loggedUser } = res.data;
      setToken(jwtToken);
      setUser(loggedUser);
      localStorage.setItem('edemy_token', jwtToken);
      localStorage.setItem('edemy_user', JSON.stringify(loggedUser));
    } catch (err) {
      console.error('Email login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerEmail = async (email: string, name: string, password?: string, role?: 'student' | 'teacher' | 'parent' | 'admin') => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, {
        email,
        name,
        password,
        role: role || 'student',
      });
      const { token: jwtToken, user: loggedUser } = res.data;
      setToken(jwtToken);
      setUser(loggedUser);
      localStorage.setItem('edemy_token', jwtToken);
      localStorage.setItem('edemy_user', JSON.stringify(loggedUser));
    } catch (err) {
      console.error('Email register error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('edemy_token');
    localStorage.removeItem('edemy_user');
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      localStorage.setItem('edemy_user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  // Configure global authorization header
  api.interceptors.request.use((config) => {
    const activeToken = localStorage.getItem('edemy_token');
    if (activeToken) {
      config.headers.Authorization = `Bearer ${activeToken}`;
    }
    return config;
  });

  return (
    <AuthContext.Provider value={{ user, token, loading, loginDemo, loginCustom, loginEmail, registerEmail, logout, api, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
