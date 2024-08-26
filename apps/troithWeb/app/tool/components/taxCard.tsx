import { Tax } from '@troithWeb/__generated__/graphql'
import { cn } from '@troith/shared/lib/util'
import { Avatar, AvatarFallback, Badge, H4, Separator } from '@troith/shared'
import { CheckCircle, PercentDiamond } from 'lucide-react'
import React from 'react'
import { EntityCardProps } from '@troithWeb/app/tool/components/types/EntityCardProps'

type Props = {
  shouldShowAvatar?: boolean
  titleClassName?: string
} & EntityCardProps<Tax>

export const UomCardSkeletonLoader = () => {
  return (
    <div className="p-3 w-full bg-background border rounded-lg">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-200 dark:bg-zinc-900 h-10 w-10" />
        <div className="flex-1 space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-zinc-900 rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}

export const TaxCard = ({ onSelect, entity: tax, isSelected = false, shouldShowAvatar = false, titleClassName }: Props) => {
  return (
    <div
      onClick={() => onSelect(tax)}
      className={cn('flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all w-full', `hover:bg-zinc-800/10`)}
    >
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start flex-col gap-1 w-full">
          <div className="flex gap-4 items-center mb-2">
            {shouldShowAvatar && (
              <Avatar>
                <AvatarFallback className="font-bold">
                  <PercentDiamond />
                </AvatarFallback>
              </Avatar>
            )}
            <H4 className={cn('font-semibold', titleClassName)}>IGST: {tax.cgst + tax.sgst}%</H4>
          </div>
          <div className={cn('flex items-center gap-2 h-4 mb-2', { 'ml-2': shouldShowAvatar })}>
            <div className="text-xs font-medium">CGST: {tax?.cgst}%</div>
            <Separator orientation="vertical" />
            <div className="text-xs font-medium">SGST: {tax?.sgst}%</div>
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
