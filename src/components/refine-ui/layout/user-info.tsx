import { useGetIdentity } from '@refinedev/core'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/refine-ui/layout/user-avatar'
import { cn } from '@/lib/utils'

type User = {
  id?: string | number
  name?: string
  fullName?: string
  firstName?: string
  lastName?: string
  email?: string
}

export function UserInfo() {
  const { data: user, isLoading: userIsLoading } = useGetIdentity<User>()

  if (userIsLoading || !user) {
    return (
      <div className={cn('flex', 'items-center', 'gap-x-2')}>
        <Skeleton className={cn('h-10', 'w-10', 'rounded-full')} />
        <div className={cn('flex', 'flex-col', 'justify-between', 'h-10')}>
          <Skeleton className={cn('h-4', 'w-32')} />
          <Skeleton className={cn('h-4', 'w-24')} />
        </div>
      </div>
    )
  }

  const displayName =
    user.fullName ??
    user.name ??
    [user.firstName, user.lastName].filter(Boolean).join(' ') ??
    ''

  return (
    <div className={cn('flex', 'items-center', 'gap-x-2')}>
      <UserAvatar />
      <div
        className={cn(
          'flex',
          'flex-col',
          'justify-between',
          'h-10',
          'text-left'
        )}
      >
        <span className={cn('text-sm', 'font-medium', 'text-muted-foreground')}>
          {displayName}
        </span>
        {user.email && (
          <span className={cn('text-xs', 'text-muted-foreground')}>
            {user.email}
          </span>
        )}
      </div>
    </div>
  )
}

UserInfo.displayName = 'UserInfo'
