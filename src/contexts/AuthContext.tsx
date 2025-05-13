
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/iam';
import { users } from '../data/mockData';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for saved session in localStorage
    const savedUser = localStorage.getItem('iamUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('iamUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    // In a real app, this would make an API call
    // For demo purposes, we're just checking against mock data
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      // In a real app, we would validate the password here
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('iamUser', JSON.stringify(user));
      toast.success(`Welcome back, ${user.firstName}!`);
      return user;
    } else {
      toast.error('Invalid credentials');
      return null;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('iamUser');
    toast.info('You have been logged out');
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
