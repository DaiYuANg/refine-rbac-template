/**
 * Auth-related types - current user, /me response.
 */

import type { RoleInfo } from '@/features/rbac/types'

export interface MeResponse {
  id: string
  name: string
  email?: string
  avatar?: string
  roles: RoleInfo[]
  permissions: string[]
}
