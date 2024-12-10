'use client'
import { InvoiceCard } from '@troithWeb/app/tool/components/invoiceCard'
import { Plus } from 'lucide-react'
import { buttonVariants } from '@troith/shared'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { useEffect } from 'react'
import { InvoiceType } from '@troithWeb/types/invoices'
import { useSuspenseQuery } from '@tanstack/react-query'
import { invoicesKeys } from '@troithWeb/app/tool/queryKeys/invoices'

const fetchInvoices = async (companyId: string): Promise<Array<InvoiceType>> => {
  return await (await fetch(`/api/invoices/company/${companyId}`)).json()
}

export default function Invoices() {
  const { selectedCompany } = useCompanyStore()
  const { data: invoices } = useSuspenseQuery({
    queryKey: invoicesKeys?.lists(selectedCompany?.id ?? ''),
    queryFn: () => fetchInvoices(selectedCompany?.id ?? '')
  })

  useEffect(() => {
    if (selectedCompany) {
      void fetchInvoices(selectedCompany.id)
    }
  }, [selectedCompany])

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
          <InvoiceCard invoice={invoice} key={`invoice-list-${invoice?.id}-${invoice?.status}`} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
