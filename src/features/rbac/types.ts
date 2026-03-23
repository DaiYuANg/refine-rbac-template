/**
 * RBAC types - roles, permissions, access decisions.
 * Centralized for use by access control provider and feature modules.
 */

export type PermissionCode = string

export interface RoleInfo {
  id: string
  name: string
}

export interface PermissionInfo {
  id: string
  code: PermissionCode
}

export interface CurrentUserPermissions {
  roles: RoleInfo[]
  permissions: PermissionCode[]
}
