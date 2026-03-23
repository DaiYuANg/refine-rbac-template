'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export type BulkDeleteButtonProps = {
  count: number
  onConfirm: () => void
  disabled?: boolean
  isLoading?: boolean
  /** Hide when user lacks delete permission */
  hidden?: boolean
}

export function BulkDeleteButton({
  count,
  onConfirm,
  disabled,
  isLoading,
  hidden,
}: BulkDeleteButtonProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  if (hidden || count === 0) return null

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span>
          <Button
            variant="destructive"
            size="sm"
            disabled={disabled || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Trash className="mr-2 h-4 w-4" />
            {t('buttons.bulkDelete')} ({count})
          </Button>
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="end">
        <div className="flex flex-col gap-3">
          <p className="text-sm">{t('buttons.bulkDeleteConfirm', { count })}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isLoading}
              onClick={handleConfirm}
            >
              {isLoading ? t('common.loading') : t('common.delete')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
