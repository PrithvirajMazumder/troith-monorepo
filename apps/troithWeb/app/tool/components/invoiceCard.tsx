import { cn } from '@troith/shared/lib/util'
import { Badge, H4, Separator } from '@troith/shared'
import { format } from 'date-fns'
import { Invoice, InvoiceStatus } from '@troithWeb/__generated__/graphql'
import Link from 'next/link'

type Props = {
  invoice: Invoice
}

export const InvoiceCard = ({ invoice }: Props) => {
  const getInvoiceStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.Confirmed:
        return 'blue'
      case InvoiceStatus.Draft:
        return 'zinc'
      case InvoiceStatus.Paid:
        return 'green'
      default:
        return 'zinc'
    }
  }

  return (
    <Link
      href={`/tool/invoices/${invoice.id}`}
      className={cn(
        'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all w-full',
        `bg-${getInvoiceStatusColor(invoice.status)}-500/5 dark:bg-${getInvoiceStatusColor(invoice.status)}-800/5`,
        `hover:bg-${getInvoiceStatusColor(invoice.status)}-500/10 dark:hover:bg-${getInvoiceStatusColor(invoice.status)}-800/10`
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
          <div className="text-xs font-medium">{invoice?.invoiceItems?.length} Items</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={cn(`bg-${getInvoiceStatusColor(invoice.status)}-100 dark:bg-${getInvoiceStatusColor(invoice.status)}-950`)}
        >
          {invoice?.status}
        </Badge>
        <Badge variant="outline">
          {invoice?.invoiceItems
            ?.reduce((acc, currentValue) => acc + currentValue?.quantity * currentValue?.price, 0)
            .toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR'
            })}
        </Badge>
      </div>
    </Link>
  )
}
