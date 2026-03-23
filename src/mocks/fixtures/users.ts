import type { User } from '@/types/user'

const names = [
  'Alice Wang',
  'Bob Chen',
  'Carol Li',
  'David Zhang',
  'Eva Liu',
  'Frank Yang',
  'Grace Huang',
  'Henry Wu',
  'Ivy Zhou',
  'Jack Sun',
  'Kate Ma',
  'Leo Zhu',
  'Mia Xu',
  'Noah Gao',
  'Olivia Tang',
  'Paul Feng',
  'Quinn Lin',
  'Rose Cao',
  'Sam Deng',
  'Tina Song',
  'Victor Peng',
  'Wendy Huang',
  'Xavier Jiang',
  'Yuki Fan',
]

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    roleIds: ['1'],
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Doe',
    roleIds: ['2'],
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    email: 'john@example.com',
    name: 'John Smith',
    roleIds: ['3'],
    createdAt: '2024-03-10T09:15:00Z',
  },
  ...names.map((name, i) => ({
    id: String(i + 4),
    email: `${name.split(' ')[0].toLowerCase()}@example.com`,
    name,
    roleIds: [String((i % 3) + 1)] as string[],
    createdAt: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}T10:00:00Z`,
  })),
]
