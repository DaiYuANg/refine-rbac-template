import { useShow } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import {
  ShowView,
  ShowViewHeader,
} from '@/components/refine-ui/views/show-view'
import { Skeleton } from '@/components/ui/skeleton'
import type { Permission } from '@/types/permission'

export function PermissionShow() {
  const { t } = useTranslation()
  const { query } = useShow<Permission>({ resource: 'permissions' })
  const perm = query?.data?.data
  const isLoading = query?.isLoading ?? false

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
      <dl className="grid gap-4 max-w-md">
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
        <div>
          <dt className="text-sm font-medium text-muted-foreground">
            {t('permissions.groupId')}
          </dt>
          <dd className="mt-1">{perm.groupId ?? '-'}</dd>
        </div>
      </dl>
    </ShowView>
  )
}
