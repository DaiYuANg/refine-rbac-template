/** Dashboard stats DTO - aligns with API response. */

export interface DashboardStatCard {
  key: string
  value: number
  labelKey: string
}

export interface UserActivityDataPoint {
  month: string
  users: number
  logins: number
}

export interface RoleDistributionDataPoint {
  name: string
  value: number
  color: string
}

export interface PermissionGroupDataPoint {
  name: string
  count: number
}

export interface DashboardStats {
  statCards: DashboardStatCard[]
  userActivity: UserActivityDataPoint[]
  roleDistribution: RoleDistributionDataPoint[]
  permissionGroups: PermissionGroupDataPoint[]
}
