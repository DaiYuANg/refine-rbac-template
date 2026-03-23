/**
 * Auth-related types - current user, /me response, token refresh.
 */

import type { RoleInfo } from '@/features/rbac/types'

export interface MeResponse {
  id: string
  name: string
  email?: string
  roles: RoleInfo[]
  permissions: string[]
}

/** Response from POST /auth/refresh. Refresh token sent via httpOnly cookie. */
export interface RefreshTokenResponse {
  accessToken: string
}
