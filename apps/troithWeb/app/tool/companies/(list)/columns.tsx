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
