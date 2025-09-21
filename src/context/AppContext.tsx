import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CustomerProfile } from '../lib/firestore';

interface AppContextType {
  user: User | null;
  profile: CustomerProfile | null;
  isAdmin: boolean;
  outletId: string;
  setUser: (user: User | null) => void;
  setProfile: (profile: CustomerProfile | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const outletId = 'default'; // In production, this would be dynamic

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('loyalty_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('loyalty_user');
      }
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('loyalty_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('loyalty_user');
    }
  }, [user]);

  return (
    <AppContext.Provider value={{
      user,
      profile,
      isAdmin,
      outletId,
      setUser,
      setProfile,
      setIsAdmin
    }}>
      {children}
    </AppContext.Provider>
  );
};