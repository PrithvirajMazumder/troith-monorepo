# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm run dev                              # Dev server for all apps
npx nx dev troithWeb                     # Dev server for troithWeb only
npx nx build troithWeb                   # Production build
npx nx lint                              # Lint all projects
npx nx test troithWeb                    # Run Jest tests
npx nx test troithWeb --testFile=specs/index.spec.ts  # Single test file
npx nx e2e troithWeb-e2e                 # Playwright E2E tests
npx nx affected -t lint test build       # Run tasks on changed projects only
npx nx reset                             # Clear Nx cache
```

## Architecture

Nx monorepo with one Next.js 14 app and a shared component library.

### Apps & Packages

- **`apps/troithWeb`** - Next.js 14 App Router. Multi-tenant invoicing app (companies, invoices, items, parties, banks, taxes, UOMs). Uses `'use client'` selectively; default to Server Components.
- **`apps/troithWeb-e2e`** - Playwright E2E tests.
- **`shared/`** - shadcn/ui components (Radix UI primitives), typography components, hooks (`useDebounce`, `use-toast`), ThemeProvider, and `cn()` utility.

### Path Aliases

- `@troith/shared` / `@troith/shared/*` - shared library
- `@troithWeb/*` - troithWeb app root

### Data Flow

```
React Components -> React Hook Form + Yup validation
  -> TanStack React Query (useQuery/useMutation)
    -> REST API routes (app/api/*)
      -> Repository functions (repositories/*.repository.ts)
        -> Prisma -> PostgreSQL
```

### Key Patterns

- **Repository pattern**: Data access in `apps/troithWeb/repositories/`. Each entity has a `*.repository.ts` file returning an object with query methods.
- **Modular Prisma schema**: Split across `apps/troithWeb/prisma/schema/` (auth, company, invoice, item, party, bank, tax, uom, user, connection).
- **State management**: React Context for company selection (`CompanySore.tsx`), TanStack React Query for server state, localStorage for persistence.
- **Auth**: NextAuth v5 (beta) with Google OAuth, PrismaAdapter, session-based with JWT. API routes check session or Bearer token.
- **CORS**: Handled by `middleware.ts` with preflight OPTIONS support.

### Domain Model

User -> Companies -> { Invoices, Items, Parties, Banks, Taxes }
Invoice -> InvoiceItems -> Item (with UOM & Tax)
Invoice -> Party, Bank, Tax
InvoiceStatus: DRAFT | CONFIRMED | PAID | PARTIALLY_PAID | GST_SUBMITTED

## Code Style

- **Prettier**: 150 char width, 2-space indent, single quotes, no semicolons, no trailing commas
- **Imports order**: React/Next.js builtins -> external libs -> path aliases -> relative
- **Components**: PascalCase filenames. Use `cn()` from `@troith/shared/lib/util` for conditional classes.
- **Hooks**: camelCase with `use` prefix
- **Types**: Prefer `interface` over `type` for object shapes
- **Tests**: `*.spec.ts` / `*.test.ts`, Jest + React Testing Library

## Environment Variables

Required: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
