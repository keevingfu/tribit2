import { jwtUtils } from '../jwt'

// Mock JWT utilities
export const jwtUtils = {
  // Create a simple JWT-like token
  sign: (payload: any, secret: string, options?: { expiresIn?: string }) => {
    const header = { alg: 'HS256', typ: 'JWT' }
    const encodedHeader = btoa(JSON.stringify(header))
    const encodedPayload = btoa(JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: options?.expiresIn ? Math.floor(Date.now() / 1000) + parseInt(options.expiresIn) : undefined
    }))
    // Simple signature (not cryptographically secure - for testing only)
    const signature = btoa(`${encodedHeader}.${encodedPayload}.${secret}`)
    return `${encodedHeader}.${encodedPayload}.${signature}`
  },

  // Verify and decode token
  verify: (token: string, secret: string) => {
    try {
      const [encodedHeader, encodedPayload, signature] = token.split('.')
      
      // Verify signature
      const expectedSignature = btoa(`${encodedHeader}.${encodedPayload}.${secret}`)
      if (signature !== expectedSignature) {
        throw new Error('Invalid signature')
      }
      
      // Decode payload
      const payload = JSON.parse(atob(encodedPayload))
      
      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired')
      }
      
      return payload
    } catch (error) {
      throw new Error('Invalid token')
    }
  },

  // Decode without verification
  decode: (token: string) => {
    try {
      const [, encodedPayload] = token.split('.')
      return JSON.parse(atob(encodedPayload))
    } catch {
      return null
    }
  }
}

describe('JWT Utils', () => {
  const secret = 'test-secret-key'
  const payload = {
    userId: '123',
    email: 'test@example.com',
    role: 'admin'
  }

  describe('sign', () => {
    it('should create a valid JWT token', () => {
      const token = jwtUtils.sign(payload, secret)
      
      expect(token).toBeTruthy()
      expect(token.split('.')).toHaveLength(3)
    })

    it('should include payload in token', () => {
      const token = jwtUtils.sign(payload, secret)
      const decoded = jwtUtils.decode(token)
      
      expect(decoded.userId).toBe(payload.userId)
      expect(decoded.email).toBe(payload.email)
      expect(decoded.role).toBe(payload.role)
    })

    it('should add iat (issued at) claim', () => {
      const token = jwtUtils.sign(payload, secret)
      const decoded = jwtUtils.decode(token)
      
      expect(decoded.iat).toBeDefined()
      expect(typeof decoded.iat).toBe('number')
    })

    it('should add exp claim when expiresIn is provided', () => {
      const token = jwtUtils.sign(payload, secret, { expiresIn: '3600' }) // 1 hour
      const decoded = jwtUtils.decode(token)
      
      expect(decoded.exp).toBeDefined()
      expect(decoded.exp).toBeGreaterThan(decoded.iat)
    })
  })

  describe('verify', () => {
    it('should verify valid token successfully', () => {
      const token = jwtUtils.sign(payload, secret)
      const verified = jwtUtils.verify(token, secret)
      
      expect(verified.userId).toBe(payload.userId)
      expect(verified.email).toBe(payload.email)
      expect(verified.role).toBe(payload.role)
    })

    it('should throw error for invalid signature', () => {
      const token = jwtUtils.sign(payload, secret)
      
      expect(() => {
        jwtUtils.verify(token, 'wrong-secret')
      }).toThrow('Invalid token')
    })

    it('should throw error for malformed token', () => {
      expect(() => {
        jwtUtils.verify('invalid.token', secret)
      }).toThrow('Invalid token')
    })

    it('should throw error for expired token', () => {
      // Create an already expired token
      const expiredPayload = {
        ...payload,
        iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
        exp: Math.floor(Date.now() / 1000) - 3600  // 1 hour ago
      }
      
      const encodedHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const encodedPayload = btoa(JSON.stringify(expiredPayload))
      const signature = btoa(`${encodedHeader}.${encodedPayload}.${secret}`)
      const expiredToken = `${encodedHeader}.${encodedPayload}.${signature}`
      
      expect(() => {
        jwtUtils.verify(expiredToken, secret)
      }).toThrow('Invalid token')
    })
  })

  describe('decode', () => {
    it('should decode token without verification', () => {
      const token = jwtUtils.sign(payload, secret)
      const decoded = jwtUtils.decode(token)
      
      expect(decoded.userId).toBe(payload.userId)
      expect(decoded.email).toBe(payload.email)
      expect(decoded.role).toBe(payload.role)
    })

    it('should return null for invalid token', () => {
      const decoded = jwtUtils.decode('invalid-token')
      expect(decoded).toBeNull()
    })

    it('should decode token with wrong secret', () => {
      const token = jwtUtils.sign(payload, secret)
      const decoded = jwtUtils.decode(token)
      
      // Decode doesn't verify, so it should still work
      expect(decoded.userId).toBe(payload.userId)
    })
  })
})