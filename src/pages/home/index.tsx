import { Button } from '@/components/ui/button'
import { Link } from '@refinedev/core'

export function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">欢迎</h1>
      <p className="mb-4 text-muted-foreground">
        RBAC 权限管理模板 — 用户、角色、权限、权限组
      </p>
      <div className="flex gap-2">
        <Link to="/users">
          <Button>用户管理</Button>
        </Link>
        <Link to="/roles">
          <Button variant="outline">角色管理</Button>
        </Link>
        <Link to="/permissions">
          <Button variant="outline">权限管理</Button>
        </Link>
        <Link to="/permission-groups">
          <Button variant="outline">权限组管理</Button>
        </Link>
      </div>
    </div>
  )
}
