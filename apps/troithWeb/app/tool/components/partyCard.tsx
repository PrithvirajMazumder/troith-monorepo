import { Party } from '@troithWeb/__generated__/graphql'
import { cn } from '@troith/shared/lib/util'
import { Avatar, AvatarFallback, Badge, H4, Separator } from '@troith/shared'
import { CheckCircle } from 'lucide-react'

type Props = {
  party: Party
  onSelect?: (party: Party) => void
  isSelected?: boolean
}

export const PartyCardSkeletonLoader = () => {
  return (
    <div className="p-3 w-full border rounded-lg">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-200 h-10 w-10" />
        <div className="flex-1 space-y-4 py-1">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    </div>
  )
}

export const PartyCard = ({ party, onSelect, isSelected = false }: Props) => {
  return (
    <div
      onClick={() => onSelect && onSelect(party)}
      className={cn('flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all w-full', `hover:bg-zinc-800/10`)}
    >
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-4 w-full">
          <Avatar>
            <AvatarFallback>{party?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <H4 className="font-semibold">{party?.name}</H4>
            <div className="flex items-center gap-2 h-4 mb-2">
              <div className="text-xs font-medium">GSTIN: {party?.gstin}</div>
              <Separator orientation="vertical" />
              <div className="text-xs font-medium">State: {party?.state}</div>
            </div>
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
