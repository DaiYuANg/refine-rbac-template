/**
 * Dashboard mock fixtures.
 * Used by the dashboard page for stats and chart data.
 * Aligns with Mock Rules: demo data lives in fixtures, not inline in page JSX.
 */

export type DashboardStatCard = {
  key: string
  value: number
  labelKey: string
}

export const DASHBOARD_STAT_CARDS: DashboardStatCard[] = [
  { key: 'users', value: 24, labelKey: 'dashboard.totalUsers' },
  { key: 'roles', value: 8, labelKey: 'dashboard.totalRoles' },
  { key: 'permissions', value: 42, labelKey: 'dashboard.totalPermissions' },
  { key: 'activeSessions', value: 12, labelKey: 'dashboard.activeSessions' },
]

export type UserActivityDataPoint = {
  month: string
  users: number
  logins: number
}

export const DASHBOARD_USER_ACTIVITY: UserActivityDataPoint[] = [
  { month: '1月', users: 12, logins: 156 },
  { month: '2月', users: 15, logins: 203 },
  { month: '3月', users: 18, logins: 287 },
  { month: '4月', users: 22, logins: 341 },
  { month: '5月', users: 24, logins: 412 },
  { month: '6月', users: 24, logins: 389 },
]

export type RoleDistributionDataPoint = {
  name: string
  value: number
  color: string
}

export const DASHBOARD_ROLE_DISTRIBUTION: RoleDistributionDataPoint[] = [
  { name: '管理员', value: 3, color: 'var(--chart-1)' },
  { name: '编辑者', value: 8, color: 'var(--chart-2)' },
  { name: '查看者', value: 13, color: 'var(--chart-3)' },
  { name: '访客', value: 5, color: 'var(--chart-4)' },
]

export type PermissionGroupDataPoint = {
  name: string
  count: number
}

export const DASHBOARD_PERMISSION_GROUPS: PermissionGroupDataPoint[] = [
  { name: '用户管理', count: 12 },
  { name: '角色管理', count: 8 },
  { name: '权限管理', count: 15 },
  { name: '系统配置', count: 7 },
]
