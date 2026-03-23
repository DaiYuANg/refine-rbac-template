import type { PermissionGroup } from '@/types/permission-group'

const groupNames = [
  { name: '系统设置', desc: '系统配置相关' },
  { name: '日志审计', desc: '操作日志与审计' },
  { name: '报表导出', desc: '数据导出权限' },
  { name: 'API 访问', desc: '接口调用权限' },
  { name: '文件管理', desc: '文件上传下载' },
  { name: '通知管理', desc: '消息通知权限' },
  { name: '工作流', desc: '流程审批权限' },
  { name: '仪表盘', desc: '看板查看权限' },
]

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
  ...groupNames.map((g, i) => ({
    id: String(i + 4),
    name: g.name,
    description: g.desc,
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
  })),
]
