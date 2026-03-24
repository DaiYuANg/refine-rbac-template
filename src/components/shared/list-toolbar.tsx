'use client'

import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { useListDisplayStore } from '@/stores/list-display-store'

export type ListToolbarProps = {
  /** Optional bulk delete slot (e.g. Delete selected button when items are selected) */
  bulkActions?: React.ReactNode
}

export const ListToolbar = ({ bulkActions }: ListToolbarProps) => {
  const { t } = useTranslation()
  const showIdColumnFieldId = useId()
  const { showIdColumn, setShowIdColumn } = useListDisplayStore()

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-4">
        <label
          htmlFor={showIdColumnFieldId}
          className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"
        >
          <Checkbox
            id={showIdColumnFieldId}
            checked={showIdColumn}
            onCheckedChange={(v) => setShowIdColumn(v === true)}
          />
          {t('list.showIdColumn')}
        </label>
      </div>
      {bulkActions}
    </div>
  )
}
