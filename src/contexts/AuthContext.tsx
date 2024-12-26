// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SigninForm, SignupForm, UpdateProfileForm, UpdatePasswordForm } from '../types/auth';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signin: (form: SigninForm) => Promise<void>;
  signup: (form: SignupForm) => Promise<void>;
  signout: () => void;
  updateProfile: (form: UpdateProfileForm) => Promise<void>;
  updatePassword: (form: UpdatePasswordForm) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/v1/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const signin = async (form: SigninForm) => {
    try {
      const response = await axios.post('/api/v1/auth/signin', form);
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      setError(null);
    } catch (err) {
      setError('Invalid email or password');
      throw err;
    }
  };

  const signup = async (form: SignupForm) => {
    try {
      await axios.post('/api/v1/auth/signup', form);
      setError(null);
    } catch (err) {
      setError('Signup failed. Please try again.');
      throw err;
    }
  };

  const signout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const updateProfile = async (form: UpdateProfileForm) => {
    try {
      const response = await axios.put('/api/v1/users/profile', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to update profile');
      throw err;
    }
  };

  const updatePassword = async (form: UpdatePasswordForm) => {
    try {
      await axios.put('/api/v1/users/password', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setError(null);
    } catch (err) {
      setError('Failed to update password');
      throw err;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        error, 
        signin, 
        signup, 
        signout, 
        updateProfile,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};