import type { AccessControlProvider } from '@refinedev/core'

export type Role = string
export type Permission = string

/**
 * Centralized RBAC - roles, permissions, and access decisions.
 * Extend with real permission checks from backend.
 */
export const accessControlProvider: AccessControlProvider = {
  can: async () => {
    // Mock: allow all. Replace with real permission checks.
    return { can: true }
  },
}
