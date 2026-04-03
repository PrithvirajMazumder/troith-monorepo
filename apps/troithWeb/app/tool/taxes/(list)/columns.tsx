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
