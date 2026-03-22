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
├── routes/
├── types/
├── utils/
├── app.tsx
└── main.tsx
```

## Environment

All env access goes through `src/config`. Required vars:

| Variable       | Default | Description  |
| -------------- | ------- | ------------ |
| `VITE_API_URL` | `/api`  | API base URL |

## Mock API

MSW is used in development. Handlers simulate:

- Login, current user
- Users, roles, permissions, permission-groups CRUD
- Pagination, filtering (e.g. user list `q` search)

See `src/mocks/handlers` and `src/mocks/fixtures`.

## Docker

Build and run with nginx Alpine (gzip + brotli static compression):

```bash
pnpm docker:build
pnpm docker:run
```

App runs at http://localhost:8080

## AGENTS.md

This repo includes an [AGENTS.md](./AGENTS.md) that defines architecture, stack, and conventions for AI agents and contributors.
