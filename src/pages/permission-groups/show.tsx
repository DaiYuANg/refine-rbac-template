import { Link } from 'react-router-dom'
import { useList, useShow } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import {
  ShowView,
  ShowViewHeader,
} from '@/components/refine-ui/views/show-view'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { PermissionGroup } from '@/types/permission-group'
import type { Permission } from '@/types/permission'

export function PermissionGroupShow() {
  const { t } = useTranslation()
  const { query } = useShow<PermissionGroup>({ resource: 'permission-groups' })
  const group = query?.data?.data
  const isLoading = query?.isLoading ?? false

  const { query: permissionsQuery, result: permissionsResult } =
    useList<Permission>({
      resource: 'permissions',
      pagination: { currentPage: 1, pageSize: 200, mode: 'server' },
      filters: group
        ? [
            {
              field: 'groupId',
              operator: 'eq',
              value: group.id,
            },
          ]
        : undefined,
      queryOptions: {
        enabled: !!group?.id,
      },
    })
  const permissions = Array.isArray(permissionsResult?.data)
    ? permissionsResult.data
    : []
  const isPermissionsLoading = permissionsQuery.isLoading

  if (isLoading || !group) {
    return (
      <ShowView>
        <ShowViewHeader resource="permission-groups" />
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
      <ShowViewHeader resource="permission-groups" />
      <dl className="grid gap-4 max-w-md">
        <div>
          <dt className="text-sm font-medium text-muted-foreground">
            {t('permissionGroups.name')}
          </dt>
          <dd className="mt-1">{group.name}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">
            {t('permissionGroups.description')}
          </dt>
          <dd className="mt-1">{group.description ?? '-'}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">
            {t('permissions.title')}
          </dt>
          <dd className="mt-1">
            {isPermissionsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : permissions.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                {t('common.noData')}
              </span>
            ) : (
              <ScrollArea className="h-[220px] rounded-md border p-2">
                <div className="flex flex-wrap gap-2">
                  {permissions.map((p) => (
                    <Link
                      key={p.id}
                      to={`/permissions/show/${p.id}`}
                      className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs hover:bg-muted/80 hover:underline"
                    >
                      <span>{p.name}</span>
                      <span className="font-mono text-muted-foreground">
                        {p.code}
                      </span>
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
