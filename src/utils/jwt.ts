// JWT utility functions for token management
// In production, use a proper JWT library like jsonwebtoken

export const jwtUtils = {
  /**
   * Create a JWT-like token (simplified for demo purposes)
   * In production, use proper JWT signing with a secret key
   */
  sign: (payload: any, secret: string, options?: { expiresIn?: string }) => {
    const header = { alg: 'HS256', typ: 'JWT' }
    const encodedHeader = btoa(JSON.stringify(header))
    
    const now = Math.floor(Date.now() / 1000)
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: options?.expiresIn ? now + parseInt(options.expiresIn) : undefined
    }
    
    const encodedPayload = btoa(JSON.stringify(tokenPayload))
    
    // Simple signature (not cryptographically secure - for demo only)
    // In production, use proper HMAC-SHA256 signing
    const signature = btoa(`${encodedHeader}.${encodedPayload}.${secret}`)
    
    return `${encodedHeader}.${encodedPayload}.${signature}`
  },

  /**
   * Verify and decode a JWT token
   * Returns the decoded payload if valid, throws error otherwise
   */
  verify: (token: string, secret: string) => {
    try {
      const [encodedHeader, encodedPayload, signature] = token.split('.')
      
      if (!encodedHeader || !encodedPayload || !signature) {
        throw new Error('Invalid token format')
      }
      
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
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Invalid token')
    }
  },

  /**
   * Decode a JWT token without verification
   * Useful for reading token contents on client side
   */
  decode: (token: string) => {
    try {
      const [, encodedPayload] = token.split('.')
      if (!encodedPayload) return null
      
      return JSON.parse(atob(encodedPayload))
    } catch {
      return null
    }
  },

  /**
   * Check if a token is expired
   */
  isExpired: (token: string): boolean => {
    const payload = jwtUtils.decode(token)
    if (!payload || !payload.exp) return false
    
    return payload.exp < Math.floor(Date.now() / 1000)
  },

  /**
   * Get the expiration time of a token
   */
  getExpiration: (token: string): Date | null => {
    const payload = jwtUtils.decode(token)
    if (!payload || !payload.exp) return null
    
    return new Date(payload.exp * 1000)
  }
}