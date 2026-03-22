import { useShow } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view'
import { Skeleton } from '@/components/ui/skeleton'
import type { Role } from '@/types/role'

export function RoleShow() {
  const { t } = useTranslation()
  const { query } = useShow<Role>({ resource: 'roles' })
  const role = query?.data?.data
  const isLoading = query?.isLoading ?? false

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
          <dt className="text-sm font-medium text-muted-foreground">{t('roles.name')}</dt>
          <dd className="mt-1">{role.name}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">
            {t('roles.description')}
          </dt>
          <dd className="mt-1">{role.description ?? '-'}</dd>
        </div>
      </dl>
    </ShowView>
  )
}
