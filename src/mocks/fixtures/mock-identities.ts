/**
 * Mock user identities for permission testing.
 * Login with these usernames to get different permission sets.
 */

export interface MockIdentity {
  id: string
  name: string
  email: string
  roles: { id: string; name: string }[]
  permissions: string[]
}

/** Username -> identity mapping for mock /me handler */
export const MOCK_IDENTITIES: Record<string, MockIdentity> = {
  // Full admin - all permissions
  'admin@example.com': {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    roles: [{ id: '1', name: '管理员' }],
    permissions: [
      'users:read',
      'users:write',
      'roles:read',
      'roles:write',
      'permissions:read',
      'permissions:write',
      'permission-groups:read',
      'permission-groups:write',
    ],
  },
  // Read-only - can view but not create/edit/delete
  'readonly@example.com': {
    id: '2',
    name: 'Read-only User',
    email: 'readonly@example.com',
    roles: [{ id: '2', name: '只读' }],
    permissions: [
      'users:read',
      'roles:read',
      'permissions:read',
      'permission-groups:read',
    ],
  },
  // Users module only - can manage users, view roles
  'users@example.com': {
    id: '3',
    name: 'Users Manager',
    email: 'users@example.com',
    roles: [{ id: '3', name: '用户管理员' }],
    permissions: ['users:read', 'users:write', 'roles:read'],
  },
  // Roles module only
  'roles@example.com': {
    id: '4',
    name: 'Roles Manager',
    email: 'roles@example.com',
    roles: [{ id: '4', name: '角色管理员' }],
    permissions: ['roles:read', 'roles:write'],
  },
  // Minimal - dashboard only (no resource permissions)
  'guest@example.com': {
    id: '5',
    name: 'Guest',
    email: 'guest@example.com',
    roles: [{ id: '5', name: '访客' }],
    permissions: [],
  },
}

const DEFAULT_IDENTITY = MOCK_IDENTITIES['admin@example.com']!

/**
 * Resolve identity by username. Falls back to admin if unknown.
 */
export const getMockIdentityByUsername = (username: string): MockIdentity => {
  const key = username.trim().toLowerCase()
  return MOCK_IDENTITIES[key] ?? DEFAULT_IDENTITY
}

export const MOCK_LOGIN_HINTS = [
  'admin@example.com',
  'readonly@example.com',
  'users@example.com',
  'roles@example.com',
  'guest@example.com',
] as const
