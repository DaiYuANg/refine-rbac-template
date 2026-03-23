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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronRight, Key } from 'lucide-react'
import { useThrottledCallback } from '@/hooks/use-throttled-callback'
import type { Role } from '@/types/role'
import type { PermissionGroup } from '@/types/permission-group'
import type { Permission } from '@/types/permission'

const roleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type RoleFormValues = z.infer<typeof roleSchema>

export function RoleEdit() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const roleId = id ?? ''

  const form = useForm<Role, HttpError, RoleFormValues>({
    refineCoreProps: {
      resource: 'roles',
      action: 'edit',
    },
    resolver: zodResolver(roleSchema),
  })
  const {
    refineCore: { onFinish, formLoading, query },
    control,
    handleSubmit,
  } = form

  const { result: groupsResult } = useList<PermissionGroup>({
    resource: 'permission-groups',
    pagination: { currentPage: 1, pageSize: 50, mode: 'server' },
  })
  const { result: permissionsResult } = useList<Permission>({
    resource: 'permissions',
    pagination: { currentPage: 1, pageSize: 100, mode: 'server' },
  })

  const groups = Array.isArray(groupsResult?.data) ? groupsResult.data : []
  const permissions = Array.isArray(permissionsResult?.data)
    ? permissionsResult.data
    : []
  const permissionsByGroup = groups.reduce<Record<string, Permission[]>>(
    (acc: Record<string, Permission[]>, g: PermissionGroup) => {
      acc[g.id] = permissions.filter((p: Permission) => p.groupId === g.id)
      return acc
    },
    {}
  )

  const assignedGroupIds = new Set(
    (query?.data?.data as Role | undefined)?.permissionGroupIds ?? []
  )
  const [selectedGroupIds, setSelectedGroupIds] =
    useState<Set<string>>(assignedGroupIds)
  const assignedGroupIdsStr = [...assignedGroupIds].sort().join(',')
  useEffect(() => {
    setSelectedGroupIds(new Set(assignedGroupIds))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- assignedGroupIdsStr is stable
  }, [roleId, assignedGroupIdsStr])

  const throttledOnFinish = useThrottledCallback(
    (values: RoleFormValues) =>
      onFinish({
        ...values,
        description: values.description || undefined,
        permissionGroupIds: [...selectedGroupIds],
      } as unknown as RoleFormValues),
    300
  )

  const handleGroupToggle = (groupId: string, checked: boolean) => {
    setSelectedGroupIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(groupId)
      else next.delete(groupId)
      return next
    })
  }

  const isLoading = query?.isLoading ?? false

  if (isLoading) {
    return (
      <EditView>
        <EditViewHeader resource="roles" />
        <div className="flex flex-col gap-6 max-w-md">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </EditView>
    )
  }

  return (
    <EditView>
      <EditViewHeader resource="roles" />
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
                  <FormLabel>{t('roles.name')}</FormLabel>
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
                  <FormLabel>{t('roles.description')}</FormLabel>
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

            <Card>
              <CardHeader>
                <CardTitle>{t('roles.assignPermissionGroups')}</CardTitle>
                <CardDescription>
                  {t('roles.assignPermissionGroupsDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {groups.map((group: PermissionGroup) => {
                    const perms = permissionsByGroup[group.id] ?? []
                    return (
                      <Collapsible key={group.id}>
                        <div className="flex items-start gap-2 rounded-lg border p-3">
                          <Checkbox
                            checked={selectedGroupIds.has(group.id)}
                            onCheckedChange={(c) =>
                              handleGroupToggle(group.id, c === true)
                            }
                          />
                          <CollapsibleTrigger className="flex flex-1 items-center gap-2 text-left hover:opacity-80">
                            {perms.length > 0 ? (
                              <ChevronRight className="h-4 w-4 shrink-0 transition-transform [[data-state=open]_&]:rotate-90" />
                            ) : (
                              <span className="w-4" />
                            )}
                            <div>
                              <span className="font-medium">{group.name}</span>
                              {group.description && (
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {group.description}
                                </span>
                              )}
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({perms.length}{' '}
                                {perms.length === 1
                                  ? t('permissions.permissions').toLowerCase()
                                  : t('permissions.permissions').toLowerCase()}
                                )
                              </span>
                            </div>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                          <div className="ml-8 mt-1 flex flex-wrap gap-2 border-l-2 pl-4">
                            {perms.length === 0 ? (
                              <span className="text-sm text-muted-foreground">
                                {t('common.noData')}
                              </span>
                            ) : (
                              perms.map((p: Permission) => (
                                <span
                                  key={p.id}
                                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs"
                                >
                                  <Key className="h-3 w-3" />
                                  <span>{p.name}</span>
                                  <span className="font-mono text-muted-foreground">
                                    {p.code}
                                  </span>
                                </span>
                              ))
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  })}
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
