import type { Role } from '@/types/role'

export const MOCK_ROLES: Role[] = [
  { id: '1', name: '管理员', description: '拥有全部权限', createdAt: '2024-01-15T10:00:00Z' },
  { id: '2', name: '编辑', description: '可编辑内容', createdAt: '2024-02-20T14:30:00Z' },
  { id: '3', name: '访客', description: '只读权限', createdAt: '2024-03-10T09:15:00Z' },
]
