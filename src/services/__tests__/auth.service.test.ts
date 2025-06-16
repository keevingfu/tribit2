import { authService } from '../auth.service'

describe('AuthService', () => {
  describe('login', () => {
    it('should login successfully with valid demo credentials', async () => {
      const result = await authService.login('demo@example.com', 'demo123')
      
      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('token')
      expect(result.user).toEqual({
        id: '1',
        email: 'demo@example.com',
        name: '演示用户',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff'
      })
      expect(typeof result.token).toBe('string')
    })

    it('should login successfully with admin credentials', async () => {
      const result = await authService.login('admin@example.com', 'admin123')
      
      expect(result.user).toEqual({
        id: '2',
        email: 'admin@example.com',
        name: '管理员',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=DC2626&color=fff'
      })
    })

    it('should throw error with invalid credentials', async () => {
      await expect(
        authService.login('invalid@example.com', 'wrongpassword')
      ).rejects.toThrow('邮箱或密码错误')
    })

    it('should throw error with valid email but wrong password', async () => {
      await expect(
        authService.login('demo@example.com', 'wrongpassword')
      ).rejects.toThrow('邮箱或密码错误')
    })

    it('should have simulated delay for login', async () => {
      const startTime = Date.now()
      await authService.login('demo@example.com', 'demo123')
      const endTime = Date.now()
      
      // Should take at least 1000ms due to simulated delay
      expect(endTime - startTime).toBeGreaterThanOrEqual(1000)
    })
  })

  describe('verify', () => {
    it('should verify valid token successfully', async () => {
      // First login to get a token
      const loginResult = await authService.login('demo@example.com', 'demo123')
      const token = loginResult.token

      // Verify the token
      const user = await authService.verify(token)
      
      expect(user).toEqual({
        id: '1',
        email: 'demo@example.com',
        name: '演示用户',
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff'
      })
    })

    it('should throw error for invalid token format', async () => {
      await expect(
        authService.verify('invalid-token')
      ).rejects.toThrow('Invalid token')
    })

    it('should throw error for token with non-existent user', async () => {
      // Create a token for non-existent user
      const fakeToken = btoa(JSON.stringify({ email: 'fake@example.com', timestamp: Date.now() }))
      
      await expect(
        authService.verify(fakeToken)
      ).rejects.toThrow('Invalid token')
    })

    it('should have simulated delay for verify', async () => {
      const loginResult = await authService.login('demo@example.com', 'demo123')
      const token = loginResult.token
      
      const startTime = Date.now()
      await authService.verify(token)
      const endTime = Date.now()
      
      // Should take at least 500ms due to simulated delay
      expect(endTime - startTime).toBeGreaterThanOrEqual(500)
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      // logout should not throw any errors
      await expect(authService.logout()).resolves.toBeUndefined()
    })

    it('should have simulated delay for logout', async () => {
      const startTime = Date.now()
      await authService.logout()
      const endTime = Date.now()
      
      // Should take at least 200ms due to simulated delay
      expect(endTime - startTime).toBeGreaterThanOrEqual(200)
    })
  })

  describe('token generation', () => {
    it('should generate unique tokens for same user at different times', async () => {
      const result1 = await authService.login('demo@example.com', 'demo123')
      
      // Wait a bit to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10))
      
      const result2 = await authService.login('demo@example.com', 'demo123')
      
      expect(result1.token).not.toBe(result2.token)
    })

    it('should include email and timestamp in token', async () => {
      const result = await authService.login('demo@example.com', 'demo123')
      const decoded = JSON.parse(atob(result.token))
      
      expect(decoded).toHaveProperty('email', 'demo@example.com')
      expect(decoded).toHaveProperty('timestamp')
      expect(typeof decoded.timestamp).toBe('number')
    })
  })
})