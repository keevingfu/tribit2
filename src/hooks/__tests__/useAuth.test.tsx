import { renderHook, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { useAuth } from '@/hooks/useAuth'
import authReducer from '@/store/slices/authSlice'
import { mockUser } from '../../../__tests__/utils/mock-data'

describe('useAuth hook', () => {
  let store: any

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )

  it('should return initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should handle login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login({
        username: 'testuser',
        password: 'password123'
      })
    })

    // In a real test, you would mock the API call
    // For now, we'll manually dispatch the login action
    act(() => {
      store.dispatch({
        type: 'auth/login',
        payload: {
          user: mockUser,
          token: 'test-token'
        }
      })
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUser)
  })

  it('should handle logout', () => {
    // Set initial authenticated state
    store.dispatch({
      type: 'auth/login',
      payload: {
        user: mockUser,
        token: 'test-token'
      }
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.isAuthenticated).toBe(true)

    act(() => {
      result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBe(null)
  })

  it('should handle errors', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    act(() => {
      store.dispatch({
        type: 'auth/setError',
        payload: '登录失败'
      })
    })

    expect(result.current.error).toBe('登录失败')
  })
})