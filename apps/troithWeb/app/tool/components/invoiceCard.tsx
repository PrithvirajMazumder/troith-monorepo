import { cn } from '@troith/shared/lib/util'
import { Badge, H4, Separator } from '@troith/shared'
import { format } from 'date-fns'
import Link from 'next/link'
import { Invoice, InvoiceItem, InvoiceStatus, Party } from '@prisma/client'

type Props = {
  invoice: Invoice & { party: Party; InvoiceItem: (InvoiceItem & { item: any })[] }
}

export const InvoiceSkeletonLoader = () => {
  return (
    <div className="bg-background rounded-lg p-3 animate-pulse border">
      <div className="flex justify-between items-center mb-2">
        <div className="h-4 bg-gray-200 dark:bg-zinc-900 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-zinc-900 rounded-full w-1/6" />
      </div>
      <div className="flex justify-between items-center mb-2">
        <div className="h-2 bg-gray-200 dark:bg-zinc-900 rounded w-1/4" />
      </div>
      <div className="h-4 bg-transparent rounded w-1/5 mb-3" />
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-200 dark:bg-zinc-900 rounded-full w-20" />
        <div className="h-4 bg-gray-200 dark:bg-zinc-900 rounded-full w-20" />
      </div>
    </div>
  )
}

export const InvoiceCard = ({ invoice }: Props) => {
  return (
    <Link
      href={`/tool/invoices/${invoice.id}`}
      className={cn(
        'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all w-full',
        {
          'bg-blue-500/5 dark:border-blue-500/30 dark:bg-blue-800/10 dark:hover:bg-blue-800/20 hover:bg-blue-500/10':
            invoice.status === InvoiceStatus.CONFIRMED
        },
        {
          'bg-orange-500/5 dark:border-orange-500/30 dark:bg-orange-800/10 dark:hover:bg-orange-800/20 hover:bg-orange-500/10':
            invoice.status === InvoiceStatus.DRAFT
        },
        {
          'bg-green-500/5 dark:border-green-500/30 dark:bg-green-800/10 dark:hover:bg-green-800/20 hover:bg-green-500/10':
            invoice.status === InvoiceStatus.PAID
        }
      )}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2 w-full">
            <H4 className="font-semibold">{invoice?.party?.name}</H4>
            <div className="ml-auto text-xs">No: {invoice?.no}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 h-4 mb-2">
          <div className="text-xs font-medium">{format(invoice?.date, 'dd/MM/yyyy')}</div>
          {invoice?.vehicleNumber?.length ? (
            <>
              <Separator orientation="vertical" />
              <div className="text-xs font-medium">{invoice?.vehicleNumber}</div>
            </>
          ) : null}
          <Separator orientation="vertical" />
          <div className="text-xs font-medium">{invoice?.InvoiceItem?.length} Items</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={cn(
            'capitalize',
            { 'bg-green-100/50  border-green-200/50 dark:bg-green-950': invoice?.status === InvoiceStatus.PAID },
            { 'bg-orange-100/50 border-orange-200/50 dark:bg-orange-950': invoice?.status === InvoiceStatus.DRAFT },
            { 'bg-blue-100/50 0 border-blue-200/50 dark:bg-blue-950': invoice?.status === InvoiceStatus.CONFIRMED }
          )}
        >
          {invoice?.status?.toLowerCase()}
        </Badge>
        <Badge variant="outline">
          {invoice?.InvoiceItem?.reduce(
            (acc, currentValue) => acc + parseInt(`${currentValue?.quantity}`) * parseInt(`${currentValue?.price}`),
            0
          ).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR'
          })}
        </Badge>
      </div>
    </Link>
  )
}
