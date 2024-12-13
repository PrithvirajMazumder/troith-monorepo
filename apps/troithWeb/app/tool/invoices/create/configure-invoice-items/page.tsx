'use client'
import { Button } from '@troith/shared'
import { InvoiceItem } from '@troithWeb/__generated__/graphql'
import { cn } from '@troith/shared/lib/util'
import { ChevronRight } from 'lucide-react'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import { ConfigureInvoiceItemCard } from '@troithWeb/app/tool/components/configureInvoiceItemCard'
import { useState } from 'react'
import { CreateInvoicePagesHeader } from '@troithWeb/app/tool/invoices/create/components/createInvoicePagesHeader'
import { useRouter } from 'next-nprogress-bar'
import { BlankInvoiceItemType } from '@troithWeb/types/invoices'
import { Prisma } from '@prisma/client'

export default function ConfigureInvoiceItems() {
  const { selectedItems, setInvoiceItems: setSelectedInvoiceItems, invoiceItems: previouslyInvoiceItems } = useCreateInvoice()
  const [invoiceItems, setInvoiceItems] = useState<BlankInvoiceItemType[]>(
    (() => {
      const isExistingInvoiceItem = previouslyInvoiceItems.some(
        (previouslyInvoiceItem) => !!selectedItems?.find((selectedItem) => selectedItem.id !== previouslyInvoiceItem?.item?.id)
      )
      if (!previouslyInvoiceItems?.length || isExistingInvoiceItem) {
        return selectedItems.map((selectedItem) => ({
          item: selectedItem,
          price: new Prisma.Decimal(0),
          quantity: BigInt(0)
        }))
      }
      return previouslyInvoiceItems
    })()
  )
  const router = useRouter()

  return (
    <>
      <CreateInvoicePagesHeader title="Configure Invoice Items" subtitle="Please add the quantity and price to the items that have been selected." />
      <div className="flex flex-col gap-3">
        {invoiceItems?.map((invoiceItem, index) => {
          return (
            <ConfigureInvoiceItemCard
              onItemUpdate={(invoiceItem) => {
                setInvoiceItems((invoiceItems) => {
                  invoiceItems[index] = invoiceItem

                  return [...invoiceItems]
                })
              }}
              {...{ invoiceItem }}
              key={invoiceItem?.item?.id}
            />
          )
        })}
      </div>
      <Button
        disabled={invoiceItems.some((invoiceItem) => invoiceItem.price.times(invoiceItem.quantity.toString()) <= new Prisma.Decimal(0))}
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-32 right-4')}
        variant="default"
        onClick={() => {
          setSelectedInvoiceItems([...invoiceItems])
          router.push(
            '/tool/invoices/create/finalize-invoice',
            {},
            {
              showProgressBar: true
            }
          )
        }}
      >
        Continue
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </>
  )
}
