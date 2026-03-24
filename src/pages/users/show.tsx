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
import type { User } from '@/types/user'
import type { Role } from '@/types/role'

export const UserShow = () => {
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
      <EntityPageBody>
        <EntitySection title={t('users.title')}>
          <dl className="grid gap-4 sm:grid-cols-2">
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
          </dl>
        </EntitySection>
        <EntitySection title={t('roles.title')}>
          {isRolesLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : (
            <RbacBadgeGroup
              title={t('roles.title')}
              items={selectedRoles.map((r: Role) => ({
                id: r.id,
                label: r.name,
                href: `/roles/show/${r.id}`,
                description: r.description,
                source: t('roles.roles'),
              }))}
            />
          )}
        </EntitySection>
      </EntityPageBody>
    </ShowView>
  )
}
