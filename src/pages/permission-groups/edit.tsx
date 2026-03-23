import { useState, useEffect } from 'react'
import type { HttpError } from '@refinedev/core'
import { useList, useUpdateMany } from '@refinedev/core'
import { useForm as useHookForm } from '@refinedev/react-hook-form'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { useThrottledCallback } from '@/hooks/use-throttled-callback'
import type { PermissionGroup } from '@/types/permission-group'
import type { Permission } from '@/types/permission'

const permissionGroupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type PermissionGroupFormValues = z.infer<typeof permissionGroupSchema>

export const PermissionGroupEdit = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const groupId = id ?? ''

  const form = useHookForm<
    PermissionGroup,
    HttpError,
    PermissionGroupFormValues
  >({
    refineCoreProps: {
      resource: 'permission-groups',
      action: 'edit',
    },
    resolver: zodResolver(permissionGroupSchema),
  })
  const {
    refineCore: { onFinish, formLoading, query },
    control,
    handleSubmit,
  } = form

  const { result: permissionsResult } = useList<Permission>({
    resource: 'permissions',
    pagination: { currentPage: 1, pageSize: 100, mode: 'server' },
  })
  const permissions = Array.isArray(permissionsResult?.data)
    ? permissionsResult.data
    : []

  const { mutate: updateMany } = useUpdateMany<Permission>()
  const [isAssigning, setIsAssigning] = useState(false)

  const assignedIds = new Set(
    permissions
      .filter((p: Permission) => p.groupId === groupId)
      .map((p: Permission) => p.id)
  )
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => assignedIds)
  const assignedIdsStr = [...assignedIds].sort().join(',')
  useEffect(() => {
    setSelectedIds(new Set(assignedIds))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- assignedIdsStr is stable representation of assignedIds
  }, [groupId, assignedIdsStr])

  const throttledOnFinish = useThrottledCallback(
    (values: PermissionGroupFormValues) =>
      onFinish({
        ...values,
        description: values.description || undefined,
      }),
    300
  )

  const handlePermissionToggle = (permId: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(permId)
      else next.delete(permId)
      return next
    })
  }

  const handleSaveAssignments = () => {
    const toAdd = permissions.filter(
      (p: Permission) => selectedIds.has(p.id) && !assignedIds.has(p.id)
    )
    const toRemove = permissions.filter(
      (p: Permission) => !selectedIds.has(p.id) && assignedIds.has(p.id)
    )

    setIsAssigning(true)
    const promises: Promise<unknown>[] = []
    if (toAdd.length) {
      promises.push(
        new Promise((res, rej) =>
          updateMany(
            {
              resource: 'permissions',
              ids: toAdd.map((p) => p.id),
              values: { groupId },
            },
            { onSuccess: res, onError: rej }
          )
        )
      )
    }
    if (toRemove.length) {
      promises.push(
        new Promise((res, rej) =>
          updateMany(
            {
              resource: 'permissions',
              ids: toRemove.map((p) => p.id),
              values: { groupId: null },
            },
            { onSuccess: res, onError: rej }
          )
        )
      )
    }
    Promise.all(promises).finally(() => setIsAssigning(false))
  }

  const isLoading = query?.isLoading ?? false

  if (isLoading) {
    return (
      <EditView>
        <EditViewHeader resource="permission-groups" />
        <div className="flex flex-col gap-6 max-w-md">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </EditView>
    )
  }

  return (
    <EditView>
      <EditViewHeader resource="permission-groups" />
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
                  <FormLabel>{t('permissionGroups.name')}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={formLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('permissionGroups.description')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      disabled={formLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={formLoading}>
              {formLoading ? t('common.saving') : t('common.save')}
            </Button>
          </form>
        </Form>

        <Card>
          <CardHeader>
            <CardTitle>{t('permissionGroups.assignPermissions')}</CardTitle>
            <CardDescription>
              {t('permissionGroups.assignPermissionsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[240px] rounded-md border p-4">
              <div className="flex flex-col gap-3">
                {permissions.map((perm: Permission) => (
                  <label
                    key={perm.id}
                    className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedIds.has(perm.id)}
                      onCheckedChange={(c) =>
                        handlePermissionToggle(perm.id, c === true)
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{perm.name}</span>
                      <span className="ml-2 font-mono text-xs text-muted-foreground">
                        {perm.code}
                      </span>
                    </div>
                  </label>
                ))}
                {permissions.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4">
                    {t('common.noData')}
                  </p>
                )}
              </div>
            </ScrollArea>
            <Button
              type="button"
              variant="secondary"
              className="mt-4"
              onClick={handleSaveAssignments}
              disabled={isAssigning}
            >
              {isAssigning
                ? t('common.saving')
                : t('permissionGroups.saveAssignments')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </EditView>
  )
}
