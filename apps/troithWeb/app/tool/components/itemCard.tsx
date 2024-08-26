import { Item } from '@troithWeb/__generated__/graphql'
import { cn } from '@troith/shared/lib/util'
import { Badge, H4, Separator } from '@troith/shared'
import { CheckCircle } from 'lucide-react'
import React from 'react'
import { EntityCardProps } from '@troithWeb/app/tool/components/types/EntityCardProps'

export const ItemCardSkeletonLoader = () => {
  return (
    <div className="p-3 w-full border bg-background rounded-lg">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-zinc-900 rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-zinc-900 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

export const ItemCard = ({ onSelect, isSelected = false, entity: item }: EntityCardProps<Item>) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className={cn('flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all w-full', `hover:bg-zinc-800/10`)}
    >
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start flex-col gap-1 w-full">
          <H4 className="font-semibold">{item?.name}</H4>
          <div className="flex items-center gap-2 h-4 mb-2">
            <div className="text-xs font-medium">HSN: {item?.hsn}</div>
            <Separator orientation="vertical" />
            <div className="text-xs font-medium">UOM: {item?.uom?.abbreviation}</div>
          </div>
        </div>
      </div>
      {isSelected && (
        <Badge variant="outline">
          <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
          Selected
        </Badge>
      )}
    </div>
  )
}
