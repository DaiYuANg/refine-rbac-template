import type { User } from '@/types/user'

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    avatar: undefined,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Doe',
    avatar: undefined,
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    email: 'john@example.com',
    name: 'John Smith',
    avatar: undefined,
    createdAt: '2024-03-10T09:15:00Z',
  },
]
