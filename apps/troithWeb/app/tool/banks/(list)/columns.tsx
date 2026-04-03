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
