'use client'
import { InvoiceCard } from '@troithWeb/app/tool/components/invoiceCard'
import { Plus } from 'lucide-react'
import { buttonVariants } from '@troith/shared'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { useEffect, useState } from 'react'
import { Invoice, InvoiceItem, Party } from '@prisma/client'
import InvoicesProgress from '@troithWeb/app/tool/invoices/(list)/loading'

export default function Invoices() {
  const { selectedCompany } = useCompanyStore()
  const [invoices, setInvoices] = useState<Array<Invoice & { party: Party; InvoiceItem: (InvoiceItem & { item: any })[] }>>([])
  const [isInvoicesFetching, setIsInvoicesFetching] = useState(true)

  const fetchInvoices = async (companyId: string) => {
    setIsInvoicesFetching(true)
    const resp = await fetch(`/api/invoices/${companyId}`)
    const invoices = await resp.json()
    setInvoices(invoices)
    setIsInvoicesFetching(false)
  }

  useEffect(() => {
    if (selectedCompany) {
      void fetchInvoices(selectedCompany.id)
    }
  }, [selectedCompany])

  if (isInvoicesFetching) {
    return <InvoicesProgress />
  }

  return (
    <AnimatePresence>
      <Link
        href="/tool/invoices/create"
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-20 right-4', buttonVariants({ variant: 'default' }))}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create invoice
      </Link>
      <motion.div {...animateBasicMotionOpacity()} className="flex flex-col w-full gap-4 pb-24">
        {invoices?.map((invoice) => (
          <InvoiceCard invoice={invoice} key={`invoice-list-${invoice?.id}`} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
