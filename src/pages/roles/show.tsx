import { Link } from 'react-router-dom'
import { useMany, useShow } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import {
  ShowView,
  ShowViewHeader,
} from '@/components/refine-ui/views/show-view'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Role } from '@/types/role'
import type { PermissionGroup } from '@/types/permission-group'

export function RoleShow() {
  const { t } = useTranslation()
  const { query } = useShow<Role>({ resource: 'roles' })
  const role = query?.data?.data
  const isLoading = query?.isLoading ?? false

  const permissionGroupIds = role?.permissionGroupIds ?? []
  const { query: groupsQuery, data: groupsData } = useMany<PermissionGroup>({
    resource: 'permission-groups',
    ids: permissionGroupIds,
    queryOptions: {
      enabled: !isLoading && permissionGroupIds.length > 0,
    },
  })

  const selectedGroups = Array.isArray(groupsData?.data) ? groupsData.data : []
  const isGroupsLoading = groupsQuery.isLoading

  if (isLoading || !role) {
    return (
      <ShowView>
        <ShowViewHeader resource="roles" />
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
      <ShowViewHeader resource="roles" />
      <dl className="grid gap-4 max-w-md">
        <div>
          <dt className="text-sm font-medium text-muted-foreground">
            {t('roles.name')}
          </dt>
          <dd className="mt-1">{role.name}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">
            {t('roles.description')}
          </dt>
          <dd className="mt-1">{role.description ?? '-'}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">
            {t('permissionGroups.title')}
          </dt>
          <dd className="mt-1">
            {isGroupsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : selectedGroups.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                {t('common.noData')}
              </span>
            ) : (
              <ScrollArea className="h-[220px] rounded-md border p-2">
                <div className="flex flex-wrap gap-2">
                  {selectedGroups.map((g) => (
                    <Link
                      key={g.id}
                      to={`/permission-groups/show/${g.id}`}
                      className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs hover:bg-muted/80 hover:underline"
                    >
                      <span>{g.name}</span>
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
