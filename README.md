# RBAC Template

[中文](./README.zh-CN.md) | English

A frontend RBAC (Role-Based Access Control) template built with **Refine**, **React**, **TypeScript**, and **shadcn/ui**. Backend-agnostic, runs locally with MSW mock APIs out of the box.

## Features

- **Users, Roles, Permissions, Permission Groups** — full CRUD (list, create, edit, show)
- **RBAC** — permission-based access control, multiple mock users for testing
- **List enhancements** — page size (10/25/50), URL-persisted pagination & filters, configurable ID column, bulk delete with confirmation
- **shadcn/ui** — forms with React Hook Form, zod validation
- **i18n** — English & 中文
- **Dashboard** — stats cards, charts (Recharts)
- **vite-plugin-mock-dev-server** — mock API for local dev without backend
- **Vite 8** — route code-splitting, vendor chunks, dev-only plugins

## Tech Stack

| Layer     | Stack                                     |
| --------- | ----------------------------------------- |
| Framework | Refine, React 19                          |
| UI        | shadcn/ui, Radix UI, Tailwind CSS         |
| Data      | TanStack React Query, axios               |
| State     | zustand (client), React Query (server)    |
| Forms     | react-hook-form, zod, @hookform/resolvers |
| Mock API  | vite-plugin-mock-dev-server               |
| i18n      | i18next, react-i18next                    |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Runs the app with mock API (vite-plugin-mock-dev-server). Use these usernames to test different permissions:

| Username               | Role       | Permissions                       |
| ---------------------- | ---------- | --------------------------------- |
| `admin@example.com`    | 管理员     | Full access                       |
| `readonly@example.com` | 只读       | View only (no create/edit/delete) |
| `users@example.com`    | 用户管理员 | Users CRUD, roles view            |
| `roles@example.com`    | 角色管理员 | Roles CRUD only                   |
| `guest@example.com`    | 访客       | Dashboard only                    |

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

## Scripts

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `pnpm dev`              | Start dev server with mock API |
| `pnpm build`            | Production build               |
| `pnpm preview`          | Preview production build       |
| `pnpm lint`             | Run ESLint                     |
| `pnpm lint:fix`         | Run ESLint with auto-fix       |
| `pnpm format`           | Format with Prettier           |
| `pnpm typecheck`        | TypeScript check               |
| `pnpm docker:build`     | Build Docker image             |
| `pnpm docker:run`       | Run container (port 8080)      |
| `pnpm test:e2e`         | Run Playwright E2E tests       |
| `pnpm test:e2e:ui`      | E2E tests with UI mode         |
| `pnpm test:e2e:install` | Install Chromium for E2E       |

### E2E Testing (Playwright)

Run end-to-end tests with Playwright. Uses mock API (`VITE_USE_MOCK=true`).

```bash
pnpm test:e2e:install   # One-time: install Chromium
pnpm test:e2e           # Run tests
pnpm test:e2e:ui        # Run with interactive UI
```

Tests live in `e2e/`. The dev server starts automatically with mock mode during test runs.

## Project Structure

```
e2e/                 # Playwright E2E tests
mock/                # vite-plugin-mock-dev-server handlers (*.mock.ts)
src/
├── components/
│   ├── ui/           # shadcn/ui primitives
│   ├── shared/       # Shared business components
│   └── refine-ui/    # Refine + shadcn integration
├── config/           # Typed env (apiBaseUrl, isDev, …)
├── constants/        # Routes, resources
├── features/         # Domain modules (auth, rbac, users, roles)
├── hooks/
├── mocks/            # Fixtures (used by mock server and pages)
├── pages/            # Route pages
├── providers/        # Refine providers (auth, data, access, i18n, notification)
│   └── data-provider/
│       ├── adapters/    # rest-rbac adapter
│       ├── create-data-provider.ts
│       └── types.ts
├── routes/
├── types/
├── utils/
├── app.tsx
└── main.tsx
```

## Environment

All env access goes through `src/config`:

| Variable                     | Default                        | Description                                     |
| ---------------------------- | ------------------------------ | ----------------------------------------------- |
| `VITE_API_URL`               | `/api`                         | API base URL                                    |
| `VITE_AUTH_REFRESH_URL`      | `${VITE_API_URL}/auth/refresh` | Refresh token endpoint                          |
| `VITE_USE_MOCK`              | (dev)                          | `true` to enable mock in build                  |
| `VITE_MOCK_401_PROB`         | `0.15`                         | E2E: set `0` for stable tests                   |
| `VITE_MOCK_HEALTH_FAIL_PROB` | `0.05`                         | Mock: health check failure rate; set `0` in E2E |
| `VITE_ENABLE_AUDIT_LOG`      | —                              | `true` to enable Refine audit log provider      |

---

## Documentation

### Data Provider & Backend API Contract

This project uses a **custom data provider** and defines a **backend API contract** for REST integration. Backend implementers must follow the contract below.

---

### Backend REST API Specification

#### Base

- **Base URL**: `{apiBaseUrl}`, e.g. `/api`
- **Content-Type**: `application/json`
- **Auth**: `Authorization: Bearer {token}`

#### REST Resource URL

| Operation   | Method | URL Pattern                 | Description    |
| ----------- | ------ | --------------------------- | -------------- |
| List        | GET    | `/{resource}`               | Paginated list |
| Detail      | GET    | `/{resource}/{id}`          | Single record  |
| Create      | POST   | `/{resource}`               | Create         |
| Create Many | POST   | `/{resource}/bulk`          | Bulk create    |
| Update      | PATCH  | `/{resource}/{id}`          | Partial update |
| Update Many | PATCH  | `/{resource}/bulk?id=1,2,3` | Bulk update    |
| Delete      | DELETE | `/{resource}/{id}`          | Delete         |
| Delete Many | DELETE | `/{resource}?id=1,2,3`      | Bulk delete    |
| Batch       | GET    | `/{resource}?id=1,2,3`      | Get by ids     |

#### Paginated List `GET /{resource}`

**Request query (1-based)**:

| Param      | Type   | Required | Description                    |
| ---------- | ------ | -------- | ------------------------------ |
| page       | number | yes      | Page number, 1-based           |
| pageSize   | number | yes      | Items per page                 |
| q          | string | no       | Keyword search                 |
| field_eq   | string | no       | Exact match, e.g. `name_eq=xx` |
| field_like | string | no       | Fuzzy match                    |
| field_gte  | string | no       | Greater than or equal          |
| field_lte  | string | no       | Less than or equal             |
| field_ne   | string | no       | Not equal                      |
| sort       | string | no       | Sort fields, comma-separated   |
| order      | string | no       | `asc` or `desc`                |

**Response** (`PageResponse<T>`):

```ts
{
  items: T[]     // Current page data
  total: number  // Total count
  page: number   // Current page, 1-based
  pageSize: number
}
```

#### Single & Mutations

- **GET /{resource}/{id}**: Response = resource object `T`
- **POST /{resource}**: Body = create payload; Response = created `T` or `{ data: T }`
- **POST /{resource}/bulk**: Body = `{ items: T[] }`; Response = created `T[]`
- **PATCH /{resource}/{id}**: Body = partial update; Response = updated `T` or `{ data: T }`
- **PATCH /{resource}/bulk?id=1,2,3**: Body = variables; Response = updated `T[]`
- **DELETE /{resource}/{id}**: Response = 204 or deleted `T`
- **DELETE /{resource}?id=1,2,3**: Response = deleted `T[]`
- **GET /{resource}?id=1,2,3**: Response = `T[]` or `PageResponse<T>`

#### Error Response

| Status  | Type         | Body Format                                               |
| ------- | ------------ | --------------------------------------------------------- |
| 401     | unauthorized | `{ message?: string }`                                    |
| 403     | forbidden    | `{ message?: string }`                                    |
| 404     | not_found    | `{ message?: string }`                                    |
| 400/422 | validation   | `{ message?: string, errors?: Record<string, string[]> }` |
| 5xx     | unknown      | `{ message?: string }`                                    |

#### Non-Resource Endpoints (custom)

Endpoints like `/me`, `/dashboard/stats` are called via `dataProvider.custom`. Response format is defined per business need.

---

### Backend Business Adaptation Rules

This section documents the **business-specific** API expectations for this RBAC template. Backend implementers must provide these endpoints and structures for full feature parity.

#### 0. Health Check — `GET /health`

**Optional but recommended.** Polled every 5 seconds to detect network/server outages. When the request fails or `status !== "UP"`, the frontend shows a global "网络异常" overlay.

**Request**: `GET {apiBaseUrl}/health`

**Response**:

```ts
{
  status: 'UP'
}
```

- Any other `status` value or request failure triggers the overlay. No auth required.

#### 1. Auth & Current User — `GET /me`

**Required.** Called after login to load identity, roles, and permissions. Used by `authProvider.getIdentity` and `getPermissions`.

**Request**: `GET {apiBaseUrl}/me` with `Authorization: Bearer {token}`

**Response** (`MeResponse`):

```ts
{
  id: string
  name: string
  email?: string
  roles: { id: string; name: string }[]
  permissions: string[]   // e.g. ["users:read", "users:write", "roles:read", ...]
}
```

- `roles`: At least `{ id, name }`. Role name `admin` or `管理员` bypasses all permission checks.
- `permissions`: Array of permission codes (see RBAC mapping below).

#### 2. Dashboard Stats — `GET /dashboard/stats`

**Optional.** Powers the dashboard page charts and stat cards.

**Request**: `GET {apiBaseUrl}/dashboard/stats`

**Response**:

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

- `statCards.labelKey`: i18n key (e.g. `dashboard.totalUsers`).
- `roleDistribution.color`: CSS color (e.g. `var(--chart-1)` or hex).

#### 3. Resource Paths & Field Schemas

| Resource          | Path                 | Key Fields                                                        |
| ----------------- | -------------------- | ----------------------------------------------------------------- |
| Users             | `/users`             | `id`, `email`, `name`, `roleIds?`, `createdAt?`                   |
| Roles             | `/roles`             | `id`, `name`, `description?`, `permissionGroupIds?`, `createdAt?` |
| Permissions       | `/permissions`       | `id`, `name`, `code`, `groupId?`, `createdAt?`                    |
| Permission Groups | `/permission-groups` | `id`, `name`, `description?`, `createdAt?`                        |

- All resources use `id: string` as primary key.
- List filters: users support `q`, `name_like`, `email_like`; others follow generic `field_eq`, `field_like`, etc. from the API spec.
- Sort: generic `sort` + `order` query params.

#### 4. Assignment APIs

The template supports three assignment flows. Backends must accept and persist these fields.

| Assignment                     | Resource     | Field                          | Update Method                                                  | Description                                |
| ------------------------------ | ------------ | ------------------------------ | -------------------------------------------------------------- | ------------------------------------------ |
| User → Roles                   | `User`       | `roleIds: string[]`            | `PATCH /users/:id`                                             | Array of role IDs the user belongs to      |
| Role → Permission Groups       | `Role`       | `permissionGroupIds: string[]` | `PATCH /roles/:id`                                             | Array of permission group IDs the role has |
| Permission Group → Permissions | `Permission` | `groupId: string \| null`      | `PATCH /permissions/:id` or `PATCH /permissions/bulk?id=1,2,3` | Single group ID; `null` means unassigned   |

**User → Roles**

- Edit page sends `{ ...userFields, roleIds: ["1", "2"] }` via `PATCH /users/:id`.
- Backend must accept `roleIds` in the update body and persist the user–role associations.

**Role → Permission Groups**

- Edit page sends `{ ...roleFields, permissionGroupIds: ["1", "2"] }` via `PATCH /roles/:id`.
- Backend must accept `permissionGroupIds` and persist the role–permission-group associations.

**Permission Group → Permissions**

- Edit page uses `PATCH /permissions/bulk?id=1,2,3` with body `{ groupId: "1" }` to assign, or `{ groupId: null }` to unassign.
- Each permission has at most one group; `groupId: null` means the permission is not in any group.

#### 5. RBAC Permission Code Mapping

Frontend maps resource+action to permission codes as follows:

| Resource          | list, show               | create, edit, delete      |
| ----------------- | ------------------------ | ------------------------- |
| users             | `users:read`             | `users:write`             |
| roles             | `roles:read`             | `roles:write`             |
| permissions       | `permissions:read`       | `permissions:write`       |
| permission-groups | `permission-groups:read` | `permission-groups:write` |

- Backend `/me` must return permission codes in this format (e.g. `users:read`, `users:write`).
- Role name `admin` or `管理员` → full access regardless of permissions.
- Unmapped resources (e.g. dashboard) default to allowed.

#### 6. Login Flow (Optional)

The template ships with a mock login (no backend call). To integrate with a real backend:

- Implement a login endpoint (e.g. `POST /auth/login`) accepting credentials and returning a JWT or session token.
- Adapt `authProvider.login` in `src/providers/auth-provider` to call that endpoint and store the token.
- The token is sent as `Authorization: Bearer {token}` on subsequent requests (including `/me`).

#### 7. Refresh Token (Cookie-Based)

When the access token expires (API returns 401), the frontend uses the refresh token to obtain a new access token and retries the failed request.

**Flow**:

1. Request returns 401 → frontend calls `POST /auth/refresh` with `credentials: 'include'` (sends httpOnly cookie).
2. Backend validates refresh token from cookie, returns new `accessToken` in JSON body.
3. Frontend updates session store and retries the original request.
4. If refresh returns 401 → logout and redirect to login.

**Concurrency**: Multiple concurrent 401s share one refresh request; all waiters get the new token and retry.

**Backend contract**:

- **Endpoint**: `POST {apiBaseUrl}/auth/refresh` (override via `VITE_AUTH_REFRESH_URL`)
- **Request**: Cookie header with refresh token (httpOnly, set by login)
- **Response 200**: `{ accessToken: string }`
- **Response 401**: Refresh token expired → frontend logs out

---

### Data Provider Specification

#### Standard Data Structures

**Pagination** (`src/types/pagination.ts`):

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

**Error** (`src/types/errors.ts`):

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

**Refine mapping**:

| Internal/Contract  | Refine API        | Notes                 |
| ------------------ | ----------------- | --------------------- |
| PageRequest        | pagination        | currentPage↔page      |
| PageResponse<T>    | GetListResponse   | items → data          |
| NormalizedApiError | axios interceptor | Attached to rejection |

#### Method Specifications

- **getList**: Paginated list; 1-based page; adapter converts PageResponse → Refine format
- **getOne**, **getMany**: Standard Refine semantics
- **create**, **createMany**: Single and bulk create
- **update**, **updateMany**: Single and bulk update
- **deleteOne**, **deleteMany**: Single and bulk delete
- **custom**: Non-resource endpoints (url, method, payload, query, headers)

#### Adapter Rules

- Request: PageRequest → `page`, `pageSize` + filters/sort per Backend API Spec
- Response: `PageResponse<T>` or `T[]` → Refine `{ data, total }`
- Transport: Shared axios, auth header, error normalization

#### Forbidden

- Direct axios calls in pages
- `page + 1` / `page - 1` in page code
- Parsing raw backend errors in pages
- Depending on backend field names in pages

---

## Mock API

MSW is used in development. Handlers simulate:

- Health check (`/health`) — returns `{ status: "UP" }`
- Login, current user (`/me`) — different users return different permissions based on login username
- Users, roles, permissions, permission-groups CRUD
- Dashboard stats (`/dashboard/stats`)
- Pagination, filtering (e.g. user list `q` search)

See `mock/` and `src/mocks/fixtures/` (including `mock-identities.ts`) for mock definitions. Mock responses follow the Backend API Spec (PageResponse, etc.).

## Docker

Build and run with nginx Alpine (gzip + brotli static compression):

```bash
pnpm docker:build
pnpm docker:run
```

App runs at http://localhost:8080

## AGENTS.md

This repo includes an [AGENTS.md](./AGENTS.md) that defines architecture, stack, and conventions for AI agents and contributors.
