# Data Tables for Entity List Pages

Replace card-based lists with full-featured TanStack React Table + shadcn Table for Items, Banks, Taxes, UOMs, and Companies. Add server-side search, sorting, pagination, and column visibility. Parties page keeps card layout with search wired up.

## Scope

### In Scope
- Reusable `DataTable` component (TanStack Table + shadcn primitives)
- Server-side pagination, search, and sorting for 5 entities
- Column visibility toggles
- New `/tool/companies` page (full CRUD table view)
- Wire up Parties search (card layout stays)

### Out of Scope
- Detail panels (`@item/[id]`, `@bank/[id]`, etc.) — untouched
- Create/edit forms — untouched
- Invoices page — already has its own pattern
- Bulk actions, inline editing, row selection

## Architecture

### Layer Changes

| Layer | What Changes |
|-------|-------------|
| Shared UI | Add shadcn `Table` component (`table.tsx`) |
| Tool Components | New `data-table/` directory with reusable components |
| API Routes | 5 routes updated to accept `search`, `page`, `limit`, `sortBy`, `sortOrder` |
| Repositories | 5 repos get `findWithFilters()` methods |
| Query Keys | 5 key factories updated to include filter params |
| Pages | 5 pages replace cards with DataTable + column definitions |
| Layouts | Simplified — search/pagination handled by DataTable |
| New Route Group | `/tool/companies/(list)/` with parallel route for detail |

### What Stays the Same
- `ResizableTwoColumnToolLayout` for master-detail two-column view
- Detail panels and their routing
- Framer Motion entrance animations
- React Query data fetching pattern
- Company store for scoping data
- Parties card-based UI

## Reusable DataTable Components

### File Structure

```
app/tool/components/data-table/
  data-table.tsx                 -- Main DataTable wrapper
  data-table-pagination.tsx      -- Pagination controls (prev/next, page info)
  data-table-toolbar.tsx         -- Search input + column visibility dropdown
  data-table-column-header.tsx   -- Sortable column header with sort indicator
```

### DataTable Props

```typescript
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  total: number
  page: number
  limit: number
  isLoading: boolean
  onPageChange: (page: number) => void
  onSearchChange: (search: string) => void
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  searchValue?: string
  onRowClick?: (row: TData) => void
  activeRowId?: string
}
```

### Visual Layout

```
+-----------------------------------------------+
| [Search input___________]   [Columns toggle v] |
+--------+-----------+-------+----------+--------+
| Name ^ | HSN Code  | UOM   | Tax      | ...    |
+--------+-----------+-------+----------+--------+
| row 1  | ...       | ...   | ...      | ...    |
| row 2  | ...       | ...   | ...      | ...    |
| ...    |           |       |          |        |
+--------+-----------+-------+----------+--------+
| Showing 1-20 of 150       | [< Prev] [Next >] |
+-----------------------------------------------+
```

### Toolbar (`data-table-toolbar.tsx`)

- Debounced search input (300ms, using existing `useDebounce` hook)
- Column visibility dropdown (shadcn `DropdownMenu` with checkboxes)
- Search triggers URL param update which re-fetches data

### Pagination (`data-table-pagination.tsx`)

- Shows "Showing {start}-{end} of {total}" text
- Prev/Next buttons (disabled at boundaries)
- Default 20 rows per page
- Updates `page` URL param

### Column Header (`data-table-column-header.tsx`)

- Clickable to toggle sort direction (asc -> desc -> none)
- Sort indicator icon (ArrowUp/ArrowDown from lucide-react)
- Passes `sortBy` and `sortOrder` to parent callback

### Row Behavior

- Clicking a row navigates to the detail panel route (e.g., `/tool/items/[id]`)
- Active row gets `bg-muted` highlight
- `cursor-pointer` on all rows

## Column Definitions

### Items (`app/tool/items/(list)/columns.tsx`)

| Column | Field | Sortable | Notes |
|--------|-------|----------|-------|
| Name | `name` | Yes | Primary identifier |
| HSN Code | `hsn` | Yes | Numeric |
| UOM | `uom.name` | No | Relation, show `abbreviation` in parentheses |
| Tax | `tax` | No | Show computed IGST% (`cgst + sgst`) |

### Banks (`app/tool/banks/(list)/columns.tsx`)

| Column | Field | Sortable | Notes |
|--------|-------|----------|-------|
| Name | `name` | Yes | Primary identifier |
| Account No. | `accountNumber` | No | BigInt, display as string |
| IFSC | `ifsc` | Yes | |
| Branch | `branch` | Yes | |
| Holder Name | `holderName` | Yes | |

Note: Banks are user-scoped (fetched by `userId`), not company-scoped.

### Taxes (`app/tool/taxes/(list)/columns.tsx`)

| Column | Field | Sortable | Notes |
|--------|-------|----------|-------|
| IGST% | computed | Yes (by `cgst`) | Display `cgst + sgst` with "%" suffix |
| CGST% | `cgst` | Yes | With "%" suffix |
| SGST% | `sgst` | Yes | With "%" suffix |

### UOMs (`app/tool/uoms/(list)/columns.tsx`)

| Column | Field | Sortable | Notes |
|--------|-------|----------|-------|
| Name | `name` | Yes | Primary identifier |
| Abbreviation | `abbreviation` | Yes | Uppercase italic styling |

Note: UOMs are user-scoped (fetched by `userId`), not company-scoped.

### Companies (`app/tool/companies/(list)/columns.tsx`)

| Column | Field | Sortable | Notes |
|--------|-------|----------|-------|
| Name | `name` | Yes | Primary identifier |
| Legal Name | `legalName` | Yes | |
| GSTIN | `gstin` | Yes | |
| State | `state` | Yes | |
| City | `city` | Yes | |

Companies are user-scoped (fetched by `userId`).

## API Changes

### Updated Endpoint Pattern

All 5 endpoints adopt the same query param pattern:

```
GET /api/{entity}/company/{companyId}?search=...&page=1&limit=20&sortBy=name&sortOrder=asc
```

Response shape changes from array to object:

```typescript
// Before
Item[]

// After
{ data: Item[], total: number }
```

For user-scoped entities (Banks, UOMs):
```
GET /api/banks/user/{userId}?search=...&page=1&limit=20&sortBy=name&sortOrder=asc
```

### Query Param Defaults

| Param | Default | Constraints |
|-------|---------|-------------|
| `search` | `""` (no filter) | String, case-insensitive |
| `page` | `1` | Integer >= 1 |
| `limit` | `20` | Integer, max 100 |
| `sortBy` | `"name"` | Must be a valid column name |
| `sortOrder` | `"asc"` | `"asc"` or `"desc"` |

### Search Fields Per Entity

| Entity | Searchable Fields |
|--------|------------------|
| Items | `name`, `hsn` (cast to string) |
| Banks | `name`, `ifsc`, `branch`, `holderName` |
| Taxes | `cgst` (cast), `sgst` (cast) |
| UOMs | `name`, `abbreviation` |
| Companies | `name`, `legalName`, `gstin`, `state`, `city` |

### Prisma Query Pattern

Following the existing Invoice repository pattern:

```typescript
findWithFilters({ companyId, search, page, limit, sortBy, sortOrder }) {
  const where = {
    companyId,
    deletedAt: null,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        // ... other searchable fields
      ]
    })
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
```

## Repository Changes

### Updated Methods

Each repository gets a new `findWithFilters()` method. The existing `findByCompanyId()` / `findByUserId()` methods stay for backward compatibility (used elsewhere).

| Repository | New Method | Scope |
|-----------|-----------|-------|
| `item.repository.ts` | `findWithFilters()` | companyId |
| `bank.repository.ts` | `findWithFilters()` | userId |
| `tax.repository.ts` | `findWithFilters()` | companyId |
| `uom.repository.ts` | `findWithFilters()` | userId |
| `company.repository.ts` | `findWithFilters()` | userId (new file if needed) |

## Query Key Changes

### Filter Params Interface (shared)

```typescript
interface TableFilterParams {
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
```

### Updated Key Factories

```typescript
// items.ts
export const itemsKeys = {
  all: ['items'] as const,
  lists: (companyId: string, filters?: TableFilterParams) =>
    [...itemsKeys.all, 'lists', companyId, filters ?? {}],
  details: () => [...itemsKeys.all, 'detail'],
  detail: (id: string) => [...itemsKeys.details(), id]
}
```

Same pattern for banks, taxes, uoms, companies.

## Page Components

### Pattern (Items Example)

```
app/tool/items/(list)/
  page.tsx       -- Fetches data with filters, renders DataTable
  columns.tsx    -- TanStack column definitions
  default.tsx    -- Re-exports page (for parallel routing)
  layout.tsx     -- ResizableTwoColumnToolLayout (simplified)
  @item/
    default.tsx  -- Empty state
    [id]/
      page.tsx   -- Detail panel (untouched)
```

### Page Component Flow

1. Read URL search params (`search`, `page`, `limit`, `sortBy`, `sortOrder`)
2. Fetch data via React Query with filter params
3. Render `<DataTable>` with columns, data, total, and callback handlers
4. Callbacks update URL params via `router.replace()`

### Layout Simplification

Current layouts have an unconnected search input in a header bar. After this change:
- Search moves inside `DataTable` toolbar
- Layout just renders `ResizableTwoColumnToolLayout` with `{children}` and detail slot
- Header bar removed (or kept empty for consistent spacing)

## New Companies Page

### Route Structure

```
app/tool/companies/
  (list)/
    layout.tsx         -- ResizableTwoColumnToolLayout
    page.tsx           -- DataTable with company columns
    default.tsx        -- Re-exports page
    columns.tsx        -- Column definitions
    loading.tsx        -- Skeleton loader
    @company/
      default.tsx      -- Empty state ("Select a company")
      [id]/
        page.tsx       -- Company detail panel
        loading.tsx    -- Detail skeleton
```

### API Route

```
app/api/companies/user/[slug]/route.ts   -- GET with filters
```

### Repository

Either add to an existing company repository or create `company.repository.ts` with `findWithFilters()`.

### Navigation

Add "Companies" to the sidebar navigation in the tool layout (alongside Items, Parties, etc.).

## Parties Page (Card Layout - Search Only)

Parties keeps its card-based UI. Changes:
- Wire up the existing search input in the layout to filter via URL params
- Update the Parties API route to accept `search` param
- Update the Party repository with search support
- No table, no column visibility, no sorting

## Styling

### Table Styling (matching app design language)

- Table uses shadcn primitives with existing theme colors
- Row hover: `hover:bg-muted/50` (consistent with card hover pattern)
- Active row: `bg-muted`
- Header: `bg-muted/50` with `text-muted-foreground` and `font-medium text-xs`
- Borders: standard `border-b` between rows
- Cell padding: `px-4 py-3`
- Text: `text-sm` body text
- Empty state: centered message when no results

### Loading State

Skeleton rows matching table structure (not card skeletons). Use `animate-pulse` divs in table cells.

### Responsive Behavior

Tables stay within the left column of the resizable layout. Horizontal scrolling within the table if columns overflow. Column visibility toggle helps users manage which columns show in narrow widths.

## Dependencies

### New Package

```
@tanstack/react-table  -- Already using @tanstack/react-query, same ecosystem
```

### New shadcn Component

```
shared/src/components/ui/table.tsx  -- shadcn Table primitives
```

Generated via `npx shadcn-ui add table` or manually from shadcn docs. Exports:
- `Table`, `TableHeader`, `TableBody`, `TableFooter`
- `TableHead`, `TableRow`, `TableCell`, `TableCaption`

## Migration Notes

- Existing `findByCompanyId()` / `findByUserId()` methods stay in repositories (used by create forms, invoice creation, etc.)
- Card components (`ItemCard`, `BankCard`, `TaxCard`, `UomCard`) can be left in place (no need to delete, they may be used elsewhere)
- The `default.tsx` files that re-export `page.tsx` stay for Next.js parallel routing

## Success Criteria

- All 5 entity pages render data in shadcn tables within the existing two-column layout
- Search filters data server-side with debounced input
- Columns are sortable with visual indicators
- Column visibility toggle works
- Pagination shows correct counts and navigates between pages
- Clicking a row opens the detail panel on the right
- Active row is visually highlighted
- Loading states show skeleton rows
- Empty states show a message when no data or no search results
- Parties search works with card layout
- Companies page is fully functional at `/tool/companies`
- No regressions in existing detail panels or create flows
