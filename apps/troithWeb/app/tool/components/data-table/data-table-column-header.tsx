'use client'
import { Column } from '@tanstack/react-table'
import { cn } from '@troith/shared/lib/util'
import { Button } from '@troith/shared'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  onSortChange,
  sortBy,
  sortOrder
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  const isActive = sortBy === column.id
  const nextOrder = isActive && sortOrder === 'asc' ? 'desc' : 'asc'

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => onSortChange?.(column.id, nextOrder)}
      >
        <span>{title}</span>
        {isActive ? (
          sortOrder === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUp className="ml-2 h-4 w-4" />
          )
        ) : (
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
