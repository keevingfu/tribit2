import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import authReducer from '@/store/slices/authSlice'
import * as authService from '@/services/auth.service'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock auth service
jest.mock('@/services/auth.service', () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    verify: jest.fn()
  }
}))

describe('useAuth hook', () => {
  let store: any
  let mockPush: jest.Mock
  let mockAuthService: any

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks()
    
    // Clear localStorage
    localStorage.clear()
    
    // Setup store
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    })

    // Setup router mock
    mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    })

    // Setup auth service mocks
    mockAuthService = authService.authService as jest.Mocked<typeof authService.authService>
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )

  describe('initial state', () => {
    it('should return initial auth state', () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBe(null)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })
  })

  describe('login', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin' as const
    }

    it('should handle successful login', async () => {
      mockAuthService.login.mockResolvedValue({
        user: mockUser,
        token: 'test-token'
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123'
        })
      })

      expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.error).toBe(null)
      expect(localStorage.getItem('token')).toBe('test-token')
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })

    it('should handle login failure', async () => {
      const errorMessage = '邮箱或密码错误'
      mockAuthService.login.mockRejectedValue(new Error(errorMessage))

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.login({
          email: 'wrong@example.com',
          password: 'wrongpass'
        })
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBe(null)
      expect(result.current.error).toBe(errorMessage)
      expect(localStorage.getItem('token')).toBe(null)
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should set loading state during login', async () => {
      mockAuthService.login.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          user: mockUser,
          token: 'test-token'
        }), 100))
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      // Check loading state before login
      expect(result.current.loading).toBe(false)

      const loginPromise = act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123'
        })
      })

      // Check loading state during login
      expect(result.current.loading).toBe(true)

      await loginPromise

      // Check loading state after login
      expect(result.current.loading).toBe(false)
    })
  })

  describe('logout', () => {
    it('should handle logout successfully', async () => {
      mockAuthService.logout.mockResolvedValue(undefined)

      // Set initial authenticated state
      store.dispatch({
        type: 'auth/loginSuccess',
        payload: {
          user: { id: '1', email: 'test@example.com', name: 'Test', role: 'admin' },
          token: 'test-token'
        }
      })
      localStorage.setItem('token', 'test-token')

      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.isAuthenticated).toBe(true)

      await act(async () => {
        await result.current.logout()
      })

      expect(mockAuthService.logout).toHaveBeenCalled()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBe(null)
      expect(localStorage.getItem('token')).toBe(null)
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  describe('checkAuth', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin' as const
    }

    it('should verify token and authenticate user', async () => {
      localStorage.setItem('token', 'valid-token')
      mockAuthService.verify.mockResolvedValue(mockUser)

      const { result } = renderHook(() => useAuth(), { wrapper })

      let authResult: boolean = false
      await act(async () => {
        authResult = await result.current.checkAuth()
      })

      expect(mockAuthService.verify).toHaveBeenCalledWith('valid-token')
      expect(authResult).toBe(true)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(mockUser)
    })

    it('should return false when no token exists', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      let authResult: boolean = false
      await act(async () => {
        authResult = await result.current.checkAuth()
      })

      expect(mockAuthService.verify).not.toHaveBeenCalled()
      expect(authResult).toBe(false)
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should handle invalid token', async () => {
      localStorage.setItem('token', 'invalid-token')
      mockAuthService.verify.mockRejectedValue(new Error('Invalid token'))

      const { result } = renderHook(() => useAuth(), { wrapper })

      let authResult: boolean = false
      await act(async () => {
        authResult = await result.current.checkAuth()
      })

      expect(mockAuthService.verify).toHaveBeenCalledWith('invalid-token')
      expect(authResult).toBe(false)
      expect(result.current.isAuthenticated).toBe(false)
      expect(localStorage.getItem('token')).toBe(null)
    })
  })

  describe('integration scenarios', () => {
    it('should handle session persistence', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin' as const
      }

      // Simulate successful login
      mockAuthService.login.mockResolvedValue({
        user: mockUser,
        token: 'test-token'
      })

      const { result, rerender } = renderHook(() => useAuth(), { wrapper })

      // Login
      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123'
        })
      })

      expect(result.current.isAuthenticated).toBe(true)

      // Simulate page refresh by creating new hook instance
      mockAuthService.verify.mockResolvedValue(mockUser)
      
      const { result: newResult } = renderHook(() => useAuth(), { wrapper })

      // Check auth status
      await act(async () => {
        await newResult.current.checkAuth()
      })

      expect(newResult.current.isAuthenticated).toBe(true)
      expect(newResult.current.user).toEqual(mockUser)
    })

    it('should handle concurrent login attempts', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin' as const
      }

      mockAuthService.login.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          user: mockUser,
          token: 'test-token'
        }), 100))
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      // Attempt multiple logins concurrently
      await act(async () => {
        const promises = [
          result.current.login({ email: 'test@example.com', password: 'password123' }),
          result.current.login({ email: 'test@example.com', password: 'password123' })
        ]
        await Promise.all(promises)
      })

      // Should still result in single authenticated state
      expect(result.current.isAuthenticated).toBe(true)
      expect(mockAuthService.login).toHaveBeenCalledTimes(2)
    })
  })
})