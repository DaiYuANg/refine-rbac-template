# AGENTS.md

## Project

This repository is an RBAC frontend template built with:

- Refine
- React
- TypeScript only
- shadcn/ui
- axios
- TanStack React Query
- zustand
- pnpm

The project must remain backend-agnostic.
Local development must support a mock API environment when a real backend is unavailable.

---

## Mandatory Stack

Agents must use and preserve the following stack choices:

- Package manager: pnpm only
- Language: TypeScript only
- App framework: refine
- UI components: shadcn/ui
- HTTP client: axios
- Server state: @tanstack/react-query
- Client state: zustand
- Mock API solution: MSW
- Code quality tools: eslint, prettier, husky, lint-staged

Do not replace these with alternatives unless explicitly instructed.

---

## Package Manager Rules

This repository uses **pnpm only**.

- Always use `pnpm` for install, scripts, exec, and tooling.
- Do not use `npm`.
- Do not use `yarn`.
- Do not introduce lockfiles other than `pnpm-lock.yaml`.
- Prefer `pnpm dlx` over `npx` when appropriate.

When generating setup steps, scripts, or documentation, always output `pnpm` commands.

---

## Core Architecture Rules

- Pages are for composition only.
- All business requests must go through the refine data provider.
- Raw HTTP requests must not be placed in page components or feature components.
- Server state belongs to React Query.
- Client/app state belongs to zustand.
- RBAC logic must be centralized, typed, and reusable.
- The project must remain runnable with mock APIs during iteration.
- Backend-specific differences must be handled in adapters, not in business pages.
- Prefer reuse over reinvention across UI, data flow, and framework integration.

---

## Refine-First Rules

Refine is a core architectural choice in this repository.
If refine already provides a suitable capability, agents should prefer using refine instead of building a parallel implementation.

### Mandatory rules

1. Prefer refine-native patterns for resource pages, data hooks, auth integration, access control integration, notifications, and routing-related flows.
2. Do not build a parallel page-level data flow when refine already provides an appropriate flow.
3. Prefer refine resource conventions and provider-based integration before introducing custom orchestration in pages.
4. If refine default behavior conflicts with project rules, fix or adapt it in the integration, provider, or adapter layer.
5. Business pages must not bypass refine conventions just for local convenience.

### Forbidden

- rebuilding list, form, resource, or mutation flows that refine already handles well
- bypassing refine because writing direct React code feels simpler
- scattering refine integration details into page components
- keeping refine in the stack only nominally while replacing its core usage patterns with custom code

---

## Component Reuse Rules

This repository uses **shadcn/ui** as the primary UI foundation.

## shadcn/ui and Refine Integration Component Modification Rules

This project should avoid modifying original `shadcn/ui` components and components provided by the `refine` + `shadcn/ui` integration layer whenever possible.

### Mandatory rules

1. Prefer composition, wrappers, configuration, slots, and style overrides to satisfy business requirements.
2. Only modify component implementations when the requirement cannot be solved in a non-intrusive way.
3. Before modifying such components, confirm that:
    - the problem cannot be solved with a wrapper
    - the problem cannot be solved through props or configuration
    - the problem cannot be solved through `className`, `variant`, or composition
4. Modifications to original `shadcn/ui` components must be treated as a last resort, not a normal development approach.
5. Modifications to components from the `refine` + `shadcn/ui` integration layer must also be treated as a last resort. Prefer solving such issues in the project’s own adapter or wrapper layer.
6. If behavior must be adjusted, prefer introducing an intermediate business-side component instead of directly changing upstream base components.
7. Such modifications must have a clear and explicit reason, for example:
    - a real functional limitation or defect
    - a type limitation that cannot be solved through composition
    - a clear accessibility issue
    - a project-wide behavior requirement that cannot be implemented through wrapping
8. Any modification to `shadcn/ui` components or refine integration components must be documented in code comments or project documentation, including:
    - why the modification was needed
    - what the impact scope is
    - why alternative approaches were not sufficient

### Forbidden

- directly modifying `shadcn/ui` base components for a page-local requirement
- changing base component source code just to avoid writing a wrapper
- modifying refine integration components without strong justification
- putting business logic, permission logic, or request logic into base UI components or integration components
- pushing business-layer problems down into foundational component changes


### Preferred direction

- prefer wrapper components
- prefer composition
- prefer feature-level adapters
- prefer style overrides over source changes
- prefer project-local extensions over upstream modification
---

## Data Provider Rules

All application requests must go through the **Refine data provider**.

### Mandatory rules

1. Standard resource operations must use regular data provider methods such as:
    - `getList`
    - `getOne`
    - `create`
    - `update`
    - `deleteOne`
    - other standard refine resource methods where applicable
2. Non-standard or non-resource-oriented endpoints must still go through the data provider.
3. These special requests must use `dataProvider.custom`.
4. Pages, components, and feature modules must not call axios directly for business requests.
5. Shared axios configuration is allowed only as the transport foundation used by the data provider implementation.

### Required direction

- Use one shared axios instance underneath the data provider.
- Centralize interceptors, auth headers, timeout settings, and error normalization.
- Keep request and response DTOs typed.
- Keep backend-specific request/response shape adaptation inside the data provider or adapter layer.

### Forbidden

- direct axios calls in pages
- direct axios calls in feature-level business hooks when they should be routed through refine
- bypassing data provider because an endpoint is “special”
- mixing raw transport logic into UI components

---

## Pagination Rules

This project uses **1-based pagination**.

### Mandatory rules

1. Frontend request parameter `page` always starts from **1**.
2. Pagination request parameters must stay consistent with backend contracts.
3. Business pages must not implement 0-based / 1-based conversion.
4. If a third-party component uses 0-based pagination, convert it only in an adapter or integration layer.
5. Do not expose pagination base differences to page components.

### Standard contract

~~~ts
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
~~~

If backend payloads differ, adapt them in the data provider or adapter layer.

### Forbidden

- writing `page + 1` or `page - 1` directly in page code
- handling pagination base conversion in refine pages
- mixing pagination rules across business modules

---

## Mock Rules

This repository uses **MSW** as the default mock solution.

### Mandatory rules

1. Local development must support running the application against mock APIs.
2. Mock handlers must simulate real HTTP behavior instead of bypassing the request layer.
3. Mock payloads should match typed DTO contracts as closely as possible.
4. New pages and new features should remain runnable with mock APIs when the real backend is unavailable.
5. Mocking must work with the same data access flow used by the real application.

### Required direction

- Organize mock handlers by domain or feature.
- Reuse the same request/response contract types used by the application.
- Cover at least:
    - login / current user
    - role / permission loading
    - paginated list pages
    - create / update / delete flows where relevant
    - common error scenarios

### Forbidden

- hardcoding demo data directly in page JSX
- bypassing refine data hooks just because backend is not ready
- creating a separate mock-only data access style
- letting mock payloads drift away from real DTOs without explicit adapters

---

## Environment and Configuration Rules

All environment-specific behavior must be centralized and typed.

### Mandatory rules

1. Environment variables must be accessed through a single typed config module.
2. Page components and feature components must not read `import.meta.env` directly.
3. API base URL, mock switches, timeout values, and feature flags must be defined in centralized config.
4. Missing required environment variables must fail fast during app startup.
5. Mock mode and real backend mode should use the same application composition entry whenever possible.

### Forbidden

- reading `import.meta.env` in pages or feature components
- scattering base URLs or feature flags across the codebase
- using string literals for environment-dependent behavior in business modules
- silently accepting missing critical configuration

---

## Error Handling Rules

Error handling must be centralized, typed, and consistent across real and mock flows.

### Mandatory rules

1. Transport errors must be normalized in the shared axios layer or provider layer.
2. Business pages must not implement ad hoc backend error parsing.
3. User-facing error messages must follow a consistent strategy.
4. Permission errors, authentication errors, validation errors, and unknown errors should be distinguishable in typed form.
5. Mock APIs must also return structured error responses compatible with the same error handling flow.

### Forbidden

- parsing random backend error fields directly inside pages
- displaying raw server error payloads to users without normalization
- duplicating unauthorized handling logic across many components
- letting mock error shapes differ arbitrarily from real API contracts

---

## Auth Session Rules

Authentication and session lifecycle behavior must remain centralized.

### Mandatory rules

1. Token storage strategy must be consistent across the application.
2. Session restore and refresh flows must be implemented centrally.
3. Pages and feature components must not manipulate tokens directly.
4. Current user loading, permission loading, and session state restoration must follow a predictable shared flow.
5. Unauthorized handling must not be duplicated across business pages.

### Forbidden

- storing auth state inconsistently across local storage, page state, and arbitrary modules
- placing refresh-token logic in page code
- manually redirecting on 401 from unrelated business components
- coupling page UI directly to raw backend auth payloads

---

## List, Table, and Filter Rules

List pages are a core pattern in this repository and must follow consistent structure.

### Mandatory rules

1. Pagination, sorting, and filtering must follow shared project conventions.
2. Business pages must not invent local parameter naming for list queries.
3. List-related query state should be predictable and organized consistently.
4. Table column definitions should be extracted when they become non-trivial or reused.
5. Reset, refresh, and bulk-action behavior should follow reusable patterns.

### Forbidden

- mixing pagination, sorting, and filter transformations directly into JSX
- ad hoc parameter names for similar list pages
- duplicating list mechanics across many pages without abstraction
- keeping complex table definitions inline when they should be extracted

---

## API Boundary and Adapter Rules

This project must remain backend-agnostic, so API contracts and UI models must not be mixed carelessly.

### Mandatory rules

1. Backend-specific payload differences must be absorbed in provider or adapter layers.
2. Business pages should depend on stable frontend-facing models whenever practical.
3. Raw backend response shapes must not spread uncontrolled through the component tree.
4. DTOs, domain-facing types, and UI-facing mapping logic must remain explicit.
5. Pagination, enum, permission, and error shape adaptation should happen at the boundary layer.

### Forbidden

- coupling page code directly to arbitrary backend response structures
- leaking backend-specific field naming conventions into broad UI logic
- mixing transport DTOs and presentation state without intent
- spreading one backend framework’s response style across the application

---

## API and Query Rules

- Use a shared axios instance under the data provider.
- Use typed DTOs for request and response contracts.
- Keep query keys stable and predictable.
- Mutations must update or invalidate cache intentionally.
- Keep API-facing logic centralized and reusable.

### Do not

- place raw axios calls in page components
- store server-fetched list data in zustand
- let mock-only response shapes drift away from actual DTO contracts

---

## RBAC and Access Rules

This template is RBAC-oriented.

### Mandatory rules

1. Roles, permissions, and access decisions must be modeled explicitly.
2. Route guard, menu visibility, action visibility, and resource access must derive from shared permission logic.
3. Permission parsing and evaluation should be centralized.
4. Route access, menu visibility, and page-level action visibility must come from the same permission model.
5. Use reusable typed helpers or hooks for access checks.
6. Unauthorized behavior must be consistent across routes and protected actions.

### Forbidden

- scattering role string checks across unrelated components
- coupling page code directly to raw backend permission payloads
- duplicating permission decision logic in many places
- separate permission logic for routes, menus, and buttons without a shared source of truth
- manually duplicating access decisions across features

---

## Refine Integration Rules

- Keep refine-specific integration modular.
- Encapsulate auth provider, access control provider, notification provider, router bindings, and data provider wiring.
- If refine defaults conflict with project rules, resolve it in the integration or adapter layer.

### Critical rules

1. If refine or a related component uses 0-based pagination or another conflicting convention, fix it in the data provider or adapter layer.
2. Never leak refine-specific pagination semantics into page components.
3. Business requests must be expressed through refine data flows.

---

## UI Rules

- Use shadcn/ui as the primary component foundation.
- Prefer composition over introducing additional large UI frameworks.
- Separate generic UI primitives from business/domain components.
- Extract stable reusable patterns for forms, tables, dialogs, and filters.

### Do not

- place API request logic inside presentational components
- place permission logic deep inside generic UI components unless they are explicit permission-aware wrappers

---

## Form Rules

Forms must follow reusable patterns and must not become ad hoc per-page implementations.

### Mandatory rules

1. Form value shape must be explicit and typed.
2. Validation rules must be centralized or at least co-located predictably.
3. Create and edit flows should reuse shared form patterns whenever practical.
4. Submission, loading, disabled, and error feedback states must behave consistently.
5. Form components must not perform raw business transport calls directly.

### Forbidden

- duplicating nearly identical create/edit forms without reason
- hiding validation rules in scattered inline logic
- mixing transport details directly into field components
- inventing page-local submission behavior for common cases

---

## TypeScript Rules

- Use TypeScript only.
- Avoid `any`.
- Prefer explicit DTOs, domain types, and helper types.
- Keep shared utility function signatures explicit.
- Validate unknown backend data at boundaries if needed.

Do not introduce plain JavaScript files for application logic.

---

## Dependency Governance Rules

Dependencies must be introduced conservatively.

### Mandatory rules

1. Prefer existing stack capabilities before adding new libraries.
2. New dependencies must be justified by meaningful value, not convenience alone.
3. Small or isolated utility needs should not automatically introduce a new package.
4. Dependencies overlapping with existing stack responsibilities should generally be avoided.
5. New packages should have acceptable maintenance quality, TypeScript support, and ecosystem reliability.

### Forbidden

- adding libraries that duplicate capabilities already present in the stack
- adding heavy packages for trivial functionality
- introducing multiple competing solutions for the same concern
- treating package installation as the default solution to every missing helper

---

## Code Quality Rules

This repository must be configured with:

- eslint
- prettier
- husky
- lint-staged

### Mandatory rules

1. Agents should configure linting and formatting during project setup.
2. Pre-commit checks must run automatically through husky.
3. Staged files should be checked with lint-staged.
4. Formatting and linting should be automated rather than left to manual discipline.

### Forbidden

- leaving formatting rules informal
- relying only on IDE formatting
- skipping pre-commit quality gates in generated project setup
- introducing multiple competing formatting tools

---

## Suggested Default Scripts

Agents should prefer scripts similar to:

- `pnpm dev`
- `pnpm build`
- `pnpm preview`
- `pnpm lint`
- `pnpm lint:fix`
- `pnpm format`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm mock`
- `pnpm prepare`

If test tooling is introduced, keep it compatible with the rest of the stack and pnpm workflow.

---

## Suggested Directory Style

Follow a directory style close to common Refine application structure, while keeping a dedicated `providers/` directory for Refine-related providers.

~~~text
src/
  components/
    ui/
    shared/
  pages/
  routes/
  providers/
    auth-provider/
    access-control-provider/
    data-provider/
    notification-provider/
    live-provider/
  hooks/
  contexts/
  stores/
  utils/
  types/
  constants/
  config/
  features/
    auth/
    rbac/
    users/
    roles/
  mocks/
    handlers/
    fixtures/
    browser.ts
  app.tsx
  main.tsx
~~~

### Directory notes

- `providers/` stores all Refine-related providers and provider adapters.
- `pages/` stores page-level composition.
- `routes/` stores route definitions if routing is split from page components.
- `features/` stores domain-specific modules such as auth, users, roles, and RBAC logic.
- `components/ui/` stores shadcn/ui primitives or wrappers.
- `components/shared/` stores reusable business-level shared components.
- `stores/` stores zustand state.
- `mocks/` stores MSW handlers, fixtures, and setup files.
- `config/` stores typed environment and runtime configuration modules.

---

## When Adding a New Page

Agents should usually:

1. define or update typed DTOs
2. implement or update the data provider path
3. use standard refine data methods or `custom` when needed
4. add or update React Query or refine data hooks
5. add or update mock handlers
6. add or update permission checks
7. build UI using shadcn/ui-based components
8. keep pagination conversion out of the page layer
9. align list, filter, and form behavior with shared project patterns
10. avoid bypassing refine or the provider layer for convenience

---

## Forbidden Shortcuts

Agents must not:

- use npm or yarn
- generate npm or yarn commands in docs
- place raw axios calls in pages
- bypass refine data provider
- bypass data provider for special endpoints
- convert pagination base in business pages
- store server list data in zustand
- hardcode mock data directly in page JSX
- bind the app to one backend framework response style
- bypass typed contracts for convenience
- recreate UI primitives already well-covered by shadcn/ui without strong reason
- bypass refine-native flows when refine already provides a suitable solution