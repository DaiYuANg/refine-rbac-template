import { useMany, useShow } from '@refinedev/core'
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
import type { Role } from '@/types/role'
import type { PermissionGroup } from '@/types/permission-group'

export const RoleShow = () => {
  const { t } = useTranslation()
  const { query } = useShow<Role>({ resource: 'roles' })
  const role = query?.data?.data
  const isLoading = query?.isLoading ?? false

  const permissionGroupIds = role?.permissionGroupIds ?? []
  const { query: groupsQuery, result: groupsResult } = useMany<PermissionGroup>(
    {
      resource: 'permission-groups',
      ids: permissionGroupIds,
      queryOptions: {
        enabled: !isLoading && permissionGroupIds.length > 0,
      },
    }
  )

  const selectedGroups = Array.isArray(groupsResult?.data)
    ? groupsResult.data
    : []
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
      <EntityPageBody>
        <EntitySection title={t('roles.title')}>
          <dl className="grid gap-4 sm:grid-cols-2">
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
          </dl>
        </EntitySection>
        <EntitySection title={t('permissionGroups.title')}>
          {isGroupsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : (
            <RbacBadgeGroup
              title={t('permissionGroups.title')}
              items={selectedGroups.map((g: PermissionGroup) => ({
                id: g.id,
                label: g.name,
                href: `/permission-groups/show/${g.id}`,
                description: g.description,
                source: t('roles.assignPermissionGroups'),
              }))}
            />
          )}
        </EntitySection>
      </EntityPageBody>
    </ShowView>
  )
}
