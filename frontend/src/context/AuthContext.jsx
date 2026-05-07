import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext(null);

const readStoredUser = () => {
  const value = localStorage.getItem('user');
  return value ? JSON.parse(value) : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser());
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const persistSession = (session) => {
    if (session?.token) {
      localStorage.setItem('token', session.token);
      setToken(session.token);
    }
    if (session?.user) {
      localStorage.setItem('user', JSON.stringify(session.user));
      setUser(session.user);
    }
  };

  const refreshMe = async () => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      persistSession({ user: data.user });
    } catch (error) {
      logout(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMe();
  }, []);

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    persistSession(data);
    toast.success('Logged in successfully');
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persistSession(data);
    toast.success('Account created successfully');
    return data.user;
  };

  const logout = (showToast = true) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    if (showToast) toast.success('Logged out successfully');
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put('/auth/profile', payload);
    persistSession({ user: data.user });
    toast.success('Profile updated');
    return data.user;
  };

  const changePassword = async (payload) => {
    const { data } = await api.put('/auth/change-password', payload);
    toast.success(data.message || 'Password changed');
  };

  return <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile, changePassword, refreshMe }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
