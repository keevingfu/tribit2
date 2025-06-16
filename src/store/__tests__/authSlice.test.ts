import authReducer, { 
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  clearError,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  login
} from '@/store/slices/authSlice'
import { configureStore } from '@reduxjs/toolkit'

describe('authSlice', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'admin' as const,
    avatar: 'https://example.com/avatar.jpg'
  }

  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }

  describe('reducers', () => {
    it('should handle initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })

    it('should handle loginStart', () => {
      const actual = authReducer(initialState, loginStart())
      
      expect(actual.loading).toBe(true)
      expect(actual.error).toBe(null)
    })

    it('should handle loginSuccess', () => {
      const stateWithLoading = { ...initialState, loading: true }
      const payload = {
        user: mockUser,
        token: 'test-token'
      }
      
      const actual = authReducer(stateWithLoading, loginSuccess(payload))
      
      expect(actual.user).toEqual(mockUser)
      expect(actual.token).toEqual('test-token')
      expect(actual.isAuthenticated).toBe(true)
      expect(actual.loading).toBe(false)
      expect(actual.error).toBe(null)
    })

    it('should handle loginFailure', () => {
      const stateWithLoading = { ...initialState, loading: true }
      const error = '用户名或密码错误'
      
      const actual = authReducer(stateWithLoading, loginFailure(error))
      
      expect(actual.loading).toBe(false)
      expect(actual.error).toBe(error)
      expect(actual.isAuthenticated).toBe(false)
    })

    it('should handle logout', () => {
      const authenticatedState = {
        user: mockUser,
        token: 'test-token',
        isAuthenticated: true,
        loading: false,
        error: null,
      }
      
      const actual = authReducer(authenticatedState, logout())
      
      expect(actual).toEqual(initialState)
    })

    it('should handle updateUser', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      }
      
      const updates = { name: 'Updated Name' }
      const actual = authReducer(stateWithUser, updateUser(updates))
      
      expect(actual.user).toEqual({ ...mockUser, ...updates })
    })

    it('should not update user when user is null', () => {
      const updates = { name: 'Updated Name' }
      const actual = authReducer(initialState, updateUser(updates))
      
      expect(actual.user).toBe(null)
    })

    it('should handle clearError', () => {
      const stateWithError = { ...initialState, error: 'Some error' }
      const actual = authReducer(stateWithError, clearError())
      
      expect(actual.error).toBe(null)
    })
  })

  describe('selectors', () => {
    const state = {
      auth: {
        user: mockUser,
        token: 'test-token',
        isAuthenticated: true,
        loading: false,
        error: '测试错误',
      }
    }

    it('should select user', () => {
      expect(selectUser(state as any)).toEqual(mockUser)
    })

    it('should select token', () => {
      expect(selectToken(state as any)).toBe('test-token')
    })

    it('should select isAuthenticated', () => {
      expect(selectIsAuthenticated(state as any)).toBe(true)
    })

    it('should select loading', () => {
      expect(selectAuthLoading(state as any)).toBe(false)
    })

    it('should select error', () => {
      expect(selectAuthError(state as any)).toBe('测试错误')
    })
  })

  describe('thunk actions', () => {
    let store: any

    beforeEach(() => {
      store = configureStore({
        reducer: {
          auth: authReducer
        }
      })
    })

    it('should handle successful login with correct credentials', async () => {
      await store.dispatch(login({ username: 'admin', password: 'admin123' }))
      
      const state = store.getState().auth
      expect(state.isAuthenticated).toBe(true)
      expect(state.user).toEqual({
        id: '1',
        email: 'admin@tribit.com',
        name: 'Admin User',
        role: 'admin'
      })
      expect(state.token).toBe('mock-jwt-token')
      expect(state.error).toBe(null)
    })

    it('should handle failed login with incorrect credentials', async () => {
      await store.dispatch(login({ username: 'wrong', password: 'invalid' }))
      
      const state = store.getState().auth
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBe(null)
      expect(state.token).toBe(null)
      expect(state.error).toBe('用户名或密码错误')
    })

    it('should set loading state during login', async () => {
      const promise = store.dispatch(login({ username: 'admin', password: 'admin123' }))
      
      // Check loading state immediately after dispatch
      let state = store.getState().auth
      expect(state.loading).toBe(true)
      
      await promise
      
      // Loading should be false after completion
      state = store.getState().auth
      expect(state.loading).toBe(false)
    })
  })
})