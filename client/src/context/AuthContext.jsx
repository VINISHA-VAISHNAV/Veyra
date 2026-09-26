import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

const getRoleFromToken = (token) => {
  try {
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.role || null;
  } catch {
    return null;
  }
};

const normalizeUser = (user, token) => {
  if (!user) return null;

  const tokenRole = getRoleFromToken(token);

  return {
    ...user,
    role: user.role || tokenRole || 'user',
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem('veyra_token')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      const storedToken = localStorage.getItem('veyra_token');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await authApi.getMe();

        if (data.success && data.user) {
          const normalizedUser = normalizeUser(data.user, storedToken);

          setToken(storedToken);
          setUser(normalizedUser);
        } else {
          logout();
        }
      } catch (err) {
        console.warn(
          '[VEYRA Auth] Session expired or invalid:',
          err.message
        );

        localStorage.removeItem('veyra_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUserSession();
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login({
      email,
      password,
    });

    if (data.success && data.token) {
      localStorage.setItem('veyra_token', data.token);

      const normalizedUser = normalizeUser(data.user, data.token);

      setToken(data.token);
      setUser(normalizedUser);
    }

    return data;
  };

  const signup = async (name, email, password) => {
    const data = await authApi.signup({
      name,
      email,
      password,
    });

    if (data.success && data.token) {
      localStorage.setItem('veyra_token', data.token);

      const normalizedUser = normalizeUser(data.user, data.token);

      setToken(data.token);
      setUser(normalizedUser);
    }

    return data;
  };

  const logout = () => {
    localStorage.removeItem('veyra_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};