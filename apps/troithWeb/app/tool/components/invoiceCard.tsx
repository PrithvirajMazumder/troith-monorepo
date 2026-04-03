import { cn } from '@troith/shared/lib/util'
import { Badge, H4, Separator } from '@troith/shared'
import { format } from 'date-fns'
import Link from 'next/link'
import { Invoice, InvoiceItem, InvoiceStatus, Party, Tax, Bank } from '@prisma/client'

const formatDateSafe = (date: unknown): string => {
  if (!date) return '-'
  const parsed = new Date(date as string)
  return isNaN(parsed.getTime()) ? '-' : format(parsed, 'dd/MM/yyyy')
}

type Props = {
  invoice: Invoice & { party: Party; InvoiceItem: (InvoiceItem & { item: any })[]; tax: Tax; bank: Bank }
}

export const InvoiceSkeletonLoader = () => {
  return (
    <div className="bg-background rounded-lg p-3 animate-pulse border">
      <div className="flex justify-between items-center mb-2">
        <div className="h-4 bg-gray-200 dark:bg-zinc-900 rounded w-1/3" />
      </div>
      <div className="h-3 bg-gray-200 dark:bg-zinc-900 rounded w-1/4 mb-2" />
      <div className="flex gap-2">
        <div className="h-3 bg-gray-200 dark:bg-zinc-900 rounded w-1/6" />
        <div className="h-3 bg-gray-200 dark:bg-zinc-900 rounded w-1/6" />
      </div>
    </div>
  )
}

export const InvoiceCard = ({ invoice }: Props) => {
  return (
    <Link href={`/tool/invoices/${invoice.id}`} className="block">
      <div
        className={cn(
          'flex flex-col w-full gap-1 rounded-lg border p-3 text-left text-sm transition-all',
          {
            'bg-orange-500/5 dark:bg-orange-800/10 hover:bg-orange-500/10 dark:hover:bg-orange-800/20':
              invoice?.status === InvoiceStatus.DRAFT || invoice?.status === InvoiceStatus.PARTIALLY_PAID,
            'bg-blue-500/5 dark:bg-blue-800/10 hover:bg-blue-500/10 dark:hover:bg-blue-800/20': invoice?.status === InvoiceStatus.CONFIRMED,
            'bg-green-500/5 dark:bg-green-800/10 hover:bg-green-500/10 dark:hover:bg-green-800/20': invoice?.status === InvoiceStatus.PAID,
            'bg-purple-500/5 dark:bg-purple-800/10 hover:bg-purple-500/10 dark:hover:bg-purple-800/20': invoice?.status === InvoiceStatus.GST_SUBMITTED
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
            <div className="text-xs font-medium">{formatDateSafe(invoice?.date)}</div>
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
              { 'bg-green-100/50 border-green-200/50 dark:bg-green-950': invoice?.status === InvoiceStatus.PAID },
              { 'bg-blue-100/50 border-blue-200/50 dark:bg-blue-950': invoice?.status === InvoiceStatus.CONFIRMED },
              { 'bg-orange-100/50 border-orange-200/50 dark:bg-orange-950': invoice?.status === InvoiceStatus.DRAFT },
              { 'bg-orange-100/50 border-orange-200/50 dark:bg-orange-950': invoice?.status === InvoiceStatus.PARTIALLY_PAID },
              { 'bg-purple-100/50 border-purple-200/50 dark:bg-purple-950': invoice?.status === InvoiceStatus.GST_SUBMITTED }
            )}
          >
            {invoice?.status}
          </Badge>
          <div className="ml-auto text-xs font-semibold">
            {invoice?.tax && (
              <>
                CGST: {invoice?.tax?.cgst}% | SGST: {invoice?.tax?.sgst}%
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
