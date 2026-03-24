import { useOne, useShow } from '@refinedev/core'
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
import type { Permission } from '@/types/permission'
import type { PermissionGroup } from '@/types/permission-group'

export const PermissionShow = () => {
  const { t } = useTranslation()
  const { query } = useShow<Permission>({ resource: 'permissions' })
  const perm = query?.data?.data
  const isLoading = query?.isLoading ?? false

  const groupId = perm?.groupId ?? null
  const { result: groupResult, query: groupQuery } = useOne<PermissionGroup>({
    resource: 'permission-groups',
    id: groupId ?? '',
    queryOptions: {
      enabled: !!groupId,
    },
  })
  const group = groupResult
  const isGroupLoading = groupQuery?.isLoading ?? false

  if (isLoading || !perm) {
    return (
      <ShowView>
        <ShowViewHeader resource="permissions" />
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
      <ShowViewHeader resource="permissions" />
      <EntityPageBody>
        <EntitySection title={t('permissions.title')}>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                {t('permissions.name')}
              </dt>
              <dd className="mt-1">{perm.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                {t('permissions.code')}
              </dt>
              <dd className="mt-1 font-mono text-sm">{perm.code}</dd>
            </div>
          </dl>
        </EntitySection>
        {groupId && (
          <EntitySection title={t('permissions.belongsToGroup')}>
            {isGroupLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : group ? (
              <RbacBadgeGroup
                title={t('permissions.belongsToGroup')}
                items={[
                  {
                    id: group.id,
                    label: group.name,
                    href: `/permission-groups/show/${group.id}`,
                    description: group.description,
                    source: t('permissions.belongsToGroup'),
                  },
                ]}
              />
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </EntitySection>
        )}
      </EntityPageBody>
    </ShowView>
  )
}
