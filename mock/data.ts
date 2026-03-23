/**
 * Shared mock data for vite-plugin-mock-dev-server.
 * Uses defineMockData for mutable state shared across mock handlers.
 */
import { defineMockData } from 'vite-plugin-mock-dev-server'
import { MOCK_USERS } from '../src/mocks/fixtures/users'
import { MOCK_ROLES } from '../src/mocks/fixtures/roles'
import { MOCK_PERMISSIONS } from '../src/mocks/fixtures/permissions'
import { MOCK_PERMISSION_GROUPS } from '../src/mocks/fixtures/permission-groups'

type User = (typeof MOCK_USERS)[number]
type Role = (typeof MOCK_ROLES)[number]
type Permission = (typeof MOCK_PERMISSIONS)[number]
type PermissionGroup = (typeof MOCK_PERMISSION_GROUPS)[number]

export const users = defineMockData(
  'users',
  JSON.parse(JSON.stringify(MOCK_USERS)) as User[]
)
export const roles = defineMockData(
  'roles',
  JSON.parse(JSON.stringify(MOCK_ROLES)) as Role[]
)
export const permissions = defineMockData(
  'permissions',
  JSON.parse(JSON.stringify(MOCK_PERMISSIONS)) as Permission[]
)
export const permissionGroups = defineMockData(
  'permission-groups',
  JSON.parse(JSON.stringify(MOCK_PERMISSION_GROUPS)) as PermissionGroup[]
)

export type AuditLogEntry = {
  id: string
  resource: string
  action: string
  author?: Record<string, unknown>
  data?: unknown
  previousData?: unknown
  meta?: Record<string, unknown>
  name?: string
  createdAt: string
}
export const auditLogs = defineMockData<AuditLogEntry[]>('audit-logs', [])
