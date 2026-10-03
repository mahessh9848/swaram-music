import { useState, useCallback } from 'react';

const STORAGE_KEY = 'swaram_demo_auth';

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const login = useCallback((userData) => {
    setUser(userData);
    try {
      if (userData.rememberMe) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      } else {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      }
    } catch (e) {
      console.warn('[useAuth] Storage save failed', e);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('[useAuth] Storage clear failed', e);
    }
  }, []);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  return {
    user,
    isAuthenticated: !!user,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    login,
    logout,
  };
}
