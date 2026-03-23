/** User DTO - align with API response and form. */
export interface User {
  id: string
  email: string
  name: string
  /** Assigned role IDs */
  roleIds?: string[]
  createdAt?: string
}
