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
import {
  EntityPageBody,
  EntitySection,
} from '@/components/shared/entity-page-section'
import type { PermissionGroup } from '@/types/permission-group'

const permissionGroupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type PermissionGroupFormValues = z.infer<typeof permissionGroupSchema>

export const PermissionGroupCreate = () => {
  const { t } = useTranslation()
  const form = useForm<PermissionGroup, HttpError, PermissionGroupFormValues>({
    refineCoreProps: {
      resource: 'permission-groups',
      action: 'create',
    },
    resolver: zodResolver(permissionGroupSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })
  const {
    refineCore: { onFinish, formLoading },
    control,
    handleSubmit,
  } = form

  const throttledOnFinish = useThrottledCallback(
    (values: PermissionGroupFormValues) =>
      onFinish({
        ...values,
        description: values.description || undefined,
      }),
    300
  )

  return (
    <CreateView>
      <CreateViewHeader resource="permission-groups" />
      <EntityPageBody className="max-w-2xl">
        <EntitySection title={t('permissionGroups.createTitle')}>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('permissionGroups.description')}</FormLabel>
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
                {formLoading ? t('common.submitting') : t('common.create')}
              </Button>
            </form>
          </Form>
        </EntitySection>
      </EntityPageBody>
    </CreateView>
  )
}
