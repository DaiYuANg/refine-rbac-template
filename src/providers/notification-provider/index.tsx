import type { NotificationProvider } from '@refinedev/core'
import type { OpenNotificationParams } from '@refinedev/core'
import { toast } from 'sonner'

export const notificationProvider: NotificationProvider = {
  open: ({ message, type, description, key }: OpenNotificationParams) => {
    const toastId = key ?? `refine-${Date.now()}`

    switch (type) {
      case 'success':
        toast.success(message, { description, id: toastId })
        break
      case 'error':
        toast.error(message, { description, id: toastId })
        break
      case 'progress':
        toast.loading(message, { description, id: toastId })
        break
      default:
        toast(message, { description, id: toastId })
    }

    return toastId
  },
  close: (key: string) => {
    toast.dismiss(key)
  },
}
