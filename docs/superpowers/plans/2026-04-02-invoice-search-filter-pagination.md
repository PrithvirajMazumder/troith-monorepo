# Invoice Search, Filter & Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the invoice list's search box, status filter, and pagination functional with URL query params, debounced search, and server-side filtering/pagination.

**Architecture:** URL query params (`search`, `status`, `page`, `limit`) drive client state. The layout syncs UI controls to URL params. The page component reads params, fetches from the API with those params, and renders results + pagination. The API route parses params and delegates to a new repository method that builds a Prisma query with WHERE filters and skip/take pagination.

**Tech Stack:** Next.js 14 App Router, React Query, Prisma, `useDebounce` from `@troith/shared`, `useRouter` from `next-nprogress-bar`, `useSearchParams` from `next/navigation`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `apps/troithWeb/repositories/invoice.repository.ts` | Modify | Add `findByCompanyIdWithFilters` method |
| `apps/troithWeb/app/api/invoices/company/[slug]/route.ts` | Modify | Parse searchParams, call new repo method, return `{ invoices, total }` |
| `apps/troithWeb/app/tool/queryKeys/invoices.ts` | Modify | Update `lists` key to include filter params |
| `apps/troithWeb/app/tool/invoices/(list)/layout.tsx` | Modify | Add `'use client'`, wire search input + status multi-select to URL params |
| `apps/troithWeb/app/tool/invoices/(list)/(all)/page.tsx` | Modify | Read params, paginated fetch, render pagination UI |

---

### Task 1: Repository — Add `findByCompanyIdWithFilters`

**Files:**
- Modify: `apps/troithWeb/repositories/invoice.repository.ts`

- [ ] **Step 1: Add the `findByCompanyIdWithFilters` method to the repository**

Add this method inside the returned object of `InvoiceRepository()`, after the existing `findByCompanyId` method:

```typescript
findByCompanyIdWithFilters: async ({
  companyId,
  search,
  statuses,
  page,
  limit
}: {
  companyId: string
  search?: string
  statuses?: InvoiceStatus[]
  page: number
  limit: number
}) => {
  const where: Prisma.InvoiceWhereInput = { companyId }

  if (statuses && statuses.length > 0) {
    where.status = { in: statuses }
  }

  if (search && search.trim().length > 0) {
    const searchTerm = search.trim()
    const orConditions: Prisma.InvoiceWhereInput[] = [
      { party: { name: { contains: searchTerm, mode: 'insensitive' } } }
    ]
    const parsedNo = parseInt(searchTerm, 10)
    if (!isNaN(parsedNo)) {
      orConditions.push({ no: parsedNo })
    }
    where.OR = orConditions
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        InvoiceItem: {
          include: {
            item: {
              include: {
                uom: true,
                tax: true
              }
            }
          }
        },
        company: true,
        bank: true,
        tax: true,
        party: true
      }
    }),
    prisma.invoice.count({ where })
  ])

  return { invoices, total }
}
```

Also add the `InvoiceStatus` import at the top of the file — update the existing Prisma import:

```typescript
import { Prisma, InvoiceStatus } from '@prisma/client'
```

---

### Task 2: API Route — Parse query params and use new repository method

**Files:**
- Modify: `apps/troithWeb/app/api/invoices/company/[slug]/route.ts`

- [ ] **Step 1: Update the GET handler to parse searchParams and call the new method**

Replace the entire `GET` function with:

```typescript
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const companyId = params.slug
  const { searchParams } = request.nextUrl

  const search = searchParams.get('search') || ''
  const statusParam = searchParams.get('status') || ''
  const statuses = statusParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean) as InvoiceStatus[]
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10) || 20))

  try {
    const invoiceRepository = InvoiceRepository()
    const { invoices, total } = await invoiceRepository.findByCompanyIdWithFilters({
      companyId,
      search: search || undefined,
      statuses: statuses.length > 0 ? statuses : undefined,
      page,
      limit
    })

    return NextResponse.json(serializeBigInt({ invoices, total }), { status: 200 })
  } catch (error) {
    console.error('Error finding invoices:', error)
    return NextResponse.json({ error: 'Unable to find invoices' }, { status: 500 })
  }
}
```

Add the `InvoiceStatus` import at the top:

```typescript
import { InvoiceStatus } from '@prisma/client'
```

Note: Also changed the success status from `201` to `200` (GET responses should be 200, not 201).

---

### Task 3: Query Keys — Update `lists` to include filter params

**Files:**
- Modify: `apps/troithWeb/app/tool/queryKeys/invoices.ts`

- [ ] **Step 1: Update the `lists` key factory**

Replace the entire file content with:

```typescript
export interface InvoiceFilterParams {
  search?: string
  status?: string
  page?: number
  limit?: number
}

export const invoicesKeys = {
  all: ['invoices'] as const,
  lists: (companyId: string, filters?: InvoiceFilterParams) => [...invoicesKeys.all, 'lists', companyId, filters ?? {}] as const,
  details: () => [...invoicesKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoicesKeys.details(), id] as const,
  byNo: (no: number) => [no, ...invoicesKeys.details(), 'byInvoiceNo'] as const,
  nextNo: (companyId: string) => [...invoicesKeys.all, 'nextNo', companyId]
}
```

---

### Task 4: Layout — Wire search input and status multi-select to URL params

**Files:**
- Modify: `apps/troithWeb/app/tool/invoices/(list)/layout.tsx`

- [ ] **Step 1: Rewrite the layout as a client component with search and status filter wired to URL**

Replace the entire file content with:

```tsx
'use client'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import {
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  ScrollArea,
  Checkbox
} from '@troith/shared'
import { CheckCircle, Gem, PencilLine, PlusCircle, CircleDashed, FileCheck } from 'lucide-react'
import { ResizableTwoColumnToolLayout } from '@troithWeb/app/tool/components/layouts/resizableTwoColumnToolLayout'
import { CustomEventsNames } from '@troithWeb/app/tool/constants/customEventsNames'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar'
import { useDebounce } from '@troith/shared'
import { InvoiceStatus } from '@prisma/client'

type Props = {
  children: ReactNode
  invoice: ReactNode
}

const statusOptions: { value: InvoiceStatus; label: string; icon: ReactNode }[] = [
  { value: 'DRAFT', label: 'Draft', icon: <PencilLine className="h-4 w-4" /> },
  { value: 'CONFIRMED', label: 'Confirmed', icon: <CheckCircle className="h-4 w-4" /> },
  { value: 'PAID', label: 'Paid', icon: <Gem className="h-4 w-4" /> },
  { value: 'PARTIALLY_PAID', label: 'Partially Paid', icon: <CircleDashed className="h-4 w-4" /> },
  { value: 'GST_SUBMITTED', label: 'GST Submitted', icon: <FileCheck className="h-4 w-4" /> }
]

export default function InvoicesLayout(props: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')
  const debouncedSearch = useDebounce(searchValue, 300)

  const selectedStatuses = (searchParams.get('status') || '')
    .split(',')
    .filter(Boolean) as InvoiceStatus[]

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
      params.set('page', '1')
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  useEffect(() => {
    const currentSearch = searchParams.get('search') || ''
    if (debouncedSearch !== currentSearch) {
      updateParams({ search: debouncedSearch })
    }
  }, [debouncedSearch])

  const toggleStatus = (status: InvoiceStatus) => {
    const current = new Set(selectedStatuses)
    if (current.has(status)) {
      current.delete(status)
    } else {
      current.add(status)
    }
    updateParams({ status: Array.from(current).join(',') })
  }

  return (
    <ResizableTwoColumnToolLayout
      autoSaveId="INVOICE_RESIZABLE_LAYOUT_KEY"
      firstCol={
        <>
          <header className="border-b px-4 h-16 flex items-center gap-2">
            <Input
              className="h-8 w-6xl shadow-sm"
              placeholder="Filter Invoices"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="shadow-sm border-dashed h-8 border">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Status
                  {selectedStatuses.length > 0 && (
                    <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
                      {selectedStatuses.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    className="capitalize gap-2"
                    onSelect={(e) => {
                      e.preventDefault()
                      toggleStatus(option.value)
                    }}
                  >
                    <Checkbox checked={selectedStatuses.includes(option.value)} className="pointer-events-none" />
                    {option.icon}
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <ScrollArea className="px-4 pt-4 pb-20 h-full w-full relative">{props.children}</ScrollArea>
        </>
      }
      onResize={(size) => {
        window.dispatchEvent(
          new CustomEvent(CustomEventsNames.InvoiceSidePanelResizeEventName, {
            detail: {
              message: size
            }
          })
        )
      }}
      secondCol={props.invoice}
    />
  )
}
```

---

### Task 5: Page — Paginated data fetching and pagination UI

**Files:**
- Modify: `apps/troithWeb/app/tool/invoices/(list)/(all)/page.tsx`

- [ ] **Step 1: Rewrite the page to read URL params, fetch with filters, and render pagination**

Replace the entire file content with:

```tsx
'use client'
import { InvoiceCard, InvoiceSkeletonLoader } from '@troithWeb/app/tool/components/invoiceCard'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button, buttonVariants } from '@troith/shared'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { InvoiceType } from '@troithWeb/types/invoices'
import { useQuery } from '@tanstack/react-query'
import { invoicesKeys } from '@troithWeb/app/tool/queryKeys/invoices'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar'

interface PaginatedInvoicesResponse {
  invoices: InvoiceType[]
  total: number
}

const fetchInvoices = async (
  companyId: string,
  params: { search: string; status: string; page: number; limit: number }
): Promise<PaginatedInvoicesResponse> => {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  if (params.status) searchParams.set('status', params.status)
  searchParams.set('page', String(params.page))
  searchParams.set('limit', String(params.limit))
  return await (await fetch(`/api/invoices/company/${companyId}?${searchParams.toString()}`)).json()
}

export default function Invoices() {
  const { selectedCompany } = useCompanyStore()
  const searchParams = useSearchParams()
  const router = useRouter()

  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = parseInt(searchParams.get('limit') || '20', 10) || 20

  const { data, isLoading } = useQuery({
    queryKey: invoicesKeys.lists(selectedCompany?.id ?? '', { search, status, page, limit }),
    queryFn: () => fetchInvoices(selectedCompany?.id ?? '', { search, status, page, limit }),
    enabled: !!selectedCompany?.id
  })

  const invoices = data?.invoices ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  return (
    <AnimatePresence>
      <Link
        href="/tool/invoices/create"
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-20 right-4', buttonVariants({ variant: 'default' }))}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create invoice
      </Link>
      <motion.div {...animateBasicMotionOpacity()} className="flex flex-col w-full gap-4 pb-24">
        {isLoading ? (
          <>
            <InvoiceSkeletonLoader />
            <InvoiceSkeletonLoader />
            <InvoiceSkeletonLoader />
            <InvoiceSkeletonLoader />
          </>
        ) : invoices.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">No invoices found</div>
        ) : (
          invoices.map((invoice) => <InvoiceCard invoice={invoice} key={`invoice-list-${invoice?.id}-${invoice?.status}`} />)
        )}
        {!isLoading && total > 0 && (
          <div className="flex items-center justify-between pt-2 pb-4 px-1">
            <span className="text-xs text-muted-foreground">
              {total} invoice{total !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
```

---
