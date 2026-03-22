import { useList } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import {
  ListView,
  ListViewHeader,
} from '@/components/refine-ui/views/list-view'
import { ShowButton } from '@/components/refine-ui/buttons/show'
import { EditButton } from '@/components/refine-ui/buttons/edit'
import { DeleteButton } from '@/components/refine-ui/buttons/delete'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import type { PermissionGroup } from '@/types/permission-group'

export function PermissionGroupList() {
  const { t } = useTranslation()
  const { query, result } = useList<PermissionGroup>({
    resource: 'permission-groups',
    pagination: { currentPage: 1, pageSize: 10, mode: 'server' },
  })

  const groups = Array.isArray(result?.data) ? result.data : []
  const isLoading = query.isLoading

  return (
    <ListView>
      <ListViewHeader resource="permission-groups" />
      <div className="rounded-md border">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{t('permissionGroups.name')}</TableHead>
                <TableHead>{t('permissionGroups.description')}</TableHead>
                <TableHead className="w-[120px] text-right">
                  {t('common.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                groups.map((group: PermissionGroup) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-mono text-xs">
                      {group.id}
                    </TableCell>
                    <TableCell>
                      <ShowButton
                        resource="permission-groups"
                        recordItemId={group.id}
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-normal hover:bg-transparent hover:underline"
                      >
                        {group.name}
                      </ShowButton>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {group.description ?? '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <ShowButton
                          resource="permission-groups"
                          recordItemId={group.id}
                          variant="outline"
                          size="sm"
                        />
                        <EditButton
                          resource="permission-groups"
                          recordItemId={group.id}
                          variant="outline"
                          size="sm"
                        />
                        <DeleteButton
                          resource="permission-groups"
                          recordItemId={group.id}
                          size="sm"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </ListView>
  )
}
