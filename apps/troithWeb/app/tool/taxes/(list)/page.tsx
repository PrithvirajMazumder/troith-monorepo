'use client'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { buttonVariants } from '@troith/shared'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useQuery } from '@tanstack/react-query'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { TaxCard } from '@troithWeb/app/tool/components/taxCard'
import { useRouter } from 'next-nprogress-bar'
import { Tax } from '@prisma/client'

const fetchTaxes = async (companyId: string) => {
  const res = await fetch(`/api/taxes/company/${companyId}`)
  if (!res.ok) throw new Error('Failed to fetch taxes')
  return res.json()
}

export default function TaxesPage() {
  const { selectedCompany } = useCompanyStore()
  const router = useRouter()
  const { data: taxes } = useQuery({
    queryKey: ['taxes', selectedCompany?.id],
    queryFn: () => fetchTaxes(selectedCompany?.id ?? ''),
    enabled: !!selectedCompany?.id
  })

  return (
    <AnimatePresence>
      <Link
        href="/tool/taxes/create"
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-20 right-4', buttonVariants({ variant: 'default' }))}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create tax
      </Link>
      <motion.div {...animateBasicMotionOpacity()} className="flex flex-col w-full gap-4 pb-24">
        {taxes?.map((tax: Tax) => (
          <TaxCard onSelect={(tax) => router.push(`/tool/taxes/${tax.id}`)} entity={tax} key={`tax-list-${tax?.id}`} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
