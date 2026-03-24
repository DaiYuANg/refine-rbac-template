# RBAC 模板

[English](./README.md) | 中文

基于 **Refine**、**React**、**TypeScript** 和 **shadcn/ui** 构建的前端 RBAC（基于角色的访问控制）模板。后端无关，开箱即用 **vite-plugin-mock-dev-server** 在本地提供 mock API。

## 功能

- **用户、角色、权限、权限组** — 完整 CRUD（列表、新建、编辑、查看）
- **RBAC** — 基于权限的访问控制，多种 mock 用户可测试不同权限
- **列表增强** — 每页条数（10/25/50）、分页/筛选 URL 持久化、ID 列可配置、批量删除（含确认）
- **shadcn/ui** — 表单配合 React Hook Form、zod 校验
- **i18n** — 英文与中文
- **仪表盘** — 统计卡片、图表（Recharts）
- **vite-plugin-mock-dev-server** — 无后端本地开发 mock API
- **Vite 8** — 路由级代码分割、vendor 分包、仅 dev 插件

## 技术栈

| 层级 | 技术                                      |
| ---- | ----------------------------------------- |
| 框架 | Refine, React 19                          |
| UI   | shadcn/ui, Radix UI, Tailwind CSS         |
| 数据 | TanStack React Query, axios               |
| 状态 | zustand（客户端）, React Query（服务端）  |
| 表单 | react-hook-form, zod, @hookform/resolvers |
| Mock | vite-plugin-mock-dev-server               |
| i18n | i18next, react-i18next                    |

## 快速开始

### 环境要求

- Node.js 20+（见 `package.json` 中 `engines`）
- pnpm 10+（见 `package.json` 中 `packageManager`；推荐使用 Corepack）

### 安装

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

使用 vite-plugin-mock-dev-server 提供的 mock API 启动应用。可用以下用户名测试不同权限：

| 用户名                 | 角色       | 权限                |
| ---------------------- | ---------- | ------------------- |
| `admin@example.com`    | 管理员     | 全部权限            |
| `readonly@example.com` | 只读       | 仅查看              |
| `users@example.com`    | 用户管理员 | 用户 CRUD、角色查看 |
| `roles@example.com`    | 角色管理员 | 仅角色 CRUD         |
| `guest@example.com`    | 访客       | 仅仪表盘            |

### 构建

```bash
pnpm build
```

### 预览

```bash
pnpm preview
```

## 脚本

| 命令                | 说明                                             |
| ------------------- | ------------------------------------------------ |
| `pnpm dev`          | 启动开发服务（含 mock API）                      |
| `pnpm build`        | 生产构建                                         |
| `pnpm preview`      | 预览生产构建                                     |
| `pnpm lint`         | 运行 ESLint（含 React Compiler 规则与 jsx-a11y） |
| `pnpm lint:fix`     | ESLint 自动修复                                  |
| `pnpm format`       | Prettier 格式化                                  |
| `pnpm typecheck`    | TypeScript 检查                                  |
| `pnpm docker:build` | 构建 Docker 镜像                                 |
| `pnpm docker:run`   | 运行容器（端口 8080）                            |

## 项目结构

```
mock/                # vite-plugin-mock-dev-server handlers (*.mock.ts)
src/
├── components/
│   ├── ui/           # shadcn/ui 组件
│   ├── shared/       # 共享业务组件
│   └── refine-ui/    # Refine + shadcn 集成
├── config/           # 类型化 env（apiBaseUrl, isDev 等）
├── constants/        # 路由、资源
├── features/         # 领域模块（auth, rbac, users, roles）
├── hooks/
├── mocks/            # Fixtures（mock 与页面共用）
├── pages/            # 页面
├── providers/        # Refine 提供者（auth, data, access, i18n, notification）
│   └── data-provider/
│       ├── adapters/     # rest-rbac 适配器
│       ├── create-data-provider.ts
│       └── types.ts
├── routes/
├── types/
├── utils/
├── app.tsx
└── main.tsx
```

## 环境变量

所有环境变量通过 `src/config` 统一访问：

| 变量                         | 默认值                         | 说明                                |
| ---------------------------- | ------------------------------ | ----------------------------------- |
| `VITE_API_URL`               | `/api`                         | API 根路径                          |
| `VITE_AUTH_REFRESH_URL`      | `${VITE_API_URL}/auth/refresh` | Refresh token 接口地址              |
| `VITE_USE_MOCK`              | (dev)                          | `true` 时构建环境启用 mock          |
| `VITE_MOCK_401_PROB`         | `0.15`                         | Mock 401 概率，E2E 建议设 `0`       |
| `VITE_MOCK_HEALTH_FAIL_PROB` | `0.05`                         | Mock 健康检查失败率，E2E 建议设 `0` |
| `VITE_ENABLE_AUDIT_LOG`      | —                              | `true` 时启用 Refine 审计日志       |

---

## 文档

### Data Provider 与后端 API 契约

本项目使用 **custom data provider**，并定义了 **后端 API 契约**。后端实现须遵循下述规范。

---

### 后端 REST 接口规范

#### 基础约定

- **Base URL**：`{apiBaseUrl}`，如 `/api`
- **Content-Type**：`application/json`
- **认证**：`Authorization: Bearer {token}`

#### REST 资源 URL

| 操作     | 方法   | URL 模式                    | 说明           |
| -------- | ------ | --------------------------- | -------------- |
| 列表     | GET    | `/{resource}`               | 分页查询       |
| 详情     | GET    | `/{resource}/{id}`          | 单条查询       |
| 创建     | POST   | `/{resource}`               | 新增           |
| 批量创建 | POST   | `/{resource}/bulk`          | 批量新增       |
| 更新     | PATCH  | `/{resource}/{id}`          | 部分更新       |
| 批量更新 | PATCH  | `/{resource}/bulk?id=1,2,3` | 批量更新       |
| 删除     | DELETE | `/{resource}/{id}`          | 删除           |
| 批量删除 | DELETE | `/{resource}?id=1,2,3`      | 批量删除       |
| 批量     | GET    | `/{resource}?id=1,2,3`      | 按 id 列表查询 |

#### 分页列表 `GET /{resource}`

**请求 Query（1-based）**：

| 参数       | 类型   | 必填 | 说明                           |
| ---------- | ------ | ---- | ------------------------------ |
| page       | number | 是   | 页码，1-based，第一页为 1      |
| pageSize   | number | 是   | 每页条数                       |
| q          | string | 否   | 关键词搜索                     |
| field_eq   | string | 否   | 字段精确匹配，如 `name_eq=xxx` |
| field_like | string | 否   | 字段模糊匹配                   |
| field_gte  | string | 否   | 字段大于等于                   |
| field_lte  | string | 否   | 字段小于等于                   |
| field_ne   | string | 否   | 字段不等于                     |
| sort       | string | 否   | 排序字段，多个逗号分隔         |
| order      | string | 否   | 排序方向，`asc` 或 `desc`      |

**响应体**（`PageResponse<T>`）：

```ts
{
  items: T[]     // 当前页数据
  total: number  // 总条数
  page: number   // 当前页码，1-based
  pageSize: number
}
```

#### 单条与变更

- **GET /{resource}/{id}**：响应 = 资源对象 `T`
- **POST /{resource}**：请求体 = 创建字段；响应 = 创建后的 `T` 或 `{ data: T }`
- **POST /{resource}/bulk**：请求体 = `{ items: T[] }`；响应 = 创建后的 `T[]`
- **PATCH /{resource}/{id}**：请求体 = 待更新字段；响应 = 更新后的 `T` 或 `{ data: T }`
- **PATCH /{resource}/bulk?id=1,2,3**：请求体 = variables；响应 = 更新后的 `T[]`
- **DELETE /{resource}/{id}**：响应 = 204 或 被删除对象 `T`
- **DELETE /{resource}?id=1,2,3**：响应 = 被删除的 `T[]`
- **GET /{resource}?id=1,2,3**：响应 = `T[]` 或 `PageResponse<T>`

#### 错误响应

| 状态码  | 类型         | 响应体格式                                                |
| ------- | ------------ | --------------------------------------------------------- |
| 401     | unauthorized | `{ message?: string }`                                    |
| 403     | forbidden    | `{ message?: string }`                                    |
| 404     | not_found    | `{ message?: string }`                                    |
| 400/422 | validation   | `{ message?: string, errors?: Record<string, string[]> }` |
| 5xx     | unknown      | `{ message?: string }`                                    |

#### 非资源端点（custom）

如 `/me`、`/dashboard/stats` 等，由前端 `dataProvider.custom` 直接调用，响应体由业务约定。

---

### 后端业务适配规则

本节说明本 RBAC 模板的**业务侧** API 约定。后端实现需按以下结构提供接口，才能完整对接功能。

#### 1. 认证与当前用户 — `GET /me`

**必选**。登录后用于获取身份、角色和权限，供 `authProvider.getIdentity` 与 `getPermissions` 使用。

**请求**：`GET {apiBaseUrl}/me`，Header 携带 `Authorization: Bearer {token}`

**响应**（`MeResponse`）：

```ts
{
  id: string
  name: string
  email?: string
  roles: { id: string; name: string }[]
  permissions: string[]   // 如 ["users:read", "users:write", "roles:read", ...]
}
```

- `roles`：至少包含 `{ id, name }`。角色名为 `admin` 或 `管理员` 时跳过所有权限校验。
- `permissions`：权限码数组，格式见下方 RBAC 映射。

#### 2. 仪表盘统计 — `GET /dashboard/stats`

**可选**。用于仪表盘页的统计卡片与图表。

**请求**：`GET {apiBaseUrl}/dashboard/stats`

**响应**：

```ts
{
  statCards: {
    key: string
    value: number
    labelKey: string
  }
  ;[]
  userActivity: {
    month: string
    users: number
    logins: number
  }
  ;[]
  roleDistribution: {
    name: string
    value: number
    color: string
  }
  ;[]
  permissionGroups: {
    name: string
    count: number
  }
  ;[]
}
```

- `statCards.labelKey`：i18n 键名，如 `dashboard.totalUsers`。
- `roleDistribution.color`：CSS 颜色，如 `var(--chart-1)` 或十六进制。

#### 3. 资源路径与字段结构

| 资源   | 路径                 | 核心字段                                                          |
| ------ | -------------------- | ----------------------------------------------------------------- |
| 用户   | `/users`             | `id`, `email`, `name`, `roleIds?`, `createdAt?`                   |
| 角色   | `/roles`             | `id`, `name`, `description?`, `permissionGroupIds?`, `createdAt?` |
| 权限   | `/permissions`       | `id`, `name`, `code`, `groupId?`, `createdAt?`                    |
| 权限组 | `/permission-groups` | `id`, `name`, `description?`, `createdAt?`                        |

- 主键统一为 `id: string`。
- 列表筛选：用户支持 `q`、`name_like`、`email_like`；其余按 API 规范使用 `field_eq`、`field_like` 等。
- 排序：统一使用 `sort`、`order` 查询参数。

#### 4. 分配相关接口

模板支持三种分配关系，后端需接受并持久化对应字段。

| 分配关系      | 资源         | 字段                           | 更新方式                                                       | 说明                             |
| ------------- | ------------ | ------------------------------ | -------------------------------------------------------------- | -------------------------------- |
| 用户 → 角色   | `User`       | `roleIds: string[]`            | `PATCH /users/:id`                                             | 用户所属角色 ID 数组             |
| 角色 → 权限组 | `Role`       | `permissionGroupIds: string[]` | `PATCH /roles/:id`                                             | 角色拥有的权限组 ID 数组         |
| 权限组 → 权限 | `Permission` | `groupId: string \| null`      | `PATCH /permissions/:id` 或 `PATCH /permissions/bulk?id=1,2,3` | 单个权限组 ID；`null` 表示未分配 |

**用户 → 角色**

- 编辑页通过 `PATCH /users/:id` 发送 `{ ...userFields, roleIds: ["1", "2"] }`。
- 后端需接受 `roleIds` 并持久化用户与角色的关联。

**角色 → 权限组**

- 编辑页通过 `PATCH /roles/:id` 发送 `{ ...roleFields, permissionGroupIds: ["1", "2"] }`。
- 后端需接受 `permissionGroupIds` 并持久化角色与权限组的关联。

**权限组 → 权限**

- 编辑页通过 `PATCH /permissions/bulk?id=1,2,3`，body `{ groupId: "1" }` 表示分配，`{ groupId: null }` 表示取消分配。
- 每个权限最多属于一个权限组；`groupId: null` 表示该权限不属于任何组。

#### 5. RBAC 权限码映射

前端将「资源 + 操作」映射为权限码：

| 资源              | list / show              | create / edit / delete    |
| ----------------- | ------------------------ | ------------------------- |
| users             | `users:read`             | `users:write`             |
| roles             | `roles:read`             | `roles:write`             |
| permissions       | `permissions:read`       | `permissions:write`       |
| permission-groups | `permission-groups:read` | `permission-groups:write` |

- 后端 `/me` 需返回上述格式的权限码（如 `users:read`、`users:write`）。
- 角色名为 `admin` 或 `管理员` 时，不受权限限制。
- 未映射的资源（如 dashboard）默认放行。

#### 6. 登录流程（可选）

模板默认使用 mock 登录，不请求后端。对接真实后端时：

- 实现登录接口（如 `POST /auth/login`），接收用户名/密码，返回 JWT 或 session token。
- 修改 `src/providers/auth-provider` 中的 `authProvider.login`，调用该接口并保存 token。
- 后续请求（含 `/me`）通过 `Authorization: Bearer {token}` 携带 token。

#### 7. Refresh Token（基于 Cookie）

当 access token 过期（接口返回 401）时，前端使用 refresh token 获取新的 access token 并重试失败的请求。

**流程**：

1. 请求返回 401 → 前端调用 `POST /auth/refresh`，携带 `credentials: 'include'`（发送 httpOnly cookie）。
2. 后端校验 cookie 中的 refresh token，返回新的 `accessToken`。
3. 前端更新 session 并重试原请求。
4. 若 refresh 返回 401 → 登出并跳转登录页。

**并发**：多个 401 共享一次 refresh 请求，所有等待者获得新 token 后重试。

**后端约定**：

- **接口**：`POST {apiBaseUrl}/auth/refresh`（可通过 `VITE_AUTH_REFRESH_URL` 覆盖）
- **请求**：Cookie 携带 refresh token（httpOnly，由登录接口设置）
- **响应 200**：`{ accessToken: string }`
- **响应 401**：refresh token 过期 → 前端登出

---

### Data Provider 规范

#### 标准数据结构

**分页**（`src/types/pagination.ts`）：

```ts
export type PageRequest = {
  page: number // 1-based
  pageSize: number
}

export type PageResponse<T> = {
  items: T[]
  total: number
  page: number // 1-based
  pageSize: number
}
```

**错误**（`src/types/errors.ts`）：

```ts
export type ApiErrorKind =
  | 'unauthorized'
  | 'forbidden'
  | 'validation'
  | 'not_found'
  | 'unknown'

export interface NormalizedApiError {
  kind: ApiErrorKind
  message: string
  statusCode?: number
  fieldErrors?: Record<string, string[]>
}
```

**Refine 映射**：

| 内部/契约          | Refine 接口     | 说明               |
| ------------------ | --------------- | ------------------ |
| PageRequest        | pagination      | currentPage ↔ page |
| PageResponse<T>    | GetListResponse | items → data       |
| NormalizedApiError | axios 拦截器    | 附加到 rejection   |

#### 方法规范

- **getList**：分页列表；1-based；adapter 将 PageResponse 转为 Refine 格式
- **getOne**、**getMany**：符合 Refine 标准语义
- **create**、**createMany**：单条与批量创建
- **update**、**updateMany**：单条与批量更新
- **deleteOne**、**deleteMany**：单条与批量删除
- **custom**：非资源型端点（url、method、payload、query、headers）

#### Adapter 规范

- **请求**：PageRequest → `page`、`pageSize` + filters/sort（见后端 API 规范）
- **响应**：`PageResponse<T>` 或 `T[]` → Refine `{ data, total }`
- **Transport**：共享 axios、auth header、错误归一化

#### 禁止项

- 页面直接调用 axios
- 页面中 `page + 1` / `page - 1`
- 页面解析后端原始错误
- 页面依赖后端字段命名

---

## Mock API

开发环境通过 **vite-plugin-mock-dev-server**（`mock/*.mock.ts`）模拟接口，包括：

- 健康检查（`/health`）— 返回 `{ status: "UP" }`
- 登录、当前用户（`/me`）— 根据登录用户名返回不同权限
- 用户、角色、权限、权限组 CRUD
- 仪表盘统计（`/dashboard/stats`）
- 分页、筛选（如用户列表 `q` 搜索）

详见 `mock/` 与 `src/mocks/fixtures/`（含 `mock-identities.ts`）。Mock 响应符合后端 API 规范（PageResponse 等）。

## Docker

基于 nginx Alpine 构建并运行（支持 gzip + brotli 预压缩）：

```bash
pnpm docker:build
pnpm docker:run
```

应用运行于 http://localhost:8080

## AGENTS.md

项目包含 [AGENTS.md](./AGENTS.md)，定义了架构、技术栈和约定，供 AI 助手与贡献者参考。
