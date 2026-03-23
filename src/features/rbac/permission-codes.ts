/**
 * Resource-action to permission code mapping.
 * Aligns with backend permission codes (e.g. users:read, users:write).
 */

import type { PermissionCode } from './types'

const RESOURCE_ACTION_MAP: Record<
  string,
  Partial<Record<string, PermissionCode>>
> = {
  users: {
    list: 'users:read',
    show: 'users:read',
    create: 'users:write',
    edit: 'users:write',
    delete: 'users:write',
  },
  roles: {
    list: 'roles:read',
    show: 'roles:read',
    create: 'roles:write',
    edit: 'roles:write',
    delete: 'roles:write',
  },
  permissions: {
    list: 'permissions:read',
    show: 'permissions:read',
    create: 'permissions:write',
    edit: 'permissions:write',
    delete: 'permissions:write',
  },
  'permission-groups': {
    list: 'permission-groups:read',
    show: 'permission-groups:read',
    create: 'permission-groups:write',
    edit: 'permission-groups:write',
    delete: 'permission-groups:write',
  },
}

const ADMIN_ROLE = 'admin'
const ADMIN_ROLE_ALT = '管理员'

/**
 * Returns the required permission code for a resource+action, or undefined if not mapped.
 */
export const getRequiredPermission = (
  resource: string,
  action: string
): PermissionCode | undefined => {
  const actions = RESOURCE_ACTION_MAP[resource]
  if (!actions) return undefined
  return actions[action]
}

/**
 * Checks if the user has access for the given resource and action.
 * Admin role bypasses all checks.
 */
export const checkAccess = (
  userPermissions: PermissionCode[],
  userRoles: { name: string }[],
  resource: string,
  action: string
): boolean => {
  const isAdmin = userRoles.some(
    (r) => r.name.toLowerCase() === ADMIN_ROLE || r.name === ADMIN_ROLE_ALT
  )
  if (isAdmin) return true

  const required = getRequiredPermission(resource, action)
  if (!required) return true // No mapping = allow (e.g. dashboard)
  return userPermissions.includes(required)
}
