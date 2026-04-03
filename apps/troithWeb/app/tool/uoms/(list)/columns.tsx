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
