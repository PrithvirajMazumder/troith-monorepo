'use client'
import { Button, H3 } from '@troith/shared'
import { InvoiceItem } from '@troithWeb/__generated__/graphql'
import { cn } from '@troith/shared/lib/util'
import { ChevronRight } from 'lucide-react'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import { useRouter } from 'next/navigation'
import { ConfigureInvoiceItemCard } from '@troithWeb/app/tool/components/configureInvoiceItemCard'

export default function ConfigureInvoiceItems() {
  const { selectedItems } = useCreateInvoice()
  const router = useRouter()

  return (
    <>
      <H3 className="mb-4">Configure Invoice Items</H3>
      <div className="flex flex-col gap-3 mt-4">
        {selectedItems?.map((item) => {
          const invoiceItem: InvoiceItem = {
            item,
            price: 0,
            quantity: 0
          }
          return <ConfigureInvoiceItemCard onItemUpdate={() => {}} {...{ invoiceItem }} key={item?.id} />
        })}
      </div>
      <Button
        disabled={!selectedItems?.length}
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-32 right-4')}
        variant="default"
        onClick={() => {
          router.push('/tool/invoices/create/configure-invoice-items')
        }}
      >
        Continue
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </>
  )
}
