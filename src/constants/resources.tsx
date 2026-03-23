import type { IResourceItem } from '@refinedev/core'
import { Users, Shield, Key, Layers } from 'lucide-react'

export const resources: IResourceItem[] = [
  {
    name: 'users',
    list: '/users',
    create: '/users/create',
    edit: '/users/edit/:id',
    show: '/users/show/:id',
    meta: { label: '用户', icon: <Users className="size-4" /> },
  },
  {
    name: 'roles',
    list: '/roles',
    create: '/roles/create',
    edit: '/roles/edit/:id',
    show: '/roles/show/:id',
    meta: { label: '角色', icon: <Shield className="size-4" /> },
  },
  {
    name: 'permissions',
    list: '/permissions',
    show: '/permissions/show/:id',
    meta: { label: '权限', icon: <Key className="size-4" /> },
  },
  {
    name: 'permission-groups',
    list: '/permission-groups',
    create: '/permission-groups/create',
    edit: '/permission-groups/edit/:id',
    show: '/permission-groups/show/:id',
    meta: { label: '权限组', icon: <Layers className="size-4" /> },
  },
]
