import { cn } from '@troith/shared/lib/util'
import { Button, H4, Input, Separator } from '@troith/shared'
import { useEffect, useState } from 'react'
import { convertAmountToInr } from '@troithWeb/utils/currency'
import { EqualIcon, X } from 'lucide-react'
import { BlankInvoiceItemType } from '@troithWeb/types/invoices'
import { Prisma } from '@prisma/client'

type Props = {
  invoiceItem: BlankInvoiceItemType
  onItemUpdate: (invoiceItem: BlankInvoiceItemType) => void
}

export const ConfigureInvoiceItemSkeletonLoaderCard = () => {
  return (
    <div className="p-3 w-full border rounded-lg">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="flex space-x-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/6"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  )
}

export const ConfigureInvoiceItemCard = ({ invoiceItem, ...props }: Props) => {
  const [quantity, setQuantity] = useState<number | null>(parseInt(`${invoiceItem.quantity}`) > 0 ? parseInt(`${invoiceItem.quantity}`) : null)
  const [price, setPrice] = useState<number | null>(parseInt(`${invoiceItem.price}`) > 0 ? parseInt(`${invoiceItem.price}`) : null)

  useEffect(() => {
    if (price && quantity && (price ?? 0) * (quantity ?? 0) > 0) {
      props.onItemUpdate({ ...invoiceItem, price: new Prisma.Decimal(price), quantity: BigInt(quantity) })
    }
  }, [price, quantity])

  return (
    <div className={cn('flex items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all w-full')}>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start flex-col gap-1 w-full">
          <H4 className="font-semibold">{invoiceItem?.item?.name}</H4>
          <div className="flex items-center gap-2 h-4 mb-2">
            <div className="text-xs font-medium">HSN: {invoiceItem?.item?.hsn}</div>
            <Separator orientation="vertical" />
            <div className="text-xs font-medium">UOM: {invoiceItem?.item?.uom?.abbreviation}</div>
          </div>
          <div className="flex items-center gap-2 h-4 mb-2 w-full mt-2">
            <div className="relative">
              <p className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-8 z-10 capitalize text-xs border-l px-2 flex items-center justify-center">
                {invoiceItem?.item?.uom?.abbreviation}
              </p>
              <Input
                value={`${quantity !== null ? quantity : ''}`}
                onChange={(event) => setQuantity(parseInt(event.target.value))}
                type="number"
                className="pr-10 h-8 w-28"
              />
            </div>
            <X className="h-4 w-4" />
            <div className="relative">
              <p className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 z-10 uppercase border-r px-2 flex items-center justify-center">₹</p>
              <Input
                value={`${convertAmountToInr(price !== null ? price : '', false).replace('.00', '')}`}
                onChange={(event) => {
                  const price = parseInt(event.target.value.replace(',', ''))
                  setPrice(!isNaN(price) ? price : null)
                }}
                className="pl-8 h-8 w-28"
              />
            </div>
            <EqualIcon className="h-4 w-4" />
            <Button className="h-8 border-dashed border shadow-sm" tabIndex={-1} variant="ghost">
              Total:{' '}
              {convertAmountToInr(
                (() => {
                  const total = (quantity ?? 0) * (price ?? 0)
                  return isNaN(total) ? 0 : total
                })()
              ).replace('.00', '')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
