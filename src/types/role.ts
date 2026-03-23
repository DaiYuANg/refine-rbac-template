/** Role DTO */
export interface Role {
  id: string
  name: string
  description?: string
  /** Assigned permission group IDs */
  permissionGroupIds?: string[]
  createdAt?: string
}
