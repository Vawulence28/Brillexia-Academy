'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ba_access_token');
    const storedUser = localStorage.getItem('ba_user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('ba_access_token');
        localStorage.removeItem('ba_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('ba_access_token', res.accessToken);
    localStorage.setItem('ba_user', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('ba_access_token');
    localStorage.removeItem('ba_user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);