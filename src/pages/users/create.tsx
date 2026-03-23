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
import type { User } from '@/types/user'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
})

type UserFormValues = z.infer<typeof userSchema>

export const UserCreate = () => {
  const { t } = useTranslation()
  const form = useForm<User, HttpError, UserFormValues>({
    refineCoreProps: {
      resource: 'users',
      action: 'create',
    },
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })
  const {
    refineCore: { onFinish, formLoading },
    control,
    handleSubmit,
  } = form

  const throttledOnFinish = useThrottledCallback(
    (values: UserFormValues) => onFinish(values),
    300
  )

  return (
    <CreateView>
      <CreateViewHeader resource="users" />
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
            {formLoading ? t('common.submitting') : t('common.create')}
          </Button>
        </form>
      </Form>
    </CreateView>
  )
}
