import { useList } from '@refinedev/core'
import { useTranslation } from 'react-i18next'
import { ListView, ListViewHeader } from '@/components/refine-ui/views/list-view'
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
import type { Permission } from '@/types/permission'

export function PermissionList() {
  const { t } = useTranslation()
  const { query, result } = useList<Permission>({
    resource: 'permissions',
    pagination: { currentPage: 1, pageSize: 10, mode: 'server' },
  })

  const permissions = Array.isArray(result?.data) ? result.data : []
  const isLoading = query.isLoading

  return (
    <ListView>
      <ListViewHeader resource="permissions" />
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
                <TableHead>{t('permissions.name')}</TableHead>
                <TableHead>{t('permissions.code')}</TableHead>
                <TableHead>{t('permissions.groupId')}</TableHead>
                <TableHead className="w-[120px] text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                permissions.map((perm: Permission) => (
                  <TableRow key={perm.id}>
                    <TableCell className="font-mono text-xs">{perm.id}</TableCell>
                    <TableCell>
                      <ShowButton
                        resource="permissions"
                        recordItemId={perm.id}
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-normal hover:bg-transparent hover:underline"
                      >
                        {perm.name}
                      </ShowButton>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{perm.code}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {perm.groupId ?? '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <ShowButton
                          resource="permissions"
                          recordItemId={perm.id}
                          variant="outline"
                          size="sm"
                        />
                        <EditButton
                          resource="permissions"
                          recordItemId={perm.id}
                          variant="outline"
                          size="sm"
                        />
                        <DeleteButton
                          resource="permissions"
                          recordItemId={perm.id}
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
