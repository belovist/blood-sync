import React, { useState, useEffect, useContext, createContext } from 'react';
import { User, authAPI, apiClient } from '../services/api';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: any }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (identifier: string, password: string, role?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login(identifier, password);
      if (response.success) {
        // Check role if provided
        if (role && response.data.user.role !== role) {
          setError(`This account is registered as a ${response.data.user.role}. Please use the correct login page.`);
          setIsLoading(false);
          return false;
        }
        
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem('bloodsync_user', JSON.stringify(response.data.user));
        localStorage.setItem('bloodsync_token', response.data.token);
        
        // Also set token in apiClient
        import('../services/api').then(({ apiClient }) => {
          apiClient.setToken(response.data.token);
        });
        
        setIsLoading(false);
        return true;
      } else {
        setError(response.message || 'Login failed');
        setIsLoading(false);
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: any, role: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      if (role === 'donor') {
        response = await authAPI.registerDonor(userData);
      } else if (role === 'hospital') {
        response = await authAPI.registerHospital(userData);
      } else if (role === 'blood-bank') {
        response = await authAPI.registerBloodBank(userData);
      }
      
      if (response?.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem('bloodsync_user', JSON.stringify(response.data.user));
        localStorage.setItem('bloodsync_token', response.data.token);
        
        // Also set token in apiClient
        apiClient.setToken(response.data.token);
      } else {
        setError(response?.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bloodsync_user');
    localStorage.removeItem('bloodsync_token');
    // Also remove token from apiClient
    apiClient.removeToken();
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('bloodsync_token');
    const savedUser = localStorage.getItem('bloodsync_user');
    
    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(userData);
        // Also set token in apiClient
        apiClient.setToken(savedToken);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('bloodsync_user');
        localStorage.removeItem('bloodsync_token');
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
