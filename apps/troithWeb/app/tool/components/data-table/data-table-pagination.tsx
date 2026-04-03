'use client'
import { Button } from '@troith/shared'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DataTablePaginationProps {
  page: number
  limit: number
  total: number
  onPageChange: (page: number) => void
}

export function DataTablePagination({ page, limit, total, onPageChange }: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <span className="text-xs text-muted-foreground">
        {total === 0 ? 'No results' : `Showing ${start}-${end} of ${total}`}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-7 w-7" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button variant="outline" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
