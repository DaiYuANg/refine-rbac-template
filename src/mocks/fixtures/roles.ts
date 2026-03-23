import type { Role } from '@/types/role'

const roleNames = [
  { name: '项目主管', desc: '项目管理与审批' },
  { name: '开发工程师', desc: '代码开发与部署' },
  { name: '测试专员', desc: '质量测试与验收' },
  { name: '产品经理', desc: '需求与产品规划' },
  { name: '运维工程师', desc: '系统运维与监控' },
  { name: '数据分析师', desc: '数据统计与分析' },
  { name: '客服代表', desc: '用户支持与反馈' },
  { name: '财务审核', desc: '财务审批权限' },
  { name: 'HR 专员', desc: '人事管理权限' },
  { name: '超级管理员', desc: '系统最高权限' },
  { name: '审计员', desc: '只读审计权限' },
  { name: '临时用户', desc: '短期访问权限' },
]

export const MOCK_ROLES: Role[] = [
  {
    id: '1',
    name: '管理员',
    description: '拥有全部权限',
    permissionGroupIds: ['1', '2'],
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: '编辑',
    description: '可编辑内容',
    permissionGroupIds: ['1'],
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: '访客',
    description: '只读权限',
    permissionGroupIds: [],
    createdAt: '2024-03-10T09:15:00Z',
  },
  ...roleNames.map((r, i) => ({
    id: String(i + 4),
    name: r.name,
    description: r.desc,
    permissionGroupIds: i % 2 === 0 ? ['1'] : ['2'],
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
  })),
]
