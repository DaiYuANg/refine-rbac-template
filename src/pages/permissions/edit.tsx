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
import { useThrottledCallback } from '@/hooks/use-throttled-callback'
import {
  EntityPageBody,
  EntitySection,
} from '@/components/shared/entity-page-section'
import type { Permission } from '@/types/permission'

const permissionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  groupId: z.string().optional(),
})

type PermissionFormValues = z.infer<typeof permissionSchema>

export const PermissionEdit = () => {
  const { t } = useTranslation()
  const form = useForm<Permission, HttpError, PermissionFormValues>({
    refineCoreProps: {
      resource: 'permissions',
      action: 'edit',
    },
    resolver: zodResolver(permissionSchema),
  })
  const {
    refineCore: { onFinish, formLoading, query },
    control,
    handleSubmit,
  } = form

  const throttledOnFinish = useThrottledCallback(
    (values: PermissionFormValues) =>
      onFinish({
        ...values,
        groupId: values.groupId || undefined,
      }),
    300
  )

  const isLoading = query?.isLoading ?? false

  if (isLoading) {
    return (
      <EditView>
        <EditViewHeader resource="permissions" />
        <div className="flex flex-col gap-6 max-w-md">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </EditView>
    )
  }

  return (
    <EditView>
      <EditViewHeader resource="permissions" />
      <EntityPageBody className="max-w-2xl">
        <EntitySection title={t('common.edit')}>
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
                    <FormLabel>{t('permissions.name')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={formLoading}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('permissions.code')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={formLoading}
                        placeholder={t('permissions.codePlaceholder')}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('permissions.groupId')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        disabled={formLoading}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={formLoading}
                className="w-fit min-w-28"
              >
                {formLoading ? t('common.saving') : t('common.save')}
              </Button>
            </form>
          </Form>
        </EntitySection>
      </EntityPageBody>
    </EditView>
  )
}
