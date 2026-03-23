import type { PermissionGroup } from '@/types/permission-group'

export const MOCK_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: '1',
    name: '用户管理',
    description: '用户相关权限',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: '角色管理',
    description: '角色相关权限',
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: '权限管理',
    description: '权限与权限组相关',
    createdAt: '2024-02-20T14:30:00Z',
  },
]
