# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo structure

pnpm workspaces (`pnpm-workspace.yaml`) with two packages:
- `client/` — React 19 + Vite 8 SPA
- `server/` — NestJS 10 REST API

Run `pnpm install` from the **root** to install all workspace deps.

## Commands

From the root:
```bash
pnpm dev          # start client (port 5173) and server (port 3000)
pnpm dev:client   # client only
pnpm dev:server   # server only
```

Inside `client/`:
```bash
pnpm dev      # Vite dev server with HMR
pnpm build    # production build → dist/
pnpm preview  # serve production build
pnpm lint     # ESLint
```

Inside `server/`:
```bash
pnpm start:dev    # NestJS with file-watch
pnpm build        # tsc → dist/
pnpm start:prod   # run compiled dist/main.js
pnpm lint         # ESLint
```

## Environment variables

Copy `.env.example` in each package before running:
- `client/.env.example` — `VITE_API_URL`
- `server/.env.example` — `PORT`, `CLIENT_URL` (used for CORS whitelist)

## TypeScript

Both `client/` and `server/` are fully TypeScript. The client uses a split tsconfig (`tsconfig.app.json` for `src/`, `tsconfig.node.json` for `vite.config.ts`). Run `tsc --noEmit` inside either package to type-check without building.

## Client architecture

**Structure** — domain-based. Each feature owns its own components and hooks. Truly shared UI lives in `components/`.

```
src/
├── features/<domain>/
│   ├── components/   ← components used only by this feature
│   ├── hooks/        ← TanStack Query hooks + local state hooks for this feature
│   └── <Domain>Page.tsx
├── components/
│   ├── ui/           ← generic UI primitives (Button, Input, Select, …); barrel-exported from index.ts
│   └── ProtectedRoute.tsx
└── App.tsx           ← QueryClientProvider + BrowserRouter + route definitions
```

**Routing** — React Router v7. Routes are defined directly in `App.tsx`; each feature exposes a `<Domain>Page.tsx` as its route entry point.

**Data fetching** — TanStack Query v5. `QueryClient` is created once in `App.tsx`. Hooks follow the pattern in `shared/hooks/useHealth.ts`: import raw fetch fn from `shared/api/`, wrap in `useQuery`/`useMutation`.

**API layer:**
- `shared/api/client.ts` — Axios instance pointed at `VITE_API_URL`, single response interceptor
- `shared/api/<resource>.ts` — typed fetch functions that return `res.data`

**Styling** — Tailwind v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed). `@import "tailwindcss"` is at the top of `src/index.css`.

**UI libraries** — [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Tailwind). Components live in `src/components/ui/` and are barrel-exported from `src/components/index.ts`. Add new components with `pnpm dlx shadcn@latest add <name>`. The `cn()` utility is at `src/utils/cn.ts`. Icons via `lucide-react` (installed at root).

## Server architecture

Global API prefix: `/api`. All routes are therefore `/api/<path>`.

CORS is handled by a whitelist middleware at `src/common/middleware/cors.middleware.ts` — add allowed origins to `CLIENT_URL` env var (single value today; extend the whitelist array as needed). The middleware is applied in `main.ts` before route registration.

Feature modules go under `src/<feature>/` following NestJS conventions (`module`, `controller`, `service`).

**Dependency injection naming** — injected services are named after their domain, not the full class name:
```ts
constructor(private readonly auth: AuthService) {}
constructor(private readonly users: UsersService) {}
```

**DTO vs. service input types** — DTOs (`dto/<name>.dto.ts`, class-validator decorated) exist only at the transport boundary (controllers/resolvers), where `ValidationPipe({ whitelist: true, transform: true })` validates and strips unknown fields. Service methods should **not** depend on the DTO class directly — that couples business logic to the validation layer. Instead, each feature declares plain interfaces for its service inputs in a single `<feature>.types.ts` file at the feature root:

```
src/features/<feature>/
├── dto/                     ← class-validator DTOs, used only in controller/resolver signatures
│   └── create-thing.dto.ts
├── <feature>.types.ts       ← plain interfaces consumed by the service layer
├── <feature>.service.ts
└── <feature>.controller.ts | <feature>.resolver.ts
```

The controller/resolver receives and validates the DTO, then passes it straight through to the service — DTOs are structurally compatible with the matching interface, so no explicit mapping step is needed. The service method signature depends only on the plain interface:

```ts
// create-thing.types.ts
export interface CreateThingInput {
  name: string
}

// thing.service.ts
create(input: CreateThingInput) { ... }

// thing.controller.ts
create(@Body() input: CreateThingDto) {
  return this.thing.create(input) // CreateThingDto satisfies CreateThingInput
}
```

**DTO/input parameter naming** — whether the type is a DTO (controller/resolver) or a plain input interface (service), always name the parameter `input`:
```ts
register(input: RegisterDto) {}   // controller
register(input: RegisterInput) {} // service
```

## Workflow notes

**UI verification** — do not start the dev server or drive the browser yourself to verify UI/frontend changes. The user tests changes manually and prefers to do so themselves rather than wait on it. Rely on `tsc --noEmit` and `pnpm lint` for correctness, explain what to click/check, and let the user confirm behavior.

## Client code style

**Functions** — prefer arrow functions over `function` declarations in client code:
```ts
const handleSubmit = () => { ... }
const MyComponent = () => { ... }
```

**Border radius** — use `rounded-sm` or `rounded-md` for components (buttons, inputs, cards, list items, badges, dropdowns, etc.). Reserve `rounded-lg` (and larger) for large surfaces like modals/dialogs. Don't use `rounded-lg` on small components.

**Formatting utilities** — reuse the existing helpers in `src/utils/` (`date.ts`: `dayjsLocal`, `formatDate`, `formatTime`, `formatRange`, etc.; `number.ts`: `formatNumber`, `formatCurrency`; `text.ts`) instead of calling `dayjs`/`dayjs.tz` directly in components or writing a new one-off formatting function inline. If no existing helper covers the case, add one to the relevant `src/utils/` file rather than duplicating the logic locally.
