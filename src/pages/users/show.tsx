import { useShow } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view'
import { Skeleton } from '@/components/ui/skeleton'
import type { User } from '@/types/user'

export function UserShow() {
  const { t } = useTranslation()
  const { query } = useShow<User>({ resource: 'users' })
  const user = query?.data?.data
  const isLoading = query?.isLoading ?? false

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
          <dt className="text-sm font-medium text-muted-foreground">{t('users.name')}</dt>
          <dd className="mt-1">{user.name}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">{t('users.email')}</dt>
          <dd className="mt-1">{user.email}</dd>
        </div>
      </dl>
    </ShowView>
  )
}
