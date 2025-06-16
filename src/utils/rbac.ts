// Role-Based Access Control utility

export type Role = 'admin' | 'user' | 'viewer'

export interface Permission {
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
  /**
   * Check if a role has permission to perform an action on a resource
   */
  hasPermission: (role: Role, resource: string, action: string): boolean => {
    const permissions = rolePermissions[role]
    if (!permissions) return false
    
    const resourcePermission = permissions.find(p => p.resource === resource)
    if (!resourcePermission) return false
    
    return resourcePermission.actions.includes(action)
  },

  /**
   * Get all allowed actions for a role on a specific resource
   */
  getAllowedActions: (role: Role, resource: string): string[] => {
    const permissions = rolePermissions[role]
    if (!permissions) return []
    
    const resourcePermission = permissions.find(p => p.resource === resource)
    return resourcePermission?.actions || []
  },

  /**
   * Check if a role can access a specific route
   */
  canAccessRoute: (role: Role, route: string): boolean => {
    // Map routes to resources
    const routeResourceMap: Record<string, string> = {
      '/users': 'users',
      '/kol': 'kol',
      '/insight': 'insights',
      '/ads': 'ads',
      '/testing': 'testing',
      '/settings': 'settings',
      '/private': 'insights' // Private domain uses insights permissions
    }
    
    // Extract base route from full path
    const baseRoute = '/' + route.split('/')[1]
    const resource = routeResourceMap[baseRoute]
    
    if (!resource) return true // Allow access to unmapped routes
    
    return rbac.hasPermission(role, resource, 'read')
  },

  /**
   * Get all accessible routes for a role
   */
  getAccessibleRoutes: (role: Role): string[] => {
    const permissions = rolePermissions[role]
    if (!permissions) return []
    
    const routes: string[] = []
    const routeResourceMap: Record<string, string> = {
      '/users': 'users',
      '/kol': 'kol',
      '/insight': 'insights',
      '/ads': 'ads',
      '/testing': 'testing',
      '/settings': 'settings',
      '/private': 'insights'
    }
    
    for (const [route, resource] of Object.entries(routeResourceMap)) {
      if (rbac.hasPermission(role, resource, 'read')) {
        routes.push(route)
      }
    }
    
    return routes
  },

  /**
   * Check if a role can perform bulk operations
   */
  canBulkOperation: (role: Role, resource: string, operation: 'delete' | 'update'): boolean => {
    // Only admins can perform bulk operations
    if (role !== 'admin') return false
    
    return rbac.hasPermission(role, resource, operation)
  },

  /**
   * Get role hierarchy level (higher number = more permissions)
   */
  getRoleLevel: (role: Role): number => {
    const levels: Record<Role, number> = {
      viewer: 1,
      user: 2,
      admin: 3
    }
    return levels[role] || 0
  },

  /**
   * Check if roleA has higher permissions than roleB
   */
  hasHigherPermissions: (roleA: Role, roleB: Role): boolean => {
    return rbac.getRoleLevel(roleA) > rbac.getRoleLevel(roleB)
  }
}