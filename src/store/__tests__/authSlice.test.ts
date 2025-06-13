import authReducer, { 
  login, 
  logout, 
  setUser, 
  setLoading, 
  setError,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError
} from '@/store/slices/authSlice'
import { mockUser } from '../../../__tests__/utils/mock-data'

describe('authSlice', () => {
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

    it('should handle login', () => {
      const payload = {
        user: mockUser,
        token: 'test-token'
      }
      
      const actual = authReducer(initialState, login(payload))
      
      expect(actual.user).toEqual(mockUser)
      expect(actual.token).toEqual('test-token')
      expect(actual.isAuthenticated).toBe(true)
      expect(actual.loading).toBe(false)
      expect(actual.error).toBe(null)
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

    it('should handle setUser', () => {
      const actual = authReducer(initialState, setUser(mockUser))
      
      expect(actual.user).toEqual(mockUser)
    })

    it('should handle setLoading', () => {
      const actual = authReducer(initialState, setLoading(true))
      
      expect(actual.loading).toBe(true)
    })

    it('should handle setError', () => {
      const error = '认证失败'
      const actual = authReducer(initialState, setError(error))
      
      expect(actual.error).toBe(error)
      expect(actual.loading).toBe(false)
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
})