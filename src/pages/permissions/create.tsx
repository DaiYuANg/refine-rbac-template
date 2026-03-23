import type { HttpError } from '@refinedev/core'
import { useForm } from '@refinedev/react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import {
  CreateView,
  CreateViewHeader,
} from '@/components/refine-ui/views/create-view'
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
import { useThrottledCallback } from '@/hooks/use-throttled-callback'
import type { Permission } from '@/types/permission'

const permissionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  groupId: z.string().optional(),
})

type PermissionFormValues = z.infer<typeof permissionSchema>

export function PermissionCreate() {
  const { t } = useTranslation()
  const form = useForm<Permission, HttpError, PermissionFormValues>({
    refineCoreProps: {
      resource: 'permissions',
      action: 'create',
    },
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: '',
      code: '',
      groupId: '',
    },
  })
  const {
    refineCore: { onFinish, formLoading },
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

  return (
    <CreateView>
      <CreateViewHeader resource="permissions" />
      <Form {...form}>
        <form
          onSubmit={handleSubmit((values) => throttledOnFinish(values))}
          className="flex flex-col gap-6 max-w-md"
        >
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('permissions.name')}</FormLabel>
                <FormControl>
                  <Input {...field} disabled={formLoading} />
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={formLoading}>
            {formLoading ? t('common.submitting') : t('common.create')}
          </Button>
        </form>
      </Form>
    </CreateView>
  )
}
