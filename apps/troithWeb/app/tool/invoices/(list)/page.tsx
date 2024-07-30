'use client'
import { useSuspenseQuery } from '@apollo/client'
import { InvoiceQueries } from '@troithWeb/app/tool/invoices/queries/invoiceQueries'
import { InvoiceCard } from '@troithWeb/app/tool/components/invoiceCard'
import { Plus } from 'lucide-react'
import { buttonVariants } from '@troith/shared'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'

export default function Invoices() {
  const { data: invoiceData } = useSuspenseQuery(InvoiceQueries.allByCompanyId, {
    variables: { companyId: '658db32a6cf334fc362c9cad' }
  })

  return (
    <>
      <Link
        href="/tool/invoices/create"
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-20 right-4', buttonVariants({ variant: 'default' }))}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create invoice
      </Link>
      <div className="flex flex-col w-full gap-4 pb-24">
        {invoiceData?.invoices?.map((invoice) => (
          <InvoiceCard invoice={invoice} key={`invoice-list-${invoice?.id}`} />
        ))}
      </div>
    </>
  )
}
