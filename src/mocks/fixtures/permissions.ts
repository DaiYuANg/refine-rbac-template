import type { Permission } from '@/types/permission'

export const MOCK_PERMISSIONS: Permission[] = [
  { id: '1', name: '查看用户', code: 'users:read', groupId: '1', createdAt: '2024-01-15T10:00:00Z' },
  { id: '2', name: '编辑用户', code: 'users:write', groupId: '1', createdAt: '2024-01-15T10:00:00Z' },
  { id: '3', name: '查看角色', code: 'roles:read', groupId: '2', createdAt: '2024-02-20T14:30:00Z' },
]
