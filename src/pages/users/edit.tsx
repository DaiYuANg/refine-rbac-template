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
import type { User } from '@/types/user'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
})

type UserFormValues = z.infer<typeof userSchema>

export function UserEdit() {
  const { t } = useTranslation()
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
      <Form {...form}>
        <form
          onSubmit={handleSubmit((values) => onFinish(values))}
          className="flex flex-col gap-6 max-w-md"
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
          <Button type="submit" disabled={formLoading}>
            {formLoading ? t('common.saving') : t('common.save')}
          </Button>
        </form>
      </Form>
    </EditView>
  )
}
