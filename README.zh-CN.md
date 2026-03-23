# RBAC 模板

[English](./README.md) | 中文

基于 **Refine**、**React**、**TypeScript** 和 **shadcn/ui** 构建的前端 RBAC（基于角色的访问控制）模板。后端无关，开箱即用 MSW 本地 mock API。

## 功能

- **用户、角色、权限、权限组** — 完整 CRUD（列表、新建、编辑、查看）
- **shadcn/ui** — 表单配合 React Hook Form、zod 校验
- **i18n** — 英文与中文
- **仪表盘** — 统计卡片、图表（Recharts）
- **MSW** — 无后端本地开发 mock API
- **Vite 8** — 路由级代码分割、vendor 分包、仅 dev 插件

## 技术栈

| 层级 | 技术                                      |
| ---- | ----------------------------------------- |
| 框架 | Refine, React 19                          |
| UI   | shadcn/ui, Radix UI, Tailwind CSS         |
| 数据 | TanStack React Query, axios               |
| 状态 | zustand（客户端）, React Query（服务端）  |
| 表单 | react-hook-form, zod, @hookform/resolvers |
| Mock | MSW                                       |
| i18n | i18next, react-i18next                    |

## 快速开始

### 环境要求

- Node.js 18+
- pnpm 9+

### 安装

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

使用 MSW mock API 启动应用。使用任意用户名登录（如 `demo`）。

### 构建

```bash
pnpm build
```

### 预览

```bash
pnpm preview
```

## 脚本

| 命令                | 说明                   |
| ------------------- | ---------------------- |
| `pnpm dev`          | 启动开发服务（含 MSW） |
| `pnpm build`        | 生产构建               |
| `pnpm preview`      | 预览生产构建           |
| `pnpm lint`         | 运行 ESLint            |
| `pnpm lint:fix`     | ESLint 自动修复        |
| `pnpm format`       | Prettier 格式化        |
| `pnpm typecheck`    | TypeScript 检查        |
| `pnpm docker:build` | 构建 Docker 镜像       |
| `pnpm docker:run`   | 运行容器（端口 8080）  |

## 项目结构

```
src/
├── components/
│   ├── ui/           # shadcn/ui 组件
│   ├── shared/       # 共享业务组件
│   └── refine-ui/    # Refine + shadcn 集成
├── config/           # 类型化 env（apiBaseUrl, isDev 等）
├── constants/        # 路由、资源
├── features/         # 领域模块（auth, rbac, users, roles）
├── hooks/
├── mocks/            # MSW handlers、fixtures
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

| 变量            | 默认值 | 说明                        |
| --------------- | ------ | --------------------------- |
| `VITE_API_URL`  | `/api` | API 根路径                  |
| `VITE_USE_MOCK` | (dev)  | `true` 时构建环境也可用 MSW |

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

开发环境使用 MSW，模拟接口包括：

- 登录、当前用户（`/me`）
- 用户、角色、权限、权限组 CRUD
- 仪表盘统计（`/dashboard/stats`）
- 分页、筛选（如用户列表 `q` 搜索）

详见 `src/mocks/handlers` 和 `src/mocks/fixtures`。Mock 响应符合后端 API 规范（PageResponse 等）。

## Docker

基于 nginx Alpine 构建并运行（支持 gzip + brotli 预压缩）：

```bash
pnpm docker:build
pnpm docker:run
```

应用运行于 http://localhost:8080

## AGENTS.md

项目包含 [AGENTS.md](./AGENTS.md)，定义了架构、技术栈和约定，供 AI 助手与贡献者参考。
