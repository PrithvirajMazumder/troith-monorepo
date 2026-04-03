# Invoice Search, Filter & Pagination

## Overview

Make the invoice list's search box, status filter, and pagination functional. All state is driven by URL query params so filters are shareable and bookmarkable. Search is debounced client-side. The API and repository handle filtering and pagination server-side.

## URL Query Params

```
/tool/invoices?search=acme&status=DRAFT,CONFIRMED&page=1&limit=20
```

| Param    | Type             | Default  | Description                                              |
|----------|------------------|----------|----------------------------------------------------------|
| `search` | string           | `""`     | Filters by party name (contains, case-insensitive) or invoice number |
| `status` | comma-separated  | `""` (all) | Multi-select: `DRAFT,CONFIRMED,PAID,PARTIALLY_PAID,GST_SUBMITTED` |
| `page`   | number           | `1`      | Current page                                             |
| `limit`  | number           | `20`     | Items per page (fixed, no UI selector)                   |

Changing `search` or `status` resets `page` to 1.

## Repository Layer

New method on `InvoiceRepository`: `findByCompanyIdWithFilters`

**Parameters:** `{ companyId: string, search?: string, statuses?: InvoiceStatus[], page: number, limit: number }`

**Prisma query:**
- `where.companyId` — always applied
- `where.status` — `{ in: statuses }` when statuses array is non-empty
- `where.OR` — when search is non-empty:
  - `{ party: { name: { contains: search, mode: 'insensitive' } } }`
  - `{ no: parsedNumber }` (only if search parses to a valid integer)
- `orderBy: { createdAt: 'desc' }`
- `skip: (page - 1) * limit`
- `take: limit`

**Returns:** `{ invoices: InvoiceType[], total: number }` (total via `prisma.invoice.count` with same where clause)

## API Route

**File:** `app/api/invoices/company/[slug]/route.ts`

Update `GET` handler to:
1. Parse `searchParams` from `request.nextUrl.searchParams`: `search`, `status`, `page`, `limit`
2. Split `status` string by comma into array (filter empty strings)
3. Parse `page` (default 1) and `limit` (default 20) as integers
4. Call `invoiceRepository.findByCompanyIdWithFilters({ companyId, search, statuses, page, limit })`
5. Return `{ invoices: serialized[], total: number }`

## Client: Layout (Search + Status Filter)

**File:** `app/tool/invoices/(list)/layout.tsx`

Add `'use client'` directive. Wire up:

### Search Input
- Controlled `useState` for immediate input value
- `useDebounce(searchValue, 300)` from `@troith/shared`
- On debounced value change, push to URL: `router.replace()` with updated `search` param, reset `page` to 1
- On mount, initialize input value from `searchParams.get('search')`

### Status Multi-Select Dropdown
- Maintain selected statuses from URL param `status` (split by comma)
- Show all 5 statuses: Draft, Confirmed, Paid, Partially Paid, GST Submitted
- Each item has a checkmark icon when selected
- Toggling a status updates the `status` URL param and resets `page` to 1
- Selected statuses shown as count badge on the trigger button (e.g., "Status | 2 selected")
- When no statuses selected, no filter applied (show all)

## Client: Page (Data Fetching + Pagination)

**File:** `app/tool/invoices/(list)/(all)/page.tsx`

### Data Fetching
- Read `search`, `status`, `page`, `limit` from `useSearchParams()`
- Fetch function: `GET /api/invoices/company/${companyId}?search=&status=&page=&limit=`
- React Query key: `invoicesKeys.lists(companyId, { search, status, page, limit })`
- Response type: `{ invoices: InvoiceType[], total: number }`

### Pagination UI
- Rendered below the invoice list
- Previous / Next buttons (disabled at boundaries)
- "Page X of Y" display
- Total invoice count display

## Query Keys Update

**File:** `app/tool/queryKeys/invoices.ts`

Update `lists` to accept filter params:
```ts
lists: (companyId: string, filters?: { search?: string, status?: string, page?: number, limit?: number }) =>
  [...invoicesKeys.all, 'lists', companyId, filters] as const
```

## Files Changed

1. `apps/troithWeb/repositories/invoice.repository.ts` — add `findByCompanyIdWithFilters`
2. `apps/troithWeb/app/api/invoices/company/[slug]/route.ts` — parse searchParams, use new method, new response shape
3. `apps/troithWeb/app/tool/invoices/(list)/layout.tsx` — `'use client'`, search input with debounce, multi-select status filter, URL sync
4. `apps/troithWeb/app/tool/invoices/(list)/(all)/page.tsx` — read params, paginated fetch, pagination UI
5. `apps/troithWeb/app/tool/queryKeys/invoices.ts` — update `lists` key signature

## Error Handling

- Invalid `page`/`limit` params fall back to defaults (1 and 20)
- Empty search or no statuses selected returns unfiltered results
- Existing error handling in the API route remains unchanged
