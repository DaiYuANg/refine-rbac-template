import { useShow } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view'
import { Skeleton } from '@/components/ui/skeleton'
import type { PermissionGroup } from '@/types/permission-group'

export function PermissionGroupShow() {
  const { t } = useTranslation()
  const { query } = useShow<PermissionGroup>({ resource: 'permission-groups' })
  const group = query?.data?.data
  const isLoading = query?.isLoading ?? false

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
      </dl>
    </ShowView>
  )
}
