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
