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
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  loginEmail: (email: string, password: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  loginCustom: (googleId: string, email: string, name: string, role: string) => Promise<void>;
  logout: () => void;
  api: any;
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
    const savedToken = localStorage.getItem('edemy_admin_token');
    const savedUser = localStorage.getItem('edemy_admin_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      const { token: jwtToken, user: loggedUser } = res.data;
      if (loggedUser.role !== 'admin') {
        throw new Error('Access denied: not an admin account.');
      }
      setToken(jwtToken);
      setUser(loggedUser);
      localStorage.setItem('edemy_admin_token', jwtToken);
      localStorage.setItem('edemy_admin_user', JSON.stringify(loggedUser));
    } catch (err) {
      console.error('Admin email login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async () => {
    await loginCustom('admin_test_123', 'admin@edemy.com', 'Edemy Administrator', 'admin');
  };

  const loginCustom = async (
    googleId: string,
    email: string,
    name: string,
    role: string,
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
      localStorage.setItem('edemy_admin_token', jwtToken);
      localStorage.setItem('edemy_admin_user', JSON.stringify(loggedUser));
    } catch (err) {
      console.error('Admin Sign In error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('edemy_admin_token');
    localStorage.removeItem('edemy_admin_user');
  };

  // Configure global authorization header
  api.interceptors.request.use((config) => {
    const activeToken = localStorage.getItem('edemy_admin_token');
    if (activeToken) {
      config.headers.Authorization = `Bearer ${activeToken}`;
    }
    return config;
  });

  return (
    <AuthContext.Provider value={{ user, token, loading, loginEmail, loginDemo, loginCustom, logout, api }}>
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
