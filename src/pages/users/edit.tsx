import { useState, useEffect } from 'react'
import type { HttpError } from '@refinedev/core'
import { useList } from '@refinedev/core'
import { useForm } from '@refinedev/react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  EditView,
  EditViewHeader,
} from '@/components/refine-ui/views/edit-view'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useThrottledCallback } from '@/hooks/use-throttled-callback'
import type { User } from '@/types/user'
import type { Role } from '@/types/role'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
})

type UserFormValues = z.infer<typeof userSchema>

export function UserEdit() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const userId = id ?? ''

  const form = useForm<User, HttpError, UserFormValues>({
    refineCoreProps: {
      resource: 'users',
      action: 'edit',
    },
    resolver: zodResolver(userSchema),
  })
  const {
    refineCore: { onFinish, formLoading, query },
    control,
    handleSubmit,
  } = form

  const { result: rolesResult } = useList<Role>({
    resource: 'roles',
    pagination: { currentPage: 1, pageSize: 50, mode: 'server' },
  })
  const roles = Array.isArray(rolesResult?.data) ? rolesResult.data : []

  const assignedRoleIds = new Set(
    (query?.data?.data as User | undefined)?.roleIds ?? []
  )
  const [selectedRoleIds, setSelectedRoleIds] =
    useState<Set<string>>(assignedRoleIds)
  const assignedRoleIdsStr = [...assignedRoleIds].sort().join(',')
  useEffect(() => {
    setSelectedRoleIds(new Set(assignedRoleIds))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- assignedRoleIdsStr is stable
  }, [userId, assignedRoleIdsStr])

  const throttledOnFinish = useThrottledCallback(
    (values: UserFormValues) =>
      onFinish({
        ...values,
        roleIds: [...selectedRoleIds],
      } as unknown as UserFormValues),
    300
  )

  const handleRoleToggle = (roleId: string, checked: boolean) => {
    setSelectedRoleIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(roleId)
      else next.delete(roleId)
      return next
    })
  }

  const isLoading = query?.isLoading ?? false

  if (isLoading) {
    return (
      <EditView>
        <EditViewHeader resource="users" />
        <div className="flex flex-col gap-6 max-w-md">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </EditView>
    )
  }

  return (
    <EditView>
      <EditViewHeader resource="users" />
      <div className="flex flex-col gap-6 max-w-2xl">
        <Form {...form}>
          <form
            onSubmit={handleSubmit((values) => throttledOnFinish(values))}
            className="flex flex-col gap-6"
          >
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.name')}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={formLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.email')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" disabled={formLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card>
              <CardHeader>
                <CardTitle>{t('users.assignRoles')}</CardTitle>
                <CardDescription>{t('users.assignRolesDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {roles.map((role: Role) => (
                    <label
                      key={role.id}
                      className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedRoleIds.has(role.id)}
                        onCheckedChange={(c) =>
                          handleRoleToggle(role.id, c === true)
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{role.name}</div>
                        {role.description && (
                          <div className="text-sm text-muted-foreground mt-0.5">
                            {role.description}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={formLoading}>
              {formLoading ? t('common.saving') : t('common.save')}
            </Button>
          </form>
        </Form>
      </div>
    </EditView>
  )
}
