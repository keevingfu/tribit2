import { NextRequest } from 'next/server'
import { POST as loginRoute } from '../login/route'
import { POST as logoutRoute } from '../logout/route'
import { GET as verifyRoute } from '../verify/route'
import { POST as refreshRoute } from '../refresh/route'

// Mock NextRequest
const createMockRequest = (options: {
  method?: string
  body?: any
  cookies?: Record<string, string>
} = {}) => {
  const { method = 'GET', body, cookies = {} } = options
  
  const request = {
    method,
    json: async () => body,
    cookies: {
      get: (name: string) => cookies[name] ? { value: cookies[name] } : undefined
    }
  } as unknown as NextRequest
  
  return request
}

describe('Auth API Routes', () => {
  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const request = createMockRequest({
        method: 'POST',
        body: {
          email: 'demo@example.com',
          password: 'demo123'
        }
      })

      const response = await loginRoute(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('user')
      expect(data).toHaveProperty('token')
      expect(data.user.email).toBe('demo@example.com')
      
      // Check if auth cookie is set
      const setCookieHeader = response.headers.get('set-cookie')
      expect(setCookieHeader).toContain('auth-token=')
    })

    it('should return 400 for invalid email format', async () => {
      const request = createMockRequest({
        method: 'POST',
        body: {
          email: 'invalid-email',
          password: 'demo123'
        }
      })

      const response = await loginRoute(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid email format')
    })

    it('should return 400 for short password', async () => {
      const request = createMockRequest({
        method: 'POST',
        body: {
          email: 'demo@example.com',
          password: '123'
        }
      })

      const response = await loginRoute(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Password must be at least 6 characters')
    })

    it('should return 401 for invalid credentials', async () => {
      const request = createMockRequest({
        method: 'POST',
        body: {
          email: 'wrong@example.com',
          password: 'wrongpass'
        }
      })

      const response = await loginRoute(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('邮箱或密码错误')
    })

    it('should handle missing request body', async () => {
      const request = createMockRequest({
        method: 'POST',
        body: null
      })

      const response = await loginRoute(request)
      expect(response.status).toBe(500)
    })
  })

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const request = createMockRequest({
        method: 'POST'
      })

      const response = await logoutRoute(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      
      // Check if auth cookie is cleared
      const setCookieHeader = response.headers.get('set-cookie')
      expect(setCookieHeader).toContain('auth-token=')
      expect(setCookieHeader).toContain('Max-Age=0')
    })
  })

  describe('GET /api/auth/verify', () => {
    it('should verify valid token successfully', async () => {
      // First login to get a valid token
      const loginRequest = createMockRequest({
        method: 'POST',
        body: {
          email: 'demo@example.com',
          password: 'demo123'
        }
      })
      
      const loginResponse = await loginRoute(loginRequest)
      const loginData = await loginResponse.json()
      const token = loginData.token

      // Now verify the token
      const verifyRequest = createMockRequest({
        cookies: { 'auth-token': token }
      })

      const response = await verifyRoute(verifyRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user.email).toBe('demo@example.com')
      expect(data.token).toBe(token)
    })

    it('should return 401 for missing token', async () => {
      const request = createMockRequest()

      const response = await verifyRoute(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('No authentication token found')
    })

    it('should return 401 for invalid token', async () => {
      const request = createMockRequest({
        cookies: { 'auth-token': 'invalid-token' }
      })

      const response = await verifyRoute(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid or expired token')
    })
  })

  describe('POST /api/auth/refresh', () => {
    it('should refresh token successfully', async () => {
      // First login to get a valid token
      const loginRequest = createMockRequest({
        method: 'POST',
        body: {
          email: 'demo@example.com',
          password: 'demo123'
        }
      })
      
      const loginResponse = await loginRoute(loginRequest)
      const loginData = await loginResponse.json()
      const originalToken = loginData.token

      // Now refresh the token
      const refreshRequest = createMockRequest({
        method: 'POST',
        cookies: { 'auth-token': originalToken }
      })

      const response = await refreshRoute(refreshRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.user.email).toBe('demo@example.com')
      expect(data.token).not.toBe(originalToken) // Should be a new token
      
      // Verify new token has refresh flag
      const decodedToken = JSON.parse(atob(data.token))
      expect(decodedToken.refreshed).toBe(true)
      
      // Check if new auth cookie is set
      const setCookieHeader = response.headers.get('set-cookie')
      expect(setCookieHeader).toContain('auth-token=')
    })

    it('should return 401 for missing token', async () => {
      const request = createMockRequest({
        method: 'POST'
      })

      const response = await refreshRoute(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('No authentication token found')
    })

    it('should return 401 for invalid token', async () => {
      const request = createMockRequest({
        method: 'POST',
        cookies: { 'auth-token': 'invalid-token' }
      })

      const response = await refreshRoute(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Token refresh failed')
    })
  })
})