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
    <header className="border-b px-4 h-16 flex items-center gap-2">
      <Input
        placeholder={searchPlaceholder ?? 'Search...'}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-8 w-6xl shadow-sm"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="shadow-sm border-dashed h-8 border">
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
    </header>
  )
}
