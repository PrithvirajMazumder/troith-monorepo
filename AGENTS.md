# Agent Guidelines for Troith Monorepo

## Overview

This is an Nx monorepo containing a Next.js application (`troithWeb`) and shared libraries. The codebase uses TypeScript, React (Next.js App Router), Tailwind CSS, Prisma, and shadcn/ui components.

## Project Structure

```
troith-monorepo/
├── apps/
│   ├── troithWeb/          # Next.js application (main app)
│   │   ├── app/            # Next.js App Router pages
│   │   ├── repositories/   # Data access layer (Prisma)
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── prisma/         # Prisma schema
│   └── troithWeb-e2e/      # Playwright E2E tests
├── shared/                 # Shared components & utilities
│   └── src/
│       ├── components/     # Shared UI components (shadcn/ui)
│       ├── hooks/          # Shared React hooks
│       ├── lib/            # Utilities (cn, formatting, etc.)
│       └── providers/      # React context providers
└── package.json
```

## Build Commands

```bash
# Development (runs all apps in dev mode)
npm run dev

# Lint all projects
npx nx lint

# Test all projects
npx nx test

# Build all projects
npx nx build

# Run E2E tests
npx nx e2e troithWeb-e2e

# Run affected tasks (lint, test, build on changed files)
npx nx affected -t lint test build
```

## Single Test Commands

```bash
# Test specific project
npx nx test troithWeb

# Test specific test file
npx nx test troithWeb --testFile=specs/index.spec.ts

# Run with coverage
npx nx test troithWeb --coverage
```

## Code Style Guidelines

### TypeScript

- Use explicit return types for functions, especially API routes and utility functions
- Prefer `interface` over `type` for object shapes
- Use strict null checks - check for null/undefined explicitly
- Use `unknown` when type is uncertain, then narrow with type guards

### Naming Conventions

- **Files**: Use kebab-case for files (e.g., `invoice-card.tsx`, `use-listen-key-stroke.ts`)
- **Components**: Use PascalCase (e.g., `InvoiceCard.tsx`, `CreateUomForm.tsx`)
- **Hooks**: Use camelCase with `use` prefix (e.g., `useListenKeyStroke`)
- **Functions**: Use camelCase, verb-based (e.g., `getInvoiceTotals`, `generateCompleteInvoice`)
- **Constants**: Use SCREAMING_SNAKE_CASE for enum-like values (e.g., `invoiceStatuses`)

### Import Organization

Order imports as:

1. Next.js/React built-ins
2. External libraries (npm packages)
3. Path aliases (`@troith/shared/*`, `@troithWeb/*`)
4. Relative imports

```typescript
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@troith/shared/lib/util'
import { InvoiceStatus } from '@/app/constants/invoiceStatuses'
import { formatCurrency } from '@/utils/currency'
```

### Path Aliases

Use these aliases for imports:

- `@troith/shared` - shared library root
- `@troith/shared/*` - shared library subpaths
- `@troithWeb/*` - troithWeb app root

### Formatting (Prettier)

The project uses Prettier with these settings:

- Print width: 150
- Tab width: 2
- Single quotes (`'`) for JS, double quotes (`"`) for JSX
- No semicolons
- Trailing commas: none
- Bracket spacing: true

### React/Next.js Patterns

- Use Server Components by default in `app/` directory
- Use `'use client'` directive only when needed (hooks, event handlers, state)
- Prefer TanStack Query (`@tanstack/react-query`) for data fetching
- Use React Hook Form with Zod/Yup for form validation
- Use shadcn/ui components (built on Radix UI) - check `shared/src/components/`

### Error Handling

- Use try/catch with async/await for API calls
- Display errors using toast notifications (`sonner` or similar)
- Return proper HTTP status codes in API routes (200, 400, 404, 500)
- Log errors appropriately (console.error for debugging, user-friendly messages for UI)

### Database (Prisma)

- Use Prisma for database operations
- Define schemas in `apps/troithWeb/prisma/schema`
- Repository pattern for data access (see `apps/troithWeb/repositories/`)
- Use Prisma's type-safe queries

### Tailwind CSS

- Use utility classes from Tailwind
- Use `cn()` utility from `@troith/shared/lib/util` for conditional class merging
- Follow shadcn/ui theming (base color: zinc)

### Testing

- Use Jest with React Testing Library
- Test files: `*.spec.ts` or `*.test.ts`
- Place tests alongside source files or in `specs/` directory
- Focus on unit tests for utilities and component tests for UI

### Git Conventions

- Write concise commit messages describing the "why" not "what"
- Keep PRs focused and reasonably sized
- Run `npx nx lint` and `npx nx test` before committing

## Useful Commands

```bash
# Show project targets
nx show project troithWeb --web

# Check affected projects
npx nx show projects

# Clear cache
npx nx reset
```
