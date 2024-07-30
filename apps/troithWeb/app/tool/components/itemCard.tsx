import { Item } from '@troithWeb/__generated__/graphql'
import { cn } from '@troith/shared/lib/util'
import { Avatar, AvatarFallback, Badge, H4, Separator } from '@troith/shared'
import { CheckCircle } from 'lucide-react'
import React from 'react'

export type Props = {
  item: Item
  onSelect: (item: Item) => void
  isSelected?: boolean
}

export const ItemCard = ({ onSelect, isSelected = false, item }: Props) => {
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