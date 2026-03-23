import { Link } from 'react-router-dom'
import { useMany, useShow } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import {
  ShowView,
  ShowViewHeader,
} from '@/components/refine-ui/views/show-view'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { User } from '@/types/user'
import type { Role } from '@/types/role'

export function UserShow() {
  const { t } = useTranslation()
  const { query } = useShow<User>({ resource: 'users' })
  const user = query?.data?.data
  const isLoading = query?.isLoading ?? false

  const roleIds = user?.roleIds ?? []
  const { query: rolesQuery, result: rolesResult } = useMany<Role>({
    resource: 'roles',
    ids: roleIds,
    queryOptions: {
      enabled: !isLoading && roleIds.length > 0,
    },
  })

  const selectedRoles = Array.isArray(rolesResult?.data) ? rolesResult.data : []
  const isRolesLoading = rolesQuery.isLoading

  if (isLoading || !user) {
    return (
      <ShowView>
        <ShowViewHeader resource="users" />
        <div className="space-y-4 max-w-md">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </ShowView>
    )
  }

  return (
    <ShowView>
      <ShowViewHeader resource="users" />
      <dl className="grid gap-4 max-w-md">
        <div>
          <dt className="text-sm font-medium text-muted-foreground">
            {t('users.name')}
          </dt>
          <dd className="mt-1">{user.name}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">
            {t('users.email')}
          </dt>
          <dd className="mt-1">{user.email}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">
            {t('roles.title')}
          </dt>
          <dd className="mt-1">
            {isRolesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : selectedRoles.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                {t('common.noData')}
              </span>
            ) : (
              <ScrollArea className="h-[220px] rounded-md border p-2">
                <div className="flex flex-wrap gap-2">
                  {selectedRoles.map((r: Role) => (
                    <Link
                      key={r.id}
                      to={`/roles/show/${r.id}`}
                      className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs hover:bg-muted/80 hover:underline"
                    >
                      <span>{r.name}</span>
                      {r.description && (
                        <span className="text-muted-foreground">
                          — {r.description}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            )}
          </dd>
        </div>
      </dl>
    </ShowView>
  )
}
