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

| 命令             | 说明                   |
| ---------------- | ---------------------- |
| `pnpm dev`       | 启动开发服务（含 MSW） |
| `pnpm build`     | 生产构建               |
| `pnpm preview`   | 预览生产构建           |
| `pnpm lint`      | 运行 ESLint            |
| `pnpm lint:fix`  | ESLint 自动修复        |
| `pnpm format`    | Prettier 格式化        |
| `pnpm typecheck` | TypeScript 检查        |
| `pnpm docker:build` | 构建 Docker 镜像   |
| `pnpm docker:run` | 运行容器（端口 8080）  |

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
├── routes/
├── types/
├── utils/
├── app.tsx
└── main.tsx
```

## 环境变量

所有环境变量通过 `src/config` 统一访问：

| 变量           | 默认值 | 说明       |
| -------------- | ------ | ---------- |
| `VITE_API_URL` | `/api` | API 根路径 |

## Mock API

开发环境使用 MSW，模拟接口包括：

- 登录、当前用户
- 用户、角色、权限、权限组 CRUD
- 分页、筛选（如用户列表 `q` 搜索）

详见 `src/mocks/handlers` 和 `src/mocks/fixtures`。

## Docker

基于 nginx Alpine 构建并运行（支持 gzip + brotli 预压缩）：

```bash
pnpm docker:build
pnpm docker:run
```

应用运行于 http://localhost:8080

## AGENTS.md

项目包含 [AGENTS.md](./AGENTS.md)，定义了架构、技术栈和约定，供 AI 助手与贡献者参考。
