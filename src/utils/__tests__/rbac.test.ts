// Role-Based Access Control tests

type Role = 'admin' | 'user' | 'viewer'

interface Permission {
  resource: string
  actions: string[]
}

// Define permissions for each role
const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'kol', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'insights', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'ads', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'testing', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'settings', actions: ['read', 'update'] }
  ],
  user: [
    { resource: 'kol', actions: ['read', 'update'] },
    { resource: 'insights', actions: ['read'] },
    { resource: 'ads', actions: ['read', 'update'] },
    { resource: 'testing', actions: ['create', 'read', 'update'] },
    { resource: 'settings', actions: ['read'] }
  ],
  viewer: [
    { resource: 'kol', actions: ['read'] },
    { resource: 'insights', actions: ['read'] },
    { resource: 'ads', actions: ['read'] },
    { resource: 'testing', actions: ['read'] },
    { resource: 'settings', actions: ['read'] }
  ]
}

// RBAC utility functions
export const rbac = {
  hasPermission: (role: Role, resource: string, action: string): boolean => {
    const permissions = rolePermissions[role]
    if (!permissions) return false
    
    const resourcePermission = permissions.find(p => p.resource === resource)
    if (!resourcePermission) return false
    
    return resourcePermission.actions.includes(action)
  },

  getAllowedActions: (role: Role, resource: string): string[] => {
    const permissions = rolePermissions[role]
    if (!permissions) return []
    
    const resourcePermission = permissions.find(p => p.resource === resource)
    return resourcePermission?.actions || []
  },

  canAccessRoute: (role: Role, route: string): boolean => {
    // Map routes to resources
    const routeResourceMap: Record<string, string> = {
      '/users': 'users',
      '/kol': 'kol',
      '/insight': 'insights',
      '/ads': 'ads',
      '/testing': 'testing',
      '/settings': 'settings'
    }
    
    const resource = routeResourceMap[route]
    if (!resource) return true // Allow access to unmapped routes
    
    return rbac.hasPermission(role, resource, 'read')
  }
}

describe('Role-Based Access Control', () => {
  describe('hasPermission', () => {
    describe('Admin role', () => {
      it('should have all permissions on all resources', () => {
        expect(rbac.hasPermission('admin', 'users', 'create')).toBe(true)
        expect(rbac.hasPermission('admin', 'users', 'read')).toBe(true)
        expect(rbac.hasPermission('admin', 'users', 'update')).toBe(true)
        expect(rbac.hasPermission('admin', 'users', 'delete')).toBe(true)
        
        expect(rbac.hasPermission('admin', 'kol', 'delete')).toBe(true)
        expect(rbac.hasPermission('admin', 'insights', 'create')).toBe(true)
      })

      it('should not have delete permission on settings', () => {
        expect(rbac.hasPermission('admin', 'settings', 'delete')).toBe(false)
      })
    })

    describe('User role', () => {
      it('should have limited permissions', () => {
        expect(rbac.hasPermission('user', 'kol', 'read')).toBe(true)
        expect(rbac.hasPermission('user', 'kol', 'update')).toBe(true)
        expect(rbac.hasPermission('user', 'kol', 'create')).toBe(false)
        expect(rbac.hasPermission('user', 'kol', 'delete')).toBe(false)
      })

      it('should have create permission for testing', () => {
        expect(rbac.hasPermission('user', 'testing', 'create')).toBe(true)
        expect(rbac.hasPermission('user', 'testing', 'read')).toBe(true)
        expect(rbac.hasPermission('user', 'testing', 'update')).toBe(true)
        expect(rbac.hasPermission('user', 'testing', 'delete')).toBe(false)
      })

      it('should have no access to users resource', () => {
        expect(rbac.hasPermission('user', 'users', 'read')).toBe(false)
        expect(rbac.hasPermission('user', 'users', 'create')).toBe(false)
      })
    })

    describe('Viewer role', () => {
      it('should have read-only permissions', () => {
        expect(rbac.hasPermission('viewer', 'kol', 'read')).toBe(true)
        expect(rbac.hasPermission('viewer', 'insights', 'read')).toBe(true)
        expect(rbac.hasPermission('viewer', 'ads', 'read')).toBe(true)
        expect(rbac.hasPermission('viewer', 'testing', 'read')).toBe(true)
        expect(rbac.hasPermission('viewer', 'settings', 'read')).toBe(true)
      })

      it('should not have write permissions', () => {
        expect(rbac.hasPermission('viewer', 'kol', 'create')).toBe(false)
        expect(rbac.hasPermission('viewer', 'kol', 'update')).toBe(false)
        expect(rbac.hasPermission('viewer', 'kol', 'delete')).toBe(false)
        expect(rbac.hasPermission('viewer', 'insights', 'update')).toBe(false)
      })

      it('should have no access to users resource', () => {
        expect(rbac.hasPermission('viewer', 'users', 'read')).toBe(false)
      })
    })
  })

  describe('getAllowedActions', () => {
    it('should return all allowed actions for admin on kol resource', () => {
      const actions = rbac.getAllowedActions('admin', 'kol')
      expect(actions).toEqual(['create', 'read', 'update', 'delete'])
    })

    it('should return limited actions for user on kol resource', () => {
      const actions = rbac.getAllowedActions('user', 'kol')
      expect(actions).toEqual(['read', 'update'])
    })

    it('should return only read for viewer on any resource', () => {
      const actions = rbac.getAllowedActions('viewer', 'kol')
      expect(actions).toEqual(['read'])
    })

    it('should return empty array for non-existent resource', () => {
      const actions = rbac.getAllowedActions('admin', 'non-existent')
      expect(actions).toEqual([])
    })
  })

  describe('canAccessRoute', () => {
    it('should allow admin to access all routes', () => {
      expect(rbac.canAccessRoute('admin', '/users')).toBe(true)
      expect(rbac.canAccessRoute('admin', '/kol')).toBe(true)
      expect(rbac.canAccessRoute('admin', '/insight')).toBe(true)
      expect(rbac.canAccessRoute('admin', '/ads')).toBe(true)
      expect(rbac.canAccessRoute('admin', '/testing')).toBe(true)
      expect(rbac.canAccessRoute('admin', '/settings')).toBe(true)
    })

    it('should restrict user access to users route', () => {
      expect(rbac.canAccessRoute('user', '/users')).toBe(false)
      expect(rbac.canAccessRoute('user', '/kol')).toBe(true)
      expect(rbac.canAccessRoute('user', '/insight')).toBe(true)
    })

    it('should allow viewer read-only routes', () => {
      expect(rbac.canAccessRoute('viewer', '/users')).toBe(false)
      expect(rbac.canAccessRoute('viewer', '/kol')).toBe(true)
      expect(rbac.canAccessRoute('viewer', '/insight')).toBe(true)
    })

    it('should allow access to unmapped routes', () => {
      expect(rbac.canAccessRoute('viewer', '/dashboard')).toBe(true)
      expect(rbac.canAccessRoute('viewer', '/auth/login')).toBe(true)
    })
  })

  describe('Permission inheritance scenarios', () => {
    it('should handle permission upgrades correctly', () => {
      // Simulate user role upgrade from viewer to user
      let role: Role = 'viewer'
      expect(rbac.hasPermission(role, 'kol', 'update')).toBe(false)
      
      role = 'user'
      expect(rbac.hasPermission(role, 'kol', 'update')).toBe(true)
    })

    it('should handle permission downgrades correctly', () => {
      // Simulate user role downgrade from admin to user
      let role: Role = 'admin'
      expect(rbac.hasPermission(role, 'users', 'delete')).toBe(true)
      
      role = 'user'
      expect(rbac.hasPermission(role, 'users', 'delete')).toBe(false)
    })
  })
})