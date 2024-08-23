import { Bank } from '@troithWeb/__generated__/graphql'
import { cn } from '@troith/shared/lib/util'
import { Avatar, AvatarFallback, Badge, H4, P, Separator } from '@troith/shared'
import { CheckCircle, Landmark } from 'lucide-react'
import React from 'react'
import { EntityCardProps } from '@troithWeb/app/tool/components/types/EntityCardProps'

type Props = {
  shouldShowAvatar?: boolean
  isCompact?: boolean
} & EntityCardProps<Bank>

export const BankCard = ({ onSelect, entity: bank, isSelected = false, shouldShowAvatar = false, isCompact = false }: Props) => {
  return (
    <div
      onClick={() => onSelect(bank)}
      className={cn('flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all w-full', `hover:bg-zinc-800/10`)}
    >
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start flex-col gap-1 w-full">
          {isCompact ? (
            <h5 className="text-lg font-semibold capitalize">{bank?.name}</h5>
          ) : (
            <div className="flex gap-4 items-center">
              {shouldShowAvatar && (
                <Avatar>
                  <AvatarFallback className="font-bold">
                    <Landmark />
                  </AvatarFallback>
                </Avatar>
              )}
              <H4 className="font-semibold capitalize">{bank?.name}</H4>
            </div>
          )}
          {!isCompact && <Separator className="my-2" />}
          <p className={cn('font-semibold', { 'text-xs': isCompact })}>Account number: {bank?.accountNumber}</p>
          <div className={cn('flex items-center gap-2 h-4 mb-2', { 'text-xs text-muted-foreground': isCompact })}>
            <div className="text-xs font-medium">IFSC: {bank?.ifsc}</div>
            <Separator orientation="vertical" />
            <div className="text-xs font-medium capitalize">Branch: {bank?.branch}</div>
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
