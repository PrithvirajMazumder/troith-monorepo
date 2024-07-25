'use client'
import { useSuspenseQuery } from '@apollo/client'
import { InvoiceQueries } from '@troithWeb/app/tool/invoices/queries/invoiceQueries'
import { InvoiceCard } from '@troithWeb/app/tool/invoices/components/invoiceCard'

export default function Invoices() {
  const { data: invoiceData } = useSuspenseQuery(InvoiceQueries.allByCompanyId, {
    variables: { companyId: '658db32a6cf334fc362c9cad' }
  })

  return (
    <div className="flex flex-col w-full gap-4">
      {invoiceData?.invoices?.map((invoice) => (
        <InvoiceCard invoice={invoice} key={`invoice-list-${invoice?.id}`} />
      ))}
    </div>
  )
}
