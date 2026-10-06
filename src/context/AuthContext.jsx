import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/apiService';

const AuthContext = createContext(null);
const USER_STORAGE_KEY = 'procv_auth_user_v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [pendingRedirectPage, setPendingRedirectPage] = useState(null);

  // Sinkronkan status plan user secara real-time dari database MySQL
  const refreshUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      const freshUser = await authApi.getUserById(user.id);
      if (freshUser) {
        setUser((prev) => {
          const updated = {
            ...prev,
            ...freshUser,
            plan_status: freshUser.plan_status || 'free',
          };
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.warn('Gagal memuat status user terkini dari database MySQL:', err.message);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      refreshUser();
    }
  }, [user?.id, refreshUser]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      const userData = res.data;
      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setIsAuthModalOpen(false);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await authApi.register(name, email, password);
      const userData = res.data;
      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setIsAuthModalOpen(false);
      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const upgradeToPro = async (planName = 'Pro Membership Lifetime', amount = 49000, paymentMethod = 'qris') => {
    if (!user) {
      setIsAuthModalOpen(true);
      return { success: false, message: 'Silakan login terlebih dahulu.' };
    }

    setLoading(true);
    try {
      const res = await authApi.upgradePlan(user.id, planName, amount, paymentMethod);
      const updatedUser = {
        ...user,
        ...res.data.user,
        plan_status: 'pro',
      };
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setIsUpgradeModalOpen(false);
      return { success: true, message: res.message, data: res.data };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const openAuthModal = (mode = 'login', redirectPage = null) => {
    setAuthModalMode(mode);
    setPendingRedirectPage(redirectPage);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingRedirectPage(null);
  };

  const openUpgradeModal = () => {
    setIsUpgradeModalOpen(true);
  };

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
  };

  const isPro = user?.plan_status === 'pro';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn,
        isPro,
        login,
        register,
        logout,
        refreshUser,
        upgradeToPro,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        isUpgradeModalOpen,
        openUpgradeModal,
        closeUpgradeModal,
        pendingRedirectPage,
        setPendingRedirectPage,
      }}
    >
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
