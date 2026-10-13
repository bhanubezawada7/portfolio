import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../config/firebase';
import {
  loginWithEmail,
  registerWithEmail,
  signInWithGoogle,
  logout,
  sendResetPassword,
  checkIsAdmin
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (email: string, pass: string, name?: string) => Promise<User>;
  loginGoogle: () => Promise<User>;
  signOutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const adminStatus = await checkIsAdmin(currentUser);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const u = await loginWithEmail(email, pass);
    const admin = await checkIsAdmin(u);
    setIsAdmin(admin);
    return u;
  };

  const register = async (email: string, pass: string, name?: string) => {
    const u = await registerWithEmail(email, pass, name);
    const admin = await checkIsAdmin(u);
    setIsAdmin(admin);
    return u;
  };

  const loginGoogle = async () => {
    const u = await signInWithGoogle();
    const admin = await checkIsAdmin(u);
    setIsAdmin(admin);
    return u;
  };

  const signOutUser = async () => {
    await logout();
    setUser(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string) => {
    await sendResetPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        login,
        register,
        loginGoogle,
        signOutUser,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
