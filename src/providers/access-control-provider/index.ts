import type { AccessControlProvider } from '@refinedev/core'
import { useAuthStore } from '@/features/rbac'
import { checkAccess } from '@/features/rbac/permission-codes'

/**
 * Centralized RBAC - roles, permissions, and access decisions.
 * Permission codes (e.g. users:read, users:write) come from /me.
 */
export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const { roles, permissions } = useAuthStore.getState()

    // Bootstrap: when store not yet populated, allow (authProvider.getIdentity will fetch /me)
    if (!resource) return { can: true }
    if (permissions.length === 0 && roles.length === 0) return { can: true }

    const can = checkAccess(permissions, roles, resource, action ?? 'list')
    return { can }
  },
}
