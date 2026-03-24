'use client'

import { useEffect, useMemo, useState } from 'react'
import { useList } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Clock3,
  Eraser,
  Home,
  Key,
  Layers,
  Plus,
  Search,
  Shield,
  User,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'
import type { User as UserDto } from '@/types/user'
import type { Role } from '@/types/role'
import type { Permission } from '@/types/permission'
import type { PermissionGroup } from '@/types/permission-group'

type GlobalCommandPaletteProps = {
  className?: string
  compact?: boolean
}

type NavAction = {
  id: string
  label: string
  to: string
  icon: React.ReactNode
}

const SEARCH_MIN_LEN = 2
const RECENT_VISITS_KEY = 'rbac-command-recent-visits'
const RECENT_VISITS_MAX = 5

type RecentVisit = {
  id: string
  label: string
  to: string
  subtitle?: string
  tag?: string
  icon:
    | 'home'
    | 'users'
    | 'roles'
    | 'permissions'
    | 'groups'
    | 'create'
    | 'search'
}

export const GlobalCommandPalette = ({
  className,
  compact = false,
}: GlobalCommandPaletteProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [recentVisits, setRecentVisits] = useState<RecentVisit[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(RECENT_VISITS_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw) as RecentVisit[]
      if (!Array.isArray(parsed)) return []
      return parsed.slice(0, RECENT_VISITS_MAX)
    } catch {
      return []
    }
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const trimmedQuery = query.trim()
  const searchEnabled = open && trimmedQuery.length >= SEARCH_MIN_LEN

  const { result: usersResult } = useList<UserDto>({
    resource: 'users',
    filters: searchEnabled
      ? [{ field: 'q', operator: 'eq', value: trimmedQuery }]
      : undefined,
    pagination: { currentPage: 1, pageSize: 5, mode: 'server' },
    queryOptions: { enabled: searchEnabled },
  })

  const { result: rolesResult } = useList<Role>({
    resource: 'roles',
    filters: searchEnabled
      ? [{ field: 'q', operator: 'eq', value: trimmedQuery }]
      : undefined,
    pagination: { currentPage: 1, pageSize: 5, mode: 'server' },
    queryOptions: { enabled: searchEnabled },
  })

  const { result: permissionsResult } = useList<Permission>({
    resource: 'permissions',
    filters: searchEnabled
      ? [{ field: 'q', operator: 'eq', value: trimmedQuery }]
      : undefined,
    pagination: { currentPage: 1, pageSize: 5, mode: 'server' },
    queryOptions: { enabled: searchEnabled },
  })

  const { result: groupResult } = useList<PermissionGroup>({
    resource: 'permission-groups',
    filters: searchEnabled
      ? [{ field: 'q', operator: 'eq', value: trimmedQuery }]
      : undefined,
    pagination: { currentPage: 1, pageSize: 5, mode: 'server' },
    queryOptions: { enabled: searchEnabled },
  })

  const users = Array.isArray(usersResult?.data) ? usersResult.data : []
  const roles = Array.isArray(rolesResult?.data) ? rolesResult.data : []
  const permissions = Array.isArray(permissionsResult?.data)
    ? permissionsResult.data
    : []
  const groups = Array.isArray(groupResult?.data) ? groupResult.data : []

  const navActions = useMemo<NavAction[]>(
    () => [
      {
        id: 'home',
        label: t('command.home'),
        to: ROUTES.home,
        icon: <Home className="size-4" />,
      },
      {
        id: 'users-list',
        label: t('command.usersList'),
        to: '/users',
        icon: <Users className="size-4" />,
      },
      {
        id: 'users-create',
        label: t('command.usersCreate'),
        to: '/users/create',
        icon: <Plus className="size-4" />,
      },
      {
        id: 'roles-list',
        label: t('command.rolesList'),
        to: '/roles',
        icon: <Shield className="size-4" />,
      },
      {
        id: 'roles-create',
        label: t('command.rolesCreate'),
        to: '/roles/create',
        icon: <Plus className="size-4" />,
      },
      {
        id: 'permissions-list',
        label: t('command.permissionsList'),
        to: '/permissions',
        icon: <Key className="size-4" />,
      },
      {
        id: 'groups-list',
        label: t('command.groupsList'),
        to: '/permission-groups',
        icon: <Layers className="size-4" />,
      },
      {
        id: 'groups-create',
        label: t('command.groupsCreate'),
        to: '/permission-groups/create',
        icon: <Plus className="size-4" />,
      },
    ],
    [t]
  )

  const hasDataResults =
    users.length > 0 ||
    roles.length > 0 ||
    permissions.length > 0 ||
    groups.length > 0

  const saveRecentVisits = (next: RecentVisit[]) => {
    setRecentVisits(next)
    try {
      window.localStorage.setItem(RECENT_VISITS_KEY, JSON.stringify(next))
    } catch {
      // noop: localStorage can fail in privacy mode
    }
  }

  const addRecentVisit = (visit: RecentVisit) => {
    const next: RecentVisit[] = [
      visit,
      ...recentVisits.filter((item) => item.to !== visit.to),
    ].slice(0, RECENT_VISITS_MAX)
    saveRecentVisits(next)
  }

  const clearRecentVisits = () => {
    saveRecentVisits([])
  }

  const goTo = (to: string, recent?: RecentVisit) => {
    if (recent) {
      addRecentVisit(recent)
    }
    setOpen(false)
    setQuery('')
    navigate(to)
  }

  const getRecentIcon = (icon: RecentVisit['icon']) => {
    switch (icon) {
      case 'home':
        return <Home className="size-4" />
      case 'users':
        return <Users className="size-4" />
      case 'roles':
        return <Shield className="size-4" />
      case 'permissions':
        return <Key className="size-4" />
      case 'groups':
        return <Layers className="size-4" />
      case 'create':
        return <Plus className="size-4" />
      default:
        return <Search className="size-4" />
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size={compact ? 'icon' : 'sm'}
        className={cn(
          compact
            ? 'h-8 w-8 rounded-full border-sidebar-border bg-transparent'
            : 'h-10 rounded-full border-sidebar-border bg-transparent px-3',
          className
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        {!compact && (
          <>
            <span className="ml-1">{t('command.open')}</span>
            <CommandShortcut className="text-[10px] tracking-normal">
              {t('command.shortcut')}
            </CommandShortcut>
          </>
        )}
        {compact && <span className="sr-only">{t('command.open')}</span>}
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={t('command.title')}
        description={t('command.description')}
      >
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder={t('command.placeholder')}
        />
        <CommandList>
          <CommandEmpty>{t('command.noResults')}</CommandEmpty>

          {recentVisits.length > 0 && (
            <>
              <CommandGroup heading={t('command.recent')}>
                {recentVisits.map((item) => (
                  <CommandItem
                    key={`recent-${item.id}-${item.to}`}
                    onSelect={() => goTo(item.to, item)}
                  >
                    <Clock3 className="size-4 text-muted-foreground" />
                    <span className="sr-only">{item.label}</span>
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      {getRecentIcon(item.icon)}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate">{item.label}</span>
                        {item.subtitle && (
                          <span className="truncate text-xs text-muted-foreground">
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    </div>
                    {item.tag && (
                      <CommandShortcut className="normal-case tracking-normal">
                        {item.tag}
                      </CommandShortcut>
                    )}
                  </CommandItem>
                ))}
                <CommandItem onSelect={clearRecentVisits}>
                  <Eraser className="size-4" />
                  <span>{t('command.clearRecent')}</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          <CommandGroup heading={t('command.navigation')}>
            {navActions.map((action) => (
              <CommandItem
                key={action.id}
                onSelect={() =>
                  goTo(action.to, {
                    id: action.id,
                    label: action.label,
                    to: action.to,
                    subtitle: t('command.navigation'),
                    tag: t('command.navigation'),
                    icon:
                      action.id === 'home'
                        ? 'home'
                        : action.id.includes('users')
                          ? action.id.includes('create')
                            ? 'create'
                            : 'users'
                          : action.id.includes('roles')
                            ? action.id.includes('create')
                              ? 'create'
                              : 'roles'
                            : action.id.includes('permissions')
                              ? 'permissions'
                              : action.id.includes('groups') &&
                                  action.id.includes('create')
                                ? 'create'
                                : 'groups',
                  })
                }
              >
                {action.icon}
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate">{action.label}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading={t('command.data')}>
            {trimmedQuery.length < SEARCH_MIN_LEN ? (
              <CommandItem disabled>
                <Search className="size-4" />
                <span>{t('command.typeToSearch')}</span>
              </CommandItem>
            ) : !hasDataResults ? (
              <CommandItem disabled>
                <Search className="size-4" />
                <span>{t('command.noDataMatches')}</span>
              </CommandItem>
            ) : (
              <>
                {users.map((item) => (
                  <CommandItem
                    key={`user-${item.id}`}
                    onSelect={() =>
                      goTo(`/users/show/${item.id}`, {
                        id: `user-${item.id}`,
                        label: item.name,
                        subtitle: item.email,
                        to: `/users/show/${item.id}`,
                        tag: t('users.title'),
                        icon: 'users',
                      })
                    }
                  >
                    <User className="size-4" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{item.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {item.email}
                      </span>
                    </div>
                    <CommandShortcut className="normal-case tracking-normal">
                      {t('users.title')}
                    </CommandShortcut>
                  </CommandItem>
                ))}
                {roles.map((item) => (
                  <CommandItem
                    key={`role-${item.id}`}
                    onSelect={() =>
                      goTo(`/roles/show/${item.id}`, {
                        id: `role-${item.id}`,
                        label: item.name,
                        subtitle: item.description ?? '-',
                        to: `/roles/show/${item.id}`,
                        tag: t('roles.title'),
                        icon: 'roles',
                      })
                    }
                  >
                    <Shield className="size-4" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{item.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {item.description ?? '-'}
                      </span>
                    </div>
                    <CommandShortcut className="normal-case tracking-normal">
                      {t('roles.title')}
                    </CommandShortcut>
                  </CommandItem>
                ))}
                {permissions.map((item) => (
                  <CommandItem
                    key={`permission-${item.id}`}
                    onSelect={() =>
                      goTo(`/permissions/show/${item.id}`, {
                        id: `permission-${item.id}`,
                        label: item.name,
                        subtitle: item.code,
                        to: `/permissions/show/${item.id}`,
                        tag: t('permissions.title'),
                        icon: 'permissions',
                      })
                    }
                  >
                    <Key className="size-4" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{item.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {item.code}
                      </span>
                    </div>
                    <CommandShortcut className="normal-case tracking-normal">
                      {t('permissions.title')}
                    </CommandShortcut>
                  </CommandItem>
                ))}
                {groups.map((item) => (
                  <CommandItem
                    key={`group-${item.id}`}
                    onSelect={() =>
                      goTo(`/permission-groups/show/${item.id}`, {
                        id: `group-${item.id}`,
                        label: item.name,
                        subtitle: item.description ?? '-',
                        to: `/permission-groups/show/${item.id}`,
                        tag: t('permissionGroups.title'),
                        icon: 'groups',
                      })
                    }
                  >
                    <Layers className="size-4" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{item.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {item.description ?? '-'}
                      </span>
                    </div>
                    <CommandShortcut className="normal-case tracking-normal">
                      {t('permissionGroups.title')}
                    </CommandShortcut>
                  </CommandItem>
                ))}
              </>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
