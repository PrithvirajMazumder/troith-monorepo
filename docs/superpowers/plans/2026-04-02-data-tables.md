# Data Tables Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace card-based list pages with full-featured TanStack React Table + shadcn Table for Items, Banks, Taxes, UOMs, and Companies. Add server-side search, sorting, pagination, and column visibility. Wire up Parties search (card layout stays).

**Architecture:** Reusable `DataTable` component built on TanStack React Table + shadcn Table primitives. Each entity defines its own column config. Backend APIs updated to support `search`, `page`, `limit`, `sortBy`, `sortOrder` query params with Prisma. URL-based state management via `useSearchParams`.

**Tech Stack:** Next.js 14 App Router, TanStack React Table, TanStack React Query, shadcn/ui, Prisma, Tailwind CSS

---

## File Structure

### New Files

```
shared/src/components/ui/table.tsx                              -- shadcn Table primitives
apps/troithWeb/app/tool/components/data-table/data-table.tsx    -- Main reusable DataTable
apps/troithWeb/app/tool/components/data-table/data-table-pagination.tsx
apps/troithWeb/app/tool/components/data-table/data-table-toolbar.tsx
apps/troithWeb/app/tool/components/data-table/data-table-column-header.tsx
apps/troithWeb/app/tool/items/(list)/columns.tsx                -- Item column defs
apps/troithWeb/app/tool/banks/(list)/columns.tsx                -- Bank column defs
apps/troithWeb/app/tool/taxes/(list)/columns.tsx                -- Tax column defs
apps/troithWeb/app/tool/uoms/(list)/columns.tsx                 -- UOM column defs
apps/troithWeb/app/tool/companies/(list)/layout.tsx
apps/troithWeb/app/tool/companies/(list)/page.tsx
apps/troithWeb/app/tool/companies/(list)/default.tsx
apps/troithWeb/app/tool/companies/(list)/columns.tsx
apps/troithWeb/app/tool/companies/(list)/@company/default.tsx
apps/troithWeb/app/tool/queryKeys/companies.ts
```

### Modified Files

```
shared/src/components/ui/index.ts                               -- Add table export
package.json                                                    -- Add @tanstack/react-table
apps/troithWeb/repositories/item.repository.ts                  -- Add findWithFilters()
apps/troithWeb/repositories/bank.repository.ts                  -- Add findWithFilters()
apps/troithWeb/repositories/tax.repository.ts                   -- Add findWithFilters()
apps/troithWeb/repositories/uom.repository.ts                   -- Add findWithFilters()
apps/troithWeb/repositories/company.repository.ts               -- Add findWithFilters()
apps/troithWeb/repositories/party.repository.ts                 -- Add findWithSearch()
apps/troithWeb/app/api/items/company/[slug]/route.ts            -- Add filter params
apps/troithWeb/app/api/banks/user/[slug]/route.ts               -- Add filter params
apps/troithWeb/app/api/taxes/company/[slug]/route.ts            -- Add filter params
apps/troithWeb/app/api/uoms/company/[slug]/route.ts             -- Add filter params
apps/troithWeb/app/api/companies/[userId]/route.ts              -- Add filter params
apps/troithWeb/app/api/parties/company/[slug]/route.ts          -- Add search param
apps/troithWeb/app/tool/queryKeys/items.ts                      -- Add filter params
apps/troithWeb/app/tool/queryKeys/banks.ts                      -- Add filter params
apps/troithWeb/app/tool/queryKeys/taxes.ts                      -- Add filter params
apps/troithWeb/app/tool/queryKeys/uomKeys.ts                    -- Add filter params
apps/troithWeb/app/tool/queryKeys/parties.ts                    -- Add filter params
apps/troithWeb/app/tool/items/(list)/page.tsx                   -- Replace cards with DataTable
apps/troithWeb/app/tool/items/(list)/layout.tsx                 -- Simplify (remove search input)
apps/troithWeb/app/tool/banks/(list)/page.tsx                   -- Replace cards with DataTable
apps/troithWeb/app/tool/banks/(list)/layout.tsx                 -- Simplify
apps/troithWeb/app/tool/taxes/(list)/page.tsx                   -- Replace cards with DataTable
apps/troithWeb/app/tool/taxes/(list)/layout.tsx                 -- Simplify
apps/troithWeb/app/tool/uoms/(list)/page.tsx                    -- Replace cards with DataTable
apps/troithWeb/app/tool/uoms/(list)/layout.tsx                  -- Simplify
apps/troithWeb/app/tool/parties/(list)/page.tsx                 -- Add search filtering
apps/troithWeb/app/tool/parties/(list)/layout.tsx               -- Wire up search input
```

---

## Task 1: Install @tanstack/react-table and add shadcn Table component

**Files:**
- Modify: `package.json`
- Create: `shared/src/components/ui/table.tsx`
- Modify: `shared/src/components/ui/index.ts`

- [ ] **Step 1: Install @tanstack/react-table**

```bash
npm install @tanstack/react-table
```

- [ ] **Step 2: Create shadcn Table component**

Create `shared/src/components/ui/table.tsx`:

```tsx
import * as React from 'react'
import { cn } from '../../lib/util'

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
))
Table.displayName = 'Table'

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
)
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
)
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)} {...props} />
  )
)
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)} {...props} />
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn('h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  )
)
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn('px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props} />
  )
)
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
)
TableCaption.displayName = 'TableCaption'

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
```

- [ ] **Step 3: Export Table from shared UI index**

Add to `shared/src/components/ui/index.ts`:

```ts
export * from './table'
```

- [ ] **Step 4: Verify build compiles**

```bash
npx nx build troithWeb --skip-nx-cache
```

- [ ] **Step 5: Commit**

```bash
git add shared/src/components/ui/table.tsx shared/src/components/ui/index.ts package.json package-lock.json
git commit -m "feat: add shadcn Table component and @tanstack/react-table dependency"
```

---

## Task 2: Create reusable DataTable components

**Files:**
- Create: `apps/troithWeb/app/tool/components/data-table/data-table-column-header.tsx`
- Create: `apps/troithWeb/app/tool/components/data-table/data-table-toolbar.tsx`
- Create: `apps/troithWeb/app/tool/components/data-table/data-table-pagination.tsx`
- Create: `apps/troithWeb/app/tool/components/data-table/data-table.tsx`

- [ ] **Step 1: Create DataTable column header**

Create `apps/troithWeb/app/tool/components/data-table/data-table-column-header.tsx`:

```tsx
'use client'
import { Column } from '@tanstack/react-table'
import { cn } from '@troith/shared/lib/util'
import { Button } from '@troith/shared'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  onSortChange,
  sortBy,
  sortOrder
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  const isActive = sortBy === column.id
  const nextOrder = isActive && sortOrder === 'asc' ? 'desc' : 'asc'

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => onSortChange?.(column.id, nextOrder)}
      >
        <span>{title}</span>
        {isActive ? (
          sortOrder === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUp className="ml-2 h-4 w-4" />
          )
        ) : (
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Create DataTable toolbar**

Create `apps/troithWeb/app/tool/components/data-table/data-table-toolbar.tsx`:

```tsx
'use client'
import { Table } from '@tanstack/react-table'
import { Input, Button, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Checkbox, DropdownMenuItem } from '@troith/shared'
import { Settings2 } from 'lucide-react'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
}

export function DataTableToolbar<TData>({ table, searchValue, onSearchChange, searchPlaceholder }: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <Input
        placeholder={searchPlaceholder ?? 'Search...'}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-8 w-full max-w-sm shadow-sm"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto h-8">
            <Settings2 className="mr-2 h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuItem
                key={column.id}
                className="capitalize gap-2"
                onSelect={(e) => {
                  e.preventDefault()
                  column.toggleVisibility(!column.getIsVisible())
                }}
              >
                <Checkbox checked={column.getIsVisible()} className="pointer-events-none" />
                {column.id}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
```

- [ ] **Step 3: Create DataTable pagination**

Create `apps/troithWeb/app/tool/components/data-table/data-table-pagination.tsx`:

```tsx
'use client'
import { Button } from '@troith/shared'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DataTablePaginationProps {
  page: number
  limit: number
  total: number
  onPageChange: (page: number) => void
}

export function DataTablePagination({ page, limit, total, onPageChange }: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <span className="text-xs text-muted-foreground">
        {total === 0 ? 'No results' : `Showing ${start}-${end} of ${total}`}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-7 w-7" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button variant="outline" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create main DataTable component**

Create `apps/troithWeb/app/tool/components/data-table/data-table.tsx`:

```tsx
'use client'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, VisibilityState } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@troith/shared'
import { useState } from 'react'
import { DataTableToolbar } from './data-table-toolbar'
import { DataTablePagination } from './data-table-pagination'
import { cn } from '@troith/shared/lib/util'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  total: number
  page: number
  limit: number
  isLoading: boolean
  searchValue: string
  onPageChange: (page: number) => void
  onSearchChange: (search: string) => void
  onRowClick?: (row: TData) => void
  activeRowId?: string
  searchPlaceholder?: string
}

function DataTableSkeleton({ columnCount }: { columnCount: number }) {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={`skeleton-${i}`}>
      {Array.from({ length: columnCount }).map((_, j) => (
        <TableCell key={`skeleton-cell-${i}-${j}`}>
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
        </TableCell>
      ))}
    </TableRow>
  ))
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  total,
  page,
  limit,
  isLoading,
  searchValue,
  onPageChange,
  onSearchChange,
  onRowClick,
  activeRowId,
  searchPlaceholder
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnVisibility },
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(total / limit)
  })

  return (
    <div className="flex flex-col h-full">
      <DataTableToolbar table={table} searchValue={searchValue} onSearchChange={onSearchChange} searchPlaceholder={searchPlaceholder} />
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <DataTableSkeleton columnCount={columns.length} />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.original.id === activeRowId ? 'selected' : undefined}
                  className={cn('cursor-pointer', row.original.id === activeRowId && 'bg-muted')}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!isLoading && total > 0 && <DataTablePagination page={page} limit={limit} total={total} onPageChange={onPageChange} />}
    </div>
  )
}
```

- [ ] **Step 5: Verify build compiles**

```bash
npx nx build troithWeb --skip-nx-cache
```

- [ ] **Step 6: Commit**

```bash
git add apps/troithWeb/app/tool/components/data-table/
git commit -m "feat: add reusable DataTable components with pagination, toolbar, and column headers"
```

---

## Task 3: Update repositories with findWithFilters()

**Files:**
- Modify: `apps/troithWeb/repositories/item.repository.ts`
- Modify: `apps/troithWeb/repositories/bank.repository.ts`
- Modify: `apps/troithWeb/repositories/tax.repository.ts`
- Modify: `apps/troithWeb/repositories/uom.repository.ts`
- Modify: `apps/troithWeb/repositories/company.repository.ts`
- Modify: `apps/troithWeb/repositories/party.repository.ts`

- [ ] **Step 1: Update item.repository.ts**

Add `findWithFilters` method after the existing `findByCompanyId` method in `apps/troithWeb/repositories/item.repository.ts`:

```typescript
import { Prisma } from '@prisma/client'
import { prisma } from '@troithWeb/prisma'

export const ItemRepository = () => {
  return {
    create: (item: Prisma.Args<typeof prisma.item, 'create'>['data']) => {
      return prisma.item.create({ data: item })
    },
    findByCompanyId: (companyId: string) => {
      return prisma.item.findMany({
        where: { companyId },
        include: {
          uom: true,
          tax: true,
        }
      })
    },
    findWithFilters: async ({
      companyId,
      search,
      page,
      limit,
      sortBy = 'name',
      sortOrder = 'asc'
    }: {
      companyId: string
      search?: string
      page: number
      limit: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }) => {
      const where: Prisma.ItemWhereInput = { companyId, deletedAt: null }

      if (search && search.trim().length > 0) {
        const searchTerm = search.trim()
        const orConditions: Prisma.ItemWhereInput[] = [
          { name: { contains: searchTerm, mode: 'insensitive' } }
        ]
        const parsedHsn = parseInt(searchTerm, 10)
        if (!isNaN(parsedHsn)) {
          orConditions.push({ hsn: parsedHsn })
        }
        where.OR = orConditions
      }

      const [data, total] = await Promise.all([
        prisma.item.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: { uom: true, tax: true }
        }),
        prisma.item.count({ where })
      ])

      return { data, total }
    }
  }
}
```

- [ ] **Step 2: Update bank.repository.ts**

Replace entire file `apps/troithWeb/repositories/bank.repository.ts`:

```typescript
import { Prisma } from '@prisma/client'
import { prisma } from '@troithWeb/prisma'

export const BankRepository = () => {
  return {
    create: (bank: Prisma.Args<typeof prisma.bank, 'create'>['data']) => {
      return prisma.bank.create({ data: bank })
    },
    findByUserId: (userId: string) => {
      return prisma.bank.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc'
        }
      })
    },
    findWithFilters: async ({
      userId,
      search,
      page,
      limit,
      sortBy = 'name',
      sortOrder = 'asc'
    }: {
      userId: string
      search?: string
      page: number
      limit: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }) => {
      const where: Prisma.BankWhereInput = { userId, deletedAt: null }

      if (search && search.trim().length > 0) {
        const searchTerm = search.trim()
        where.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { ifsc: { contains: searchTerm, mode: 'insensitive' } },
          { branch: { contains: searchTerm, mode: 'insensitive' } },
          { holderName: { contains: searchTerm, mode: 'insensitive' } }
        ]
      }

      const [data, total] = await Promise.all([
        prisma.bank.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder }
        }),
        prisma.bank.count({ where })
      ])

      return { data, total }
    }
  }
}
```

- [ ] **Step 3: Update tax.repository.ts**

Replace entire file `apps/troithWeb/repositories/tax.repository.ts`:

```typescript
import { Prisma } from '@prisma/client'
import { prisma } from '@troithWeb/prisma'

export const TaxRepository = () => {
  return {
    create: (tax: Prisma.Args<typeof prisma.tax, 'create'>['data']) => {
      return prisma.tax.create({
        data: tax
      })
    },
    findByCompanyId: (companyId: string) => {
      return prisma.tax.findMany({
        where: {
          companyId: companyId
        }
      })
    },
    findWithFilters: async ({
      companyId,
      search,
      page,
      limit,
      sortBy = 'cgst',
      sortOrder = 'asc'
    }: {
      companyId: string
      search?: string
      page: number
      limit: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }) => {
      const where: Prisma.TaxWhereInput = { companyId, deletedAt: null }

      if (search && search.trim().length > 0) {
        const parsed = parseInt(search.trim(), 10)
        if (!isNaN(parsed)) {
          where.OR = [{ cgst: parsed }, { sgst: parsed }]
        }
      }

      const [data, total] = await Promise.all([
        prisma.tax.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder }
        }),
        prisma.tax.count({ where })
      ])

      return { data, total }
    }
  }
}
```

- [ ] **Step 4: Update uom.repository.ts**

Replace entire file `apps/troithWeb/repositories/uom.repository.ts`:

```typescript
import { Prisma } from '@prisma/client'
import { prisma } from '@troithWeb/prisma'

export const UomRepository = () => {
  return {
    create: (uom: Prisma.Args<typeof prisma.uom, 'create'>['data']) => {
      return prisma.uom.create({ data: uom })
    },
    findByUserId: (userId: string) =>
      prisma.uom.findMany({
        where: {
          userId
        }
      }),
    findWithFilters: async ({
      userId,
      search,
      page,
      limit,
      sortBy = 'name',
      sortOrder = 'asc'
    }: {
      userId: string
      search?: string
      page: number
      limit: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }) => {
      const where: Prisma.UomWhereInput = { userId, deletedAt: null }

      if (search && search.trim().length > 0) {
        const searchTerm = search.trim()
        where.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { abbreviation: { contains: searchTerm, mode: 'insensitive' } }
        ]
      }

      const [data, total] = await Promise.all([
        prisma.uom.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder }
        }),
        prisma.uom.count({ where })
      ])

      return { data, total }
    }
  }
}
```

- [ ] **Step 5: Update company.repository.ts**

Replace entire file `apps/troithWeb/repositories/company.repository.ts`:

```typescript
import { prisma } from '@troithWeb/prisma'
import { Prisma } from '@prisma/client'

export function CompanyRepository() {
  return {
    findById: (id: string) => {
      return prisma.company.findUnique({
        where: {
          id
        }
      })
    },
    findByUserId: (userId: string) => {
      return prisma.company.findMany({
        where: {
          userId
        }
      })
    },
    create: (company: Prisma.Args<typeof prisma.company, 'create'>['data']) => {
      return prisma.company.create({
        data: company
      })
    },
    findWithFilters: async ({
      userId,
      search,
      page,
      limit,
      sortBy = 'name',
      sortOrder = 'asc'
    }: {
      userId: string
      search?: string
      page: number
      limit: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }) => {
      const where: Prisma.CompanyWhereInput = { userId, deletedAt: null }

      if (search && search.trim().length > 0) {
        const searchTerm = search.trim()
        where.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { legalName: { contains: searchTerm, mode: 'insensitive' } },
          { gstin: { contains: searchTerm, mode: 'insensitive' } },
          { state: { contains: searchTerm, mode: 'insensitive' } },
          { city: { contains: searchTerm, mode: 'insensitive' } }
        ]
      }

      const [data, total] = await Promise.all([
        prisma.company.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder }
        }),
        prisma.company.count({ where })
      ])

      return { data, total }
    }
  }
}
```

- [ ] **Step 6: Update party.repository.ts (search only)**

Replace entire file `apps/troithWeb/repositories/party.repository.ts`:

```typescript
import { Prisma } from '@prisma/client'
import { prisma } from '@troithWeb/prisma'

export const PartyRepository = () => {
  return {
    create: (party: Prisma.Args<typeof prisma.party, 'create'>['data']) => {
      return prisma.party.create({ data: party })
    },
    findByCompanyId: (companyId: string) => {
      return prisma.party.findMany({
        where: { companyId },
        include: {
          PartyItem: {
            include: {
              item: true
            }
          }
        }
      })
    },
    findWithSearch: async ({
      companyId,
      search
    }: {
      companyId: string
      search?: string
    }) => {
      const where: Prisma.PartyWhereInput = { companyId, deletedAt: null }

      if (search && search.trim().length > 0) {
        const searchTerm = search.trim()
        where.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { gstin: { contains: searchTerm, mode: 'insensitive' } },
          { state: { contains: searchTerm, mode: 'insensitive' } }
        ]
      }

      return prisma.party.findMany({
        where,
        include: {
          PartyItem: {
            include: {
              item: true
            }
          }
        }
      })
    }
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add apps/troithWeb/repositories/
git commit -m "feat: add findWithFilters to all repositories for server-side search, sort, and pagination"
```

---

## Task 4: Update API routes with filter params

**Files:**
- Modify: `apps/troithWeb/app/api/items/company/[slug]/route.ts`
- Modify: `apps/troithWeb/app/api/banks/user/[slug]/route.ts`
- Modify: `apps/troithWeb/app/api/taxes/company/[slug]/route.ts`
- Modify: `apps/troithWeb/app/api/uoms/company/[slug]/route.ts`
- Modify: `apps/troithWeb/app/api/companies/[userId]/route.ts`
- Modify: `apps/troithWeb/app/api/parties/company/[slug]/route.ts`

- [ ] **Step 1: Update items API route**

Replace entire file `apps/troithWeb/app/api/items/company/[slug]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { ItemRepository } from '@troithWeb/repositories/item.repository'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const companyId = params.slug
  const { searchParams } = request.nextUrl

  const search = searchParams.get('search') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10) || 20))
  const sortBy = searchParams.get('sortBy') || 'name'
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

  try {
    const itemRepository = ItemRepository()
    const result = await itemRepository.findWithFilters({
      companyId,
      search: search || undefined,
      page,
      limit,
      sortBy,
      sortOrder
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error finding items:', error)
    return NextResponse.json({ error: 'Unable to find items' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Update banks API route**

Replace entire file `apps/troithWeb/app/api/banks/user/[slug]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { BankRepository } from '@troithWeb/repositories/bank.repository'

function serializeBigInt(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'bigint') return obj.toString()
  if (obj instanceof Date) return obj.toISOString()
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(serializeBigInt)
    }
    const result: Record<string, unknown> = {}
    for (const key in obj) {
      result[key] = serializeBigInt((obj as Record<string, unknown>)[key])
    }
    return result
  }
  return obj
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const userId = params.slug
  const { searchParams } = request.nextUrl

  const search = searchParams.get('search') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10) || 20))
  const sortBy = searchParams.get('sortBy') || 'name'
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

  try {
    const bankRepository = BankRepository()
    const result = await bankRepository.findWithFilters({
      userId,
      search: search || undefined,
      page,
      limit,
      sortBy,
      sortOrder
    })

    return NextResponse.json(serializeBigInt(result), { status: 200 })
  } catch (error) {
    console.error('Error finding banks:', error)
    return NextResponse.json({ error: 'Unable to find banks' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Update taxes API route**

Replace entire file `apps/troithWeb/app/api/taxes/company/[slug]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { TaxRepository } from '@troithWeb/repositories/tax.repository'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const companyId = params.slug
  const { searchParams } = request.nextUrl

  const search = searchParams.get('search') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10) || 20))
  const sortBy = searchParams.get('sortBy') || 'cgst'
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

  try {
    const taxRepository = TaxRepository()
    const result = await taxRepository.findWithFilters({
      companyId,
      search: search || undefined,
      page,
      limit,
      sortBy,
      sortOrder
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error finding taxes:', error)
    return NextResponse.json({ error: 'Unable to find taxes' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Update uoms API route**

Replace entire file `apps/troithWeb/app/api/uoms/company/[slug]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { UomRepository } from '@troithWeb/repositories/uom.repository'
import { CompanyRepository } from '@troithWeb/repositories/company.repository'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const companyId = params.slug
  const { searchParams } = request.nextUrl

  const search = searchParams.get('search') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10) || 20))
  const sortBy = searchParams.get('sortBy') || 'name'
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

  try {
    const companyRepository = CompanyRepository()
    const company = await companyRepository.findById(companyId)
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }
    const uomRepository = UomRepository()
    const result = await uomRepository.findWithFilters({
      userId: company.userId,
      search: search || undefined,
      page,
      limit,
      sortBy,
      sortOrder
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error finding uoms:', error)
    return NextResponse.json({ error: 'Unable to find uoms' }, { status: 500 })
  }
}
```

- [ ] **Step 5: Update companies API route**

Replace entire file `apps/troithWeb/app/api/companies/[userId]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { CompanyRepository } from '@troithWeb/repositories/company.repository'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const userId = (await params).slug
  const { searchParams } = request.nextUrl

  const search = searchParams.get('search') || ''
  const page = searchParams.get('page')
  const limit = searchParams.get('limit')
  const sortBy = searchParams.get('sortBy')
  const sortOrder = searchParams.get('sortOrder')

  try {
    const companyRepository = CompanyRepository()

    // If pagination params provided, use filtered query
    if (page || limit) {
      const result = await companyRepository.findWithFilters({
        userId,
        search: search || undefined,
        page: Math.max(1, parseInt(page || '1', 10) || 1),
        limit: Math.max(1, Math.min(100, parseInt(limit || '20', 10) || 20)),
        sortBy: sortBy || 'name',
        sortOrder: (sortOrder || 'asc') as 'asc' | 'desc'
      })
      return NextResponse.json(result, { status: 200 })
    }

    // Otherwise return all (backward compatible for company selector modal)
    const companies = await companyRepository.findByUserId(userId)
    return NextResponse.json(companies, { status: 201 })
  } catch (error) {
    console.error('Error finding companies:', error)
    return NextResponse.json({ error: 'Unable to find companies' }, { status: 500 })
  }
}
```

- [ ] **Step 6: Update parties API route (search only)**

Replace entire file `apps/troithWeb/app/api/parties/company/[slug]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { PartyRepository } from '@troithWeb/repositories/party.repository'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const companyId = params.slug
  const { searchParams } = request.nextUrl
  const search = searchParams.get('search') || ''

  try {
    const partyRepository = PartyRepository()

    if (search) {
      const parties = await partyRepository.findWithSearch({
        companyId,
        search: search || undefined
      })
      return NextResponse.json(parties, { status: 200 })
    }

    const parties = await partyRepository.findByCompanyId(companyId)
    return NextResponse.json(parties, { status: 201 })
  } catch (error) {
    console.error('Error finding parties:', error)
    return NextResponse.json({ error: 'Unable to find parties' }, { status: 500 })
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add apps/troithWeb/app/api/
git commit -m "feat: update API routes with server-side search, sort, and pagination params"
```

---

## Task 5: Update query key factories

**Files:**
- Modify: `apps/troithWeb/app/tool/queryKeys/items.ts`
- Modify: `apps/troithWeb/app/tool/queryKeys/banks.ts`
- Modify: `apps/troithWeb/app/tool/queryKeys/taxes.ts`
- Modify: `apps/troithWeb/app/tool/queryKeys/uomKeys.ts`
- Modify: `apps/troithWeb/app/tool/queryKeys/parties.ts`
- Create: `apps/troithWeb/app/tool/queryKeys/companies.ts`

- [ ] **Step 1: Update items query keys**

Replace entire file `apps/troithWeb/app/tool/queryKeys/items.ts`:

```typescript
export interface TableFilterParams {
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const itemsKeys = {
  all: ['items'] as const,
  lists: (companyId: string, filters?: TableFilterParams) => [...itemsKeys.all, 'lists', companyId, filters ?? {}] as const,
  details: () => [...itemsKeys.all, 'detail'] as const,
  detail: (id: string) => [...itemsKeys.details(), id] as const
}
```

- [ ] **Step 2: Update banks query keys**

Replace entire file `apps/troithWeb/app/tool/queryKeys/banks.ts`:

```typescript
import { TableFilterParams } from './items'

export const banksKeys = {
  all: ['banks'] as const,
  lists: (userId: string, filters?: TableFilterParams) => [...banksKeys.all, 'lists', userId, filters ?? {}] as const,
  details: () => [...banksKeys.all, 'detail'] as const,
  detail: (id: string) => [...banksKeys.details(), id] as const
}
```

- [ ] **Step 3: Update taxes query keys**

Replace entire file `apps/troithWeb/app/tool/queryKeys/taxes.ts`:

```typescript
import { TableFilterParams } from './items'

export const taxesKeys = {
  all: ['taxes'] as const,
  lists: (companyId: string, filters?: TableFilterParams) => [...taxesKeys.all, 'lists', companyId, filters ?? {}] as const,
  details: () => [...taxesKeys.all, 'detail'] as const,
  detail: (id: string) => [...taxesKeys.details(), id] as const
}
```

- [ ] **Step 4: Update uom query keys**

Replace entire file `apps/troithWeb/app/tool/queryKeys/uomKeys.ts`:

```typescript
import { TableFilterParams } from './items'

export const uomKeys = {
  all: ['uom'] as const,
  lists: (companyId: string, filters?: TableFilterParams) => [...uomKeys.all, 'lists', companyId, filters ?? {}] as const,
  details: () => [...uomKeys.all, 'detail'] as const,
  detail: (id: string) => [...uomKeys.details(), id] as const
}
```

- [ ] **Step 5: Update parties query keys**

Replace entire file `apps/troithWeb/app/tool/queryKeys/parties.ts`:

```typescript
export const partiesKeys = {
  all: ['parties'] as const,
  lists: (companyId: string, search?: string) => [...partiesKeys.all, 'lists', companyId, search ?? ''] as const,
  details: () => [...partiesKeys.all, 'detail'] as const,
  detail: (id: string) => [...partiesKeys.details(), id] as const
}
```

- [ ] **Step 6: Create companies query keys**

Create `apps/troithWeb/app/tool/queryKeys/companies.ts`:

```typescript
import { TableFilterParams } from './items'

export const companiesKeys = {
  all: ['companies'] as const,
  lists: (userId: string, filters?: TableFilterParams) => [...companiesKeys.all, 'lists', userId, filters ?? {}] as const,
  details: () => [...companiesKeys.all, 'detail'] as const,
  detail: (id: string) => [...companiesKeys.details(), id] as const
}
```

- [ ] **Step 7: Commit**

```bash
git add apps/troithWeb/app/tool/queryKeys/
git commit -m "feat: update query key factories to include filter params for server-side pagination"
```

---

## Task 6: Items page - replace cards with DataTable

**Files:**
- Create: `apps/troithWeb/app/tool/items/(list)/columns.tsx`
- Modify: `apps/troithWeb/app/tool/items/(list)/page.tsx`
- Modify: `apps/troithWeb/app/tool/items/(list)/layout.tsx`

- [ ] **Step 1: Create Items column definitions**

Create `apps/troithWeb/app/tool/items/(list)/columns.tsx`:

```tsx
'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@troithWeb/app/tool/components/data-table/data-table-column-header'

interface ItemWithRelations {
  id: string
  name: string
  hsn: number
  uom: { name: string; abbreviation: string }
  tax: { cgst: number; sgst: number }
}

export const getItemColumns = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
): ColumnDef<ItemWithRelations, unknown>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
    )
  },
  {
    accessorKey: 'hsn',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="HSN Code" sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
    )
  },
  {
    id: 'uom',
    accessorFn: (row) => row.uom?.name,
    header: ({ column }) => <DataTableColumnHeader column={column} title="UOM" />,
    cell: ({ row }) => {
      const uom = row.original.uom
      return uom ? `${uom.name} (${uom.abbreviation})` : '-'
    },
    enableSorting: false
  },
  {
    id: 'tax',
    accessorFn: (row) => row.tax?.cgst + row.tax?.sgst,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tax" />,
    cell: ({ row }) => {
      const tax = row.original.tax
      return tax ? `${tax.cgst + tax.sgst}%` : '-'
    },
    enableSorting: false
  }
]
```

- [ ] **Step 2: Update Items page**

Replace entire file `apps/troithWeb/app/tool/items/(list)/page.tsx`:

```tsx
'use client'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { buttonVariants } from '@troith/shared'
import { Plus } from 'lucide-react'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { useRouter } from 'next-nprogress-bar'
import { useQuery } from '@tanstack/react-query'
import { itemsKeys, TableFilterParams } from '@troithWeb/app/tool/queryKeys/items'
import { useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useDebounce } from '@troith/shared'
import { DataTable } from '@troithWeb/app/tool/components/data-table/data-table'
import { getItemColumns } from './columns'
import { useParams } from 'next/navigation'

interface PaginatedResponse {
  data: Array<{ id: string; name: string; hsn: number; uom: { name: string; abbreviation: string }; tax: { cgst: number; sgst: number } }>
  total: number
}

const fetchItems = async (companyId: string, params: TableFilterParams): Promise<PaginatedResponse> => {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('limit', String(params.limit ?? 20))
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
  return await (await fetch(`/api/items/company/${companyId}?${searchParams.toString()}`)).json()
}

export default function Items() {
  const { selectedCompany } = useCompanyStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const routeParams = useParams()

  const search = searchParams.get('search') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = parseInt(searchParams.get('limit') || '20', 10) || 20
  const sortBy = searchParams.get('sortBy') || 'name'
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

  const [searchValue, setSearchValue] = useState(search)
  const debouncedSearch = useDebounce(searchValue, 300)

  const filters: TableFilterParams = { search: debouncedSearch || undefined, page, limit, sortBy, sortOrder }

  const { data, isLoading } = useQuery({
    queryKey: itemsKeys.lists(selectedCompany?.id ?? '', filters),
    queryFn: () => fetchItems(selectedCompany?.id ?? '', filters),
    enabled: !!selectedCompany?.id
  })

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    updateParams({ search: value, page: '1' })
  }

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) })
  }

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    updateParams({ sortBy: newSortBy, sortOrder: newSortOrder, page: '1' })
  }

  const activeItemId = routeParams?.id as string | undefined

  const columns = getItemColumns(sortBy, sortOrder, handleSortChange)

  return (
    <>
      <Link
        href="/tool/items/create"
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-4 right-4 z-10', buttonVariants({ variant: 'default' }))}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create item
      </Link>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        total={data?.total ?? 0}
        page={page}
        limit={limit}
        isLoading={isLoading}
        searchValue={searchValue}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onRowClick={(item) => router.push(`/tool/items/${item.id}`)}
        activeRowId={activeItemId}
        searchPlaceholder="Search items..."
      />
    </>
  )
}
```

- [ ] **Step 3: Simplify Items layout**

Replace entire file `apps/troithWeb/app/tool/items/(list)/layout.tsx`:

```tsx
'use client'
import { ResizableTwoColumnToolLayout } from '@troithWeb/app/tool/components/layouts/resizableTwoColumnToolLayout'
import { PropsWithChildren, ReactNode } from 'react'

type Props = PropsWithChildren & { item: ReactNode }

export default function ItemsLayout({ children, item }: Props) {
  return (
    <ResizableTwoColumnToolLayout
      autoSaveId="ITEMS_RESIZABLE_LAYOUT_KEY"
      firstCol={<div className="h-full w-full relative">{children}</div>}
      secondCol={item}
    />
  )
}
```

- [ ] **Step 4: Verify build compiles**

```bash
npx nx build troithWeb --skip-nx-cache
```

- [ ] **Step 5: Commit**

```bash
git add apps/troithWeb/app/tool/items/\(list\)/
git commit -m "feat: replace Items card list with DataTable (search, sort, pagination)"
```

---

## Task 7: Banks page - replace cards with DataTable

**Files:**
- Create: `apps/troithWeb/app/tool/banks/(list)/columns.tsx`
- Modify: `apps/troithWeb/app/tool/banks/(list)/page.tsx`
- Modify: `apps/troithWeb/app/tool/banks/(list)/layout.tsx`

- [ ] **Step 1: Create Banks column definitions**

Create `apps/troithWeb/app/tool/banks/(list)/columns.tsx`:

```tsx
'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@troithWeb/app/tool/components/data-table/data-table-column-header'

interface BankRow {
  id: string
  name: string
  accountNumber: string
  ifsc: string
  branch: string
  holderName: string
}

export const getBankColumns = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
): ColumnDef<BankRow, unknown>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
    )
  },
  {
    accessorKey: 'accountNumber',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Account No." />,
    enableSorting: false
  },
  {
    accessorKey: 'ifsc',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IFSC" sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
    )
  },
  {
    accessorKey: 'branch',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch" sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
    )
  },
  {
    accessorKey: 'holderName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Holder Name" sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
    )
  }
]
```

- [ ] **Step 2: Update Banks page**

Replace entire file `apps/troithWeb/app/tool/banks/(list)/page.tsx`:

```tsx
'use client'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { buttonVariants } from '@troith/shared'
import { Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next-nprogress-bar'
import { useSession } from 'next-auth/react'
import { useSearchParams, useParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useDebounce } from '@troith/shared'
import { banksKeys } from '@troithWeb/app/tool/queryKeys/banks'
import { TableFilterParams } from '@troithWeb/app/tool/queryKeys/items'
import { DataTable } from '@troithWeb/app/tool/components/data-table/data-table'
import { getBankColumns } from './columns'

interface PaginatedResponse {
  data: Array<{ id: string; name: string; accountNumber: string; ifsc: string; branch: string; holderName: string }>
  total: number
}

const fetchBanks = async (userId: string, params: TableFilterParams): Promise<PaginatedResponse> => {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('limit', String(params.limit ?? 20))
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
  return await (await fetch(`/api/banks/user/${userId}?${searchParams.toString()}`)).json()
}

export default function BanksPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const routeParams = useParams()

  const search = searchParams.get('search') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = parseInt(searchParams.get('limit') || '20', 10) || 20
  const sortBy = searchParams.get('sortBy') || 'name'
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

  const [searchValue, setSearchValue] = useState(search)
  const debouncedSearch = useDebounce(searchValue, 300)

  const filters: TableFilterParams = { search: debouncedSearch || undefined, page, limit, sortBy, sortOrder }

  const { data, isLoading } = useQuery({
    queryKey: banksKeys.lists(session?.user?.id ?? '', filters),
    queryFn: () => fetchBanks(session?.user?.id ?? '', filters),
    enabled: !!session?.user?.id
  })

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    updateParams({ search: value, page: '1' })
  }

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) })
  }

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    updateParams({ sortBy: newSortBy, sortOrder: newSortOrder, page: '1' })
  }

  const activeBankId = routeParams?.id as string | undefined
  const columns = getBankColumns(sortBy, sortOrder, handleSortChange)

  return (
    <>
      <Link
        href="/tool/banks/create"
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-4 right-4 z-10', buttonVariants({ variant: 'default' }))}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create bank
      </Link>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        total={data?.total ?? 0}
        page={page}
        limit={limit}
        isLoading={isLoading}
        searchValue={searchValue}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onRowClick={(bank) => router.push(`/tool/banks/${bank.id}`)}
        activeRowId={activeBankId}
        searchPlaceholder="Search banks..."
      />
    </>
  )
}
```

- [ ] **Step 3: Simplify Banks layout**

Replace entire file `apps/troithWeb/app/tool/banks/(list)/layout.tsx`:

```tsx
'use client'
import { ResizableTwoColumnToolLayout } from '@troithWeb/app/tool/components/layouts/resizableTwoColumnToolLayout'
import { PropsWithChildren, ReactNode } from 'react'

type Props = PropsWithChildren & { bank: ReactNode }

export default function BanksLayout(props: Props) {
  return (
    <ResizableTwoColumnToolLayout
      autoSaveId="BANK_RESIZABLE_LAYOUT_KEY"
      firstCol={<div className="h-full w-full relative">{props.children}</div>}
      secondCol={props.bank}
    />
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/troithWeb/app/tool/banks/\(list\)/
git commit -m "feat: replace Banks card list with DataTable (search, sort, pagination)"
```

---

## Task 8: Taxes page - replace cards with DataTable

**Files:**
- Create: `apps/troithWeb/app/tool/taxes/(list)/columns.tsx`
- Modify: `apps/troithWeb/app/tool/taxes/(list)/page.tsx`
- Modify: `apps/troithWeb/app/tool/taxes/(list)/layout.tsx`

- [ ] **Step 1: Create Taxes column definitions**

Create `apps/troithWeb/app/tool/taxes/(list)/columns.tsx`:

```tsx
'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@troithWeb/app/tool/components/data-table/data-table-column-header'

interface TaxRow {
  id: string
  cgst: number
  sgst: number
}

export const getTaxColumns = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
): ColumnDef<TaxRow, unknown>[] => [
  {
    id: 'igst',
    accessorFn: (row) => row.cgst + row.sgst,
    header: ({ column }) => <DataTableColumnHeader column={column} title="IGST%" />,
    cell: ({ row }) => `${row.original.cgst + row.original.sgst}%`,
    enableSorting: false
  },
  {
    accessorKey: 'cgst',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CGST%" sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
    ),
    cell: ({ row }) => `${row.original.cgst}%`
  },
  {
    accessorKey: 'sgst',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SGST%" sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
    ),
    cell: ({ row }) => `${row.original.sgst}%`
  }
]
```

- [ ] **Step 2: Update Taxes page**

Replace entire file `apps/troithWeb/app/tool/taxes/(list)/page.tsx`:

```tsx
'use client'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { buttonVariants } from '@troith/shared'
import { Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { useRouter } from 'next-nprogress-bar'
import { useSearchParams, useParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useDebounce } from '@troith/shared'
import { taxesKeys } from '@troithWeb/app/tool/queryKeys/taxes'
import { TableFilterParams } from '@troithWeb/app/tool/queryKeys/items'
import { DataTable } from '@troithWeb/app/tool/components/data-table/data-table'
import { getTaxColumns } from './columns'

interface PaginatedResponse {
  data: Array<{ id: string; cgst: number; sgst: number }>
  total: number
}

const fetchTaxes = async (companyId: string, params: TableFilterParams): Promise<PaginatedResponse> => {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('limit', String(params.limit ?? 20))
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
  return await (await fetch(`/api/taxes/company/${companyId}?${searchParams.toString()}`)).json()
}

export default function TaxesPage() {
  const { selectedCompany } = useCompanyStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const routeParams = useParams()

  const search = searchParams.get('search') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = parseInt(searchParams.get('limit') || '20', 10) || 20
  const sortBy = searchParams.get('sortBy') || 'cgst'
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

  const [searchValue, setSearchValue] = useState(search)
  const debouncedSearch = useDebounce(searchValue, 300)

  const filters: TableFilterParams = { search: debouncedSearch || undefined, page, limit, sortBy, sortOrder }

  const { data, isLoading } = useQuery({
    queryKey: taxesKeys.lists(selectedCompany?.id ?? '', filters),
    queryFn: () => fetchTaxes(selectedCompany?.id ?? '', filters),
    enabled: !!selectedCompany?.id
  })

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    updateParams({ search: value, page: '1' })
  }

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) })
  }

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    updateParams({ sortBy: newSortBy, sortOrder: newSortOrder, page: '1' })
  }

  const activeTaxId = routeParams?.id as string | undefined
  const columns = getTaxColumns(sortBy, sortOrder, handleSortChange)

  return (
    <>
      <Link
        href="/tool/taxes/create"
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-4 right-4 z-10', buttonVariants({ variant: 'default' }))}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create tax
      </Link>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        total={data?.total ?? 0}
        page={page}
        limit={limit}
        isLoading={isLoading}
        searchValue={searchValue}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onRowClick={(tax) => router.push(`/tool/taxes/${tax.id}`)}
        activeRowId={activeTaxId}
        searchPlaceholder="Search taxes..."
      />
    </>
  )
}
```

- [ ] **Step 3: Simplify Taxes layout**

Replace entire file `apps/troithWeb/app/tool/taxes/(list)/layout.tsx`:

```tsx
'use client'
import { ResizableTwoColumnToolLayout } from '@troithWeb/app/tool/components/layouts/resizableTwoColumnToolLayout'
import { PropsWithChildren, ReactNode } from 'react'

type Props = PropsWithChildren & { tax: ReactNode }

export default function TaxesLayout(props: Props) {
  return (
    <ResizableTwoColumnToolLayout
      autoSaveId="TAX_RESIZABLE_LAYOUT_KEY"
      firstCol={<div className="h-full w-full relative">{props.children}</div>}
      secondCol={props.tax}
    />
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/troithWeb/app/tool/taxes/\(list\)/
git commit -m "feat: replace Taxes card list with DataTable (search, sort, pagination)"
```

---

## Task 9: UOMs page - replace cards with DataTable

**Files:**
- Create: `apps/troithWeb/app/tool/uoms/(list)/columns.tsx`
- Modify: `apps/troithWeb/app/tool/uoms/(list)/page.tsx`
- Modify: `apps/troithWeb/app/tool/uoms/(list)/layout.tsx`

- [ ] **Step 1: Create UOM column definitions**

Create `apps/troithWeb/app/tool/uoms/(list)/columns.tsx`:

```tsx
'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@troithWeb/app/tool/components/data-table/data-table-column-header'

interface UomRow {
  id: string
  name: string
  abbreviation: string
}

export const getUomColumns = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
): ColumnDef<UomRow, unknown>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
    )
  },
  {
    accessorKey: 'abbreviation',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Abbreviation" sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
    ),
    cell: ({ row }) => <span className="uppercase italic">{row.original.abbreviation}</span>
  }
]
```

- [ ] **Step 2: Update UOMs page**

Replace entire file `apps/troithWeb/app/tool/uoms/(list)/page.tsx`:

```tsx
'use client'
import { cn } from '@troith/shared/lib/util'
import { Button, Dialog, DialogContent, DialogPortal } from '@troith/shared'
import { Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { CreateUomForm } from '@troithWeb/app/tool/uoms/components/CreateUomForm'
import { useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar'
import { useDebounce } from '@troith/shared'
import { uomKeys } from '@troithWeb/app/tool/queryKeys/uomKeys'
import { TableFilterParams } from '@troithWeb/app/tool/queryKeys/items'
import { DataTable } from '@troithWeb/app/tool/components/data-table/data-table'
import { getUomColumns } from './columns'

interface PaginatedResponse {
  data: Array<{ id: string; name: string; abbreviation: string }>
  total: number
}

const fetchUoms = async (companyId: string, params: TableFilterParams): Promise<PaginatedResponse> => {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('limit', String(params.limit ?? 20))
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
  return await (await fetch(`/api/uoms/company/${companyId}?${searchParams.toString()}`)).json()
}

export default function UomsListPage() {
  const { selectedCompany } = useCompanyStore()
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get('search') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = parseInt(searchParams.get('limit') || '20', 10) || 20
  const sortBy = searchParams.get('sortBy') || 'name'
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

  const [searchValue, setSearchValue] = useState(search)
  const debouncedSearch = useDebounce(searchValue, 300)

  const filters: TableFilterParams = { search: debouncedSearch || undefined, page, limit, sortBy, sortOrder }

  const { data, isLoading } = useQuery({
    queryKey: uomKeys.lists(selectedCompany?.id ?? '', filters),
    queryFn: () => fetchUoms(selectedCompany?.id ?? '', filters),
    enabled: !!selectedCompany?.id
  })

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    updateParams({ search: value, page: '1' })
  }

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) })
  }

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    updateParams({ sortBy: newSortBy, sortOrder: newSortOrder, page: '1' })
  }

  const columns = getUomColumns(sortBy, sortOrder, handleSortChange)

  return (
    <>
      <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
        <DialogPortal>
          <DialogContent autoFocus={false}>
            <CreateUomForm onSubmit={() => setIsCreateFormOpen(false)} />
          </DialogContent>
        </DialogPortal>
      </Dialog>
      <Button
        onClick={() => setIsCreateFormOpen(true)}
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-4 right-4 z-10')}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create UOM
      </Button>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        total={data?.total ?? 0}
        page={page}
        limit={limit}
        isLoading={isLoading}
        searchValue={searchValue}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search units..."
      />
    </>
  )
}
```

- [ ] **Step 3: Simplify UOMs layout**

Replace entire file `apps/troithWeb/app/tool/uoms/(list)/layout.tsx`:

```tsx
'use client'
import { ResizableTwoColumnToolLayout } from '@troithWeb/app/tool/components/layouts/resizableTwoColumnToolLayout'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren

export default function UomsLayout({ children }: Props) {
  return (
    <ResizableTwoColumnToolLayout
      autoSaveId="UOMS_RESIZABLE_LAYOUT_KEY"
      firstCol={<div className="h-full w-full relative">{children}</div>}
      shouldShowHandle={false}
      secondCol={<div className="pt-4 pb-20 bg-gray-50 dark:bg-zinc-900 h-full w-full relative" />}
    />
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/troithWeb/app/tool/uoms/\(list\)/
git commit -m "feat: replace UOMs card list with DataTable (search, sort, pagination)"
```

---

## Task 10: Create Companies page

**Files:**
- Create: `apps/troithWeb/app/tool/companies/(list)/columns.tsx`
- Create: `apps/troithWeb/app/tool/companies/(list)/page.tsx`
- Create: `apps/troithWeb/app/tool/companies/(list)/default.tsx`
- Create: `apps/troithWeb/app/tool/companies/(list)/layout.tsx`
- Create: `apps/troithWeb/app/tool/companies/(list)/@company/default.tsx`

- [ ] **Step 1: Create Companies column definitions**

Create `apps/troithWeb/app/tool/companies/(list)/columns.tsx`:

```tsx
'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@troithWeb/app/tool/components/data-table/data-table-column-header'

interface CompanyRow {
  id: string
  name: string
  legalName: string
  gstin: string
  state: string
  city: string
}

export const getCompanyColumns = (
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
): ColumnDef<CompanyRow, unknown>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
    )
  },
  {
    accessorKey: 'legalName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Legal Name" sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
    )
  },
  {
    accessorKey: 'gstin',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="GSTIN" sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
    )
  },
  {
    accessorKey: 'state',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
    )
  },
  {
    accessorKey: 'city',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="City" sortBy={sortBy} sortOrder={sortOrder} onSortChange={onSortChange} />
    )
  }
]
```

- [ ] **Step 2: Create Companies page**

Create `apps/troithWeb/app/tool/companies/(list)/page.tsx`:

```tsx
'use client'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next-nprogress-bar'
import { useSession } from 'next-auth/react'
import { useSearchParams, useParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useDebounce } from '@troith/shared'
import { companiesKeys } from '@troithWeb/app/tool/queryKeys/companies'
import { TableFilterParams } from '@troithWeb/app/tool/queryKeys/items'
import { DataTable } from '@troithWeb/app/tool/components/data-table/data-table'
import { getCompanyColumns } from './columns'

interface PaginatedResponse {
  data: Array<{ id: string; name: string; legalName: string; gstin: string; state: string; city: string }>
  total: number
}

const fetchCompanies = async (userId: string, params: TableFilterParams): Promise<PaginatedResponse> => {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  searchParams.set('page', String(params.page ?? 1))
  searchParams.set('limit', String(params.limit ?? 20))
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder)
  return await (await fetch(`/api/companies/${userId}?${searchParams.toString()}`)).json()
}

export default function CompaniesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const routeParams = useParams()

  const search = searchParams.get('search') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = parseInt(searchParams.get('limit') || '20', 10) || 20
  const sortBy = searchParams.get('sortBy') || 'name'
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

  const [searchValue, setSearchValue] = useState(search)
  const debouncedSearch = useDebounce(searchValue, 300)

  const filters: TableFilterParams = { search: debouncedSearch || undefined, page, limit, sortBy, sortOrder }

  const { data, isLoading } = useQuery({
    queryKey: companiesKeys.lists(session?.user?.id ?? '', filters),
    queryFn: () => fetchCompanies(session?.user?.id ?? '', filters),
    enabled: !!session?.user?.id
  })

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    updateParams({ search: value, page: '1' })
  }

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) })
  }

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    updateParams({ sortBy: newSortBy, sortOrder: newSortOrder, page: '1' })
  }

  const activeCompanyId = routeParams?.id as string | undefined
  const columns = getCompanyColumns(sortBy, sortOrder, handleSortChange)

  return (
    <DataTable
      columns={columns}
      data={data?.data ?? []}
      total={data?.total ?? 0}
      page={page}
      limit={limit}
      isLoading={isLoading}
      searchValue={searchValue}
      onPageChange={handlePageChange}
      onSearchChange={handleSearchChange}
      onRowClick={(company) => router.push(`/tool/companies/${company.id}`)}
      activeRowId={activeCompanyId}
      searchPlaceholder="Search companies..."
    />
  )
}
```

- [ ] **Step 3: Create Companies default**

Create `apps/troithWeb/app/tool/companies/(list)/default.tsx`:

```tsx
'use client'
import Page from './page'

export default Page
```

- [ ] **Step 4: Create Companies layout**

Create `apps/troithWeb/app/tool/companies/(list)/layout.tsx`:

```tsx
'use client'
import { ResizableTwoColumnToolLayout } from '@troithWeb/app/tool/components/layouts/resizableTwoColumnToolLayout'
import { PropsWithChildren, ReactNode } from 'react'

type Props = PropsWithChildren & { company: ReactNode }

export default function CompaniesLayout({ children, company }: Props) {
  return (
    <ResizableTwoColumnToolLayout
      autoSaveId="COMPANIES_RESIZABLE_LAYOUT_KEY"
      firstCol={<div className="h-full w-full relative">{children}</div>}
      secondCol={company}
    />
  )
}
```

- [ ] **Step 5: Create company detail default (empty state)**

Create `apps/troithWeb/app/tool/companies/(list)/@company/default.tsx`:

```tsx
'use client'
export default function CompanyPageDefault() {
  return <div className="flex items-center justify-center h-full text-zinc-500">Select a company to view details</div>
}
```

- [ ] **Step 6: Commit**

```bash
git add apps/troithWeb/app/tool/companies/ apps/troithWeb/app/tool/queryKeys/companies.ts
git commit -m "feat: add Companies list page with DataTable (search, sort, pagination)"
```

---

## Task 11: Wire up Parties search (card layout stays)

**Files:**
- Modify: `apps/troithWeb/app/tool/parties/(list)/layout.tsx`
- Modify: `apps/troithWeb/app/tool/parties/(list)/page.tsx`

- [ ] **Step 1: Wire up Parties layout search input**

Replace entire file `apps/troithWeb/app/tool/parties/(list)/layout.tsx`:

```tsx
'use client'
import { ResizableTwoColumnToolLayout } from '@troithWeb/app/tool/components/layouts/resizableTwoColumnToolLayout'
import { Input, ScrollArea } from '@troith/shared'
import { PropsWithChildren, ReactNode, useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar'

type Props = {
  party: ReactNode
} & PropsWithChildren

export default function PartiesLayout({ children, party }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')

  const updateSearch = useCallback(
    (value: string) => {
      setSearchValue(value)
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('search', value)
      } else {
        params.delete('search')
      }
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  return (
    <ResizableTwoColumnToolLayout
      autoSaveId="PARTY_RESIZABLE_LAYOUT_KEY"
      firstCol={
        <>
          <header className="border-b px-4 h-16 flex items-center gap-2">
            <Input
              className="h-8 w-6xl shadow-sm"
              placeholder="Filter Parties"
              value={searchValue}
              onChange={(e) => updateSearch(e.target.value)}
            />
          </header>
          <ScrollArea className="px-4 pt-4 pb-20 h-full w-full relative">{children}</ScrollArea>
        </>
      }
      secondCol={party}
    />
  )
}
```

- [ ] **Step 2: Update Parties page with search filtering**

Replace entire file `apps/troithWeb/app/tool/parties/(list)/page.tsx`:

```tsx
'use client'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { buttonVariants } from '@troith/shared'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useQuery } from '@tanstack/react-query'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { PartyCard } from '@troithWeb/app/tool/components/partyCard'
import { useRouter } from 'next-nprogress-bar'
import { Party } from '@prisma/client'
import { useSearchParams } from 'next/navigation'
import { useDebounce } from '@troith/shared'
import { partiesKeys } from '@troithWeb/app/tool/queryKeys/parties'

const fetchParties = async (companyId: string, search?: string) => {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  const query = params.toString()
  const res = await fetch(`/api/parties/company/${companyId}${query ? `?${query}` : ''}`)
  if (!res.ok) throw new Error('Failed to fetch parties')
  return res.json()
}

export default function Parties() {
  const { selectedCompany } = useCompanyStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get('search') || ''
  const debouncedSearch = useDebounce(search, 300)

  const { data: parties } = useQuery({
    queryKey: partiesKeys.lists(selectedCompany?.id ?? '', debouncedSearch || undefined),
    queryFn: () => fetchParties(selectedCompany?.id ?? '', debouncedSearch || undefined),
    enabled: !!selectedCompany?.id
  })

  return (
    <AnimatePresence>
      <Link
        href="/tool/parties/create"
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-20 right-4', buttonVariants({ variant: 'default' }))}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create party
      </Link>
      <motion.div {...animateBasicMotionOpacity()} className="flex flex-col w-full gap-4 pb-24">
        {parties?.map((party: Party) => (
          <PartyCard onSelect={(party) => router.push(`/tool/parties/${party.id}`)} entity={party as Party} key={`party-list-${party?.id}`} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/troithWeb/app/tool/parties/\(list\)/
git commit -m "feat: wire up Parties search input with server-side filtering"
```

---

## Task 12: Verify build and smoke test

- [ ] **Step 1: Build the project**

```bash
npx nx build troithWeb --skip-nx-cache
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Run lint**

```bash
npx nx lint troithWeb
```

Expected: No new lint errors.

- [ ] **Step 3: Verify dev server starts**

```bash
npx nx dev troithWeb
```

Open the following pages in the browser and verify:
- `/tool/items` - Table with search, sort, pagination
- `/tool/banks` - Table with search, sort, pagination
- `/tool/taxes` - Table with search, sort, pagination
- `/tool/uoms` - Table with search, sort, pagination
- `/tool/companies` - Table with search, sort, pagination
- `/tool/parties` - Card list with working search

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address build and lint issues from DataTable migration"
```
