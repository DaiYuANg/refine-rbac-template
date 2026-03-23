# RBAC Template

[中文](./README.zh-CN.md) | English

A frontend RBAC (Role-Based Access Control) template built with **Refine**, **React**, **TypeScript**, and **shadcn/ui**. Backend-agnostic, runs locally with MSW mock APIs out of the box.

## Features

- **Users, Roles, Permissions, Permission Groups** — full CRUD (list, create, edit, show)
- **shadcn/ui** — forms with React Hook Form, zod validation
- **i18n** — English & 中文
- **Dashboard** — stats cards, charts (Recharts)
- **MSW** — mock API for local dev without backend
- **Vite 8** — route code-splitting, vendor chunks, dev-only plugins

## Tech Stack

| Layer     | Stack                                     |
| --------- | ----------------------------------------- |
| Framework | Refine, React 19                          |
| UI        | shadcn/ui, Radix UI, Tailwind CSS         |
| Data      | TanStack React Query, axios               |
| State     | zustand (client), React Query (server)    |
| Forms     | react-hook-form, zod, @hookform/resolvers |
| Mock API  | MSW                                       |
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

Runs the app with MSW mock API. Login with any username (e.g. `demo`).

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

## Scripts

| Command             | Description               |
| ------------------- | ------------------------- |
| `pnpm dev`          | Start dev server with MSW |
| `pnpm build`        | Production build          |
| `pnpm preview`      | Preview production build  |
| `pnpm lint`         | Run ESLint                |
| `pnpm lint:fix`     | Run ESLint with auto-fix  |
| `pnpm format`       | Format with Prettier      |
| `pnpm typecheck`    | TypeScript check          |
| `pnpm docker:build` | Build Docker image        |
| `pnpm docker:run`   | Run container (port 8080) |

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui primitives
│   ├── shared/       # Shared business components
│   └── refine-ui/    # Refine + shadcn integration
├── config/           # Typed env (apiBaseUrl, isDev, …)
├── constants/        # Routes, resources
├── features/         # Domain modules (auth, rbac, users, roles)
├── hooks/
├── mocks/            # MSW handlers, fixtures
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

| Variable        | Default | Description                   |
| --------------- | ------- | ----------------------------- |
| `VITE_API_URL`  | `/api`  | API base URL                  |
| `VITE_USE_MOCK` | (dev)   | `true` to enable MSW in build |

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

- Login, current user (`/me`)
- Users, roles, permissions, permission-groups CRUD
- Dashboard stats (`/dashboard/stats`)
- Pagination, filtering (e.g. user list `q` search)

See `src/mocks/handlers` and `src/mocks/fixtures`. Mock responses follow the Backend API Spec (PageResponse, etc.).

## Docker

Build and run with nginx Alpine (gzip + brotli static compression):

```bash
pnpm docker:build
pnpm docker:run
```

App runs at http://localhost:8080

## AGENTS.md

This repo includes an [AGENTS.md](./AGENTS.md) that defines architecture, stack, and conventions for AI agents and contributors.
