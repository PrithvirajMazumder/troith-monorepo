'use client'
import { cn } from '@troith/shared/lib/util'
import { Avatar, AvatarFallback, Badge, H4 } from '@troith/shared'
import { CheckCircle } from 'lucide-react'
import { Uom } from '@troithWeb/__generated__/graphql'
import { EntityCardProps } from '@troithWeb/app/tool/components/types/EntityCardProps'

export const UomCard = ({ entity: party, onSelect, isSelected = false }: EntityCardProps<Uom>) => {
  return (
    <div
      onClick={() => onSelect && onSelect(party)}
      className={cn('flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all w-full', `hover:bg-zinc-800/10`)}
    >
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-4 w-full">
          <Avatar>
            <AvatarFallback>{party?.abbreviation?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <H4 className="font-semibold capitalize">{party?.name}</H4>
            <p className="italic uppercase">({party?.abbreviation})</p>
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
