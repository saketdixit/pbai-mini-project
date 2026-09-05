import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('aura_admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const user = await api.getMe();
          setAdmin(user);
        } catch {
          localStorage.removeItem('aura_admin_token');
          setToken(null);
          setAdmin(null);
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [token]);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    localStorage.setItem('aura_admin_token', data.access_token);
    setToken(data.access_token);
    setAdmin({ username: data.username, role: 'admin' });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('aura_admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, isAuthenticated: !!admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
