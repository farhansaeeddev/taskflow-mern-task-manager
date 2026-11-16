import { createContext, useState, useEffect, useCallback } from 'react';
import { getStoredToken, setStoredToken } from '../api/apiClient';
import { getCurrentUserApi, loginUserApi, registerUserApi } from '../api/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Verify token and load current user on app initialization
  useEffect(() => {
    const loadUser = async () => {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUserApi();
        setUser(data.user);
      } catch {
        // Token is invalid or expired; clear it
        setStoredToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = useCallback(async (userData) => {
    setAuthError(null);
    try {
      const data = await registerUserApi(userData);
      setStoredToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, message: error.message };
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setAuthError(null);
    try {
      const data = await loginUserApi(credentials);
      setStoredToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, message: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
    setAuthError(null);
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        authError,
        register,
        login,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
