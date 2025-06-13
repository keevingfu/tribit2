'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '../store/slices/authSlice';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch(loginStart());
    
    try {
      // Using demo auth service
      const { authService } = await import('../services/auth.service');
      const data = await authService.login(credentials.email, credentials.password);
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      dispatch(loginSuccess({
        user: data.user,
        token: data.token,
      }));
      
      router.push('/dashboard');
    } catch (error) {
      dispatch(loginFailure(error instanceof Error ? error.message : 'Login failed'));
    }
  }, [dispatch, router]);

  const logoutUser = useCallback(async () => {
    const { authService } = await import('../services/auth.service');
    await authService.logout();
    localStorage.removeItem('token');
    dispatch(logout());
    router.push('/login' as any);
  }, [dispatch, router]);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      // Using demo auth service
      const { authService } = await import('../services/auth.service');
      const user = await authService.verify(token);
      
      dispatch(loginSuccess({
        user,
        token,
      }));
      
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      dispatch(logout());
      return false;
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout: logoutUser,
    checkAuth,
  };
};