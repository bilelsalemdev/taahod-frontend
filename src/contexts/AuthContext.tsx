import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import { authService } from '../services/authService';
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthContextType,
} from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user on mount
    const initAuth = async () => {
      const savedToken = authService.getToken();
      const savedUser = authService.getUser();

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);

        // Verify token is still valid
        try {
          const response = await authService.getCurrentUser();
          setUser(response.data.user);
          authService.saveUser(response.data.user);
        } catch (error) {
          // Token invalid, clear auth
          authService.removeToken();
          authService.removeUser();
          setToken(null);
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      const { user: userData, token: userToken } = response.data;

      setUser(userData);
      setToken(userToken);
      authService.saveToken(userToken);
      authService.saveUser(userData);

      message.success(response.messageAr || response.message || 'تم تسجيل الدخول بنجاح');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.messageAr ||
        error.response?.data?.error?.message ||
        'فشل تسجيل الدخول';
      message.error(errorMessage);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      const { user: userData, token: userToken } = response.data;

      setUser(userData);
      setToken(userToken);
      authService.saveToken(userToken);
      authService.saveUser(userData);

      message.success(response.messageAr || response.message || 'تم إنشاء الحساب بنجاح');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.messageAr ||
        error.response?.data?.error?.message ||
        'فشل إنشاء الحساب';
      message.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    authService.logout().catch(() => {
      // Ignore logout API errors
    });

    setUser(null);
    setToken(null);
    authService.removeToken();
    authService.removeUser();
    message.success('تم تسجيل الخروج بنجاح');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    authService.saveUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
