/** Permission DTO */
export interface Permission {
  id: string
  name: string
  code: string
  groupId?: string | null
  createdAt?: string
}
