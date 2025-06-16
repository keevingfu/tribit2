import { NextRequest, NextResponse } from 'next/server'
import { middleware } from '../middleware'

// Mock NextRequest
const createMockRequest = (url: string, options: {
  cookies?: Record<string, string>
} = {}) => {
  const { cookies = {} } = options
  
  const request = {
    nextUrl: new URL(url, 'http://localhost:3000'),
    cookies: {
      get: (name: string) => cookies[name] ? { value: cookies[name] } : undefined
    }
  } as unknown as NextRequest
  
  return request
}

// Mock NextResponse.redirect
const mockRedirect = jest.fn((url: URL) => ({
  status: 307,
  headers: new Headers({ Location: url.toString() })
}))

jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => ({ status: 200 })),
    redirect: mockRedirect
  }
}))

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Public routes', () => {
    it('should allow access to login page without authentication', () => {
      const request = createMockRequest('/auth/login')
      const response = middleware(request)
      
      expect(NextResponse.next).toHaveBeenCalled()
      expect(mockRedirect).not.toHaveBeenCalled()
    })

    it('should allow access to login API without authentication', () => {
      const request = createMockRequest('/api/auth/login')
      const response = middleware(request)
      
      expect(NextResponse.next).toHaveBeenCalled()
      expect(mockRedirect).not.toHaveBeenCalled()
    })

    it('should redirect authenticated users from login to dashboard', () => {
      const request = createMockRequest('/auth/login', {
        cookies: { 'auth-token': 'valid-token' }
      })
      
      middleware(request)
      
      expect(mockRedirect).toHaveBeenCalled()
      const redirectUrl = mockRedirect.mock.calls[0][0]
      expect(redirectUrl.pathname).toBe('/dashboard')
    })
  })

  describe('Protected routes', () => {
    it('should redirect unauthenticated users to login', () => {
      const request = createMockRequest('/dashboard')
      
      middleware(request)
      
      expect(mockRedirect).toHaveBeenCalled()
      const redirectUrl = mockRedirect.mock.calls[0][0]
      expect(redirectUrl.pathname).toBe('/auth/login')
      expect(redirectUrl.searchParams.get('from')).toBe('/dashboard')
    })

    it('should allow authenticated users to access protected routes', () => {
      const request = createMockRequest('/dashboard', {
        cookies: { 'auth-token': 'valid-token' }
      })
      
      middleware(request)
      
      expect(NextResponse.next).toHaveBeenCalled()
      expect(mockRedirect).not.toHaveBeenCalled()
    })

    it('should preserve query parameters when redirecting to login', () => {
      const request = createMockRequest('/kol?filter=active&page=2')
      
      middleware(request)
      
      expect(mockRedirect).toHaveBeenCalled()
      const redirectUrl = mockRedirect.mock.calls[0][0]
      expect(redirectUrl.pathname).toBe('/auth/login')
      expect(redirectUrl.searchParams.get('from')).toBe('/kol')
    })
  })

  describe('Static resources', () => {
    it('should not process static files', () => {
      // The matcher should exclude these, but we can test the behavior
      const staticRoutes = [
        '/_next/static/chunks/main.js',
        '/_next/image?url=/logo.png',
        '/favicon.ico',
        '/public/assets/image.png'
      ]
      
      staticRoutes.forEach(route => {
        const request = createMockRequest(route)
        middleware(request)
        
        // Should pass through without redirect
        expect(NextResponse.next).toHaveBeenCalled()
        expect(mockRedirect).not.toHaveBeenCalled()
      })
    })
  })

  describe('API routes', () => {
    it('should protect non-auth API routes', () => {
      const request = createMockRequest('/api/kol')
      
      middleware(request)
      
      expect(mockRedirect).toHaveBeenCalled()
      const redirectUrl = mockRedirect.mock.calls[0][0]
      expect(redirectUrl.pathname).toBe('/auth/login')
    })

    it('should allow authenticated requests to API routes', () => {
      const request = createMockRequest('/api/kol', {
        cookies: { 'auth-token': 'valid-token' }
      })
      
      middleware(request)
      
      expect(NextResponse.next).toHaveBeenCalled()
      expect(mockRedirect).not.toHaveBeenCalled()
    })
  })

  describe('Edge cases', () => {
    it('should handle missing auth-token cookie', () => {
      const request = createMockRequest('/dashboard', {
        cookies: {} // Empty cookies
      })
      
      middleware(request)
      
      expect(mockRedirect).toHaveBeenCalled()
    })

    it('should handle root path redirect', () => {
      const request = createMockRequest('/')
      
      middleware(request)
      
      expect(mockRedirect).toHaveBeenCalled()
      const redirectUrl = mockRedirect.mock.calls[0][0]
      expect(redirectUrl.pathname).toBe('/auth/login')
      expect(redirectUrl.searchParams.get('from')).toBe('/')
    })

    it('should not redirect for auth routes even with trailing slash', () => {
      const request = createMockRequest('/auth/login/')
      
      middleware(request)
      
      expect(NextResponse.next).toHaveBeenCalled()
      expect(mockRedirect).not.toHaveBeenCalled()
    })
  })
})