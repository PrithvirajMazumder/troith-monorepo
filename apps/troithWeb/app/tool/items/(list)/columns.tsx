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
