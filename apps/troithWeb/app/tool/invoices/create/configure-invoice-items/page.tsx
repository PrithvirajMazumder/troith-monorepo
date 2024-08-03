'use client'
import { Button, H3 } from '@troith/shared'
import { InvoiceItem } from '@troithWeb/__generated__/graphql'
import { cn } from '@troith/shared/lib/util'
import { ChevronRight } from 'lucide-react'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import { useRouter } from 'next/navigation'
import { ConfigureInvoiceItemCard } from '@troithWeb/app/tool/components/configureInvoiceItemCard'
import { useState } from 'react'
import { CreateInvoicePagesHeader } from '@troithWeb/app/tool/invoices/create/components/createInvoicePagesHeader'

export default function ConfigureInvoiceItems() {
  const { selectedItems, setInvoiceItems: setSelectedInvoiceItems } = useCreateInvoice()
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(
    selectedItems.map((selectedItem) => ({
      item: selectedItem,
      price: 0,
      quantity: 0
    }))
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
        disabled={invoiceItems.some((invoiceItem) => invoiceItem.quantity * invoiceItem.price <= 0)}
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-32 right-4')}
        variant="default"
        onClick={() => {
          setSelectedInvoiceItems([...invoiceItems])
          router.push('/tool/invoices/create/finalize-invoice')
        }}
      >
        Continue
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </>
  )
}
