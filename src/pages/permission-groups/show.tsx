import { useList, useShow } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import {
  ShowView,
  ShowViewHeader,
} from '@/components/refine-ui/views/show-view'
import { Skeleton } from '@/components/ui/skeleton'
import { RbacBadgeGroup } from '@/components/shared/rbac-badge-group'
import {
  EntityPageBody,
  EntitySection,
} from '@/components/shared/entity-page-section'
import type { PermissionGroup } from '@/types/permission-group'
import type { Permission } from '@/types/permission'

export const PermissionGroupShow = () => {
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
      <EntityPageBody>
        <EntitySection title={t('permissionGroups.title')}>
          <dl className="grid gap-4 sm:grid-cols-2">
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
          </dl>
        </EntitySection>
        <EntitySection title={t('permissions.title')}>
          {isPermissionsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : (
            <RbacBadgeGroup
              title={t('permissions.title')}
              items={permissions.map((p: Permission) => ({
                id: p.id,
                label: p.name,
                href: `/permissions/show/${p.id}`,
                code: p.code,
                source: t('permissions.belongsToGroup'),
              }))}
            />
          )}
        </EntitySection>
      </EntityPageBody>
    </ShowView>
  )
}
