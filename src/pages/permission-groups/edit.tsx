import type { HttpError } from '@refinedev/core'
import { useForm } from '@refinedev/react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import type { PermissionGroup } from '@/types/permission-group'

const permissionGroupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type PermissionGroupFormValues = z.infer<typeof permissionGroupSchema>

export function PermissionGroupEdit() {
  const { t } = useTranslation()
  const form = useForm<PermissionGroup, HttpError, PermissionGroupFormValues>({
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
      <Form {...form}>
        <form
          onSubmit={handleSubmit((values) =>
            onFinish({
              ...values,
              description: values.description || undefined,
            })
          )}
          className="flex flex-col gap-6 max-w-md"
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
    </EditView>
  )
}
