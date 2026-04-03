'use client'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { buttonVariants } from '@troith/shared'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useQuery } from '@tanstack/react-query'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { PartyCard } from '@troithWeb/app/tool/components/partyCard'
import { useRouter } from 'next-nprogress-bar'
import { Party } from '@prisma/client'
import { useSearchParams } from 'next/navigation'
import { useDebounce } from '@troith/shared'
import { partiesKeys } from '@troithWeb/app/tool/queryKeys/parties'

const fetchParties = async (companyId: string, search?: string) => {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  const query = params.toString()
  const res = await fetch(`/api/parties/company/${companyId}${query ? `?${query}` : ''}`)
  if (!res.ok) throw new Error('Failed to fetch parties')
  return res.json()
}

export default function Parties() {
  const { selectedCompany } = useCompanyStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get('search') || ''
  const debouncedSearch = useDebounce(search, 300)

  const { data: parties } = useQuery({
    queryKey: partiesKeys.lists(selectedCompany?.id ?? '', String(debouncedSearch) || undefined),
    queryFn: () => fetchParties(selectedCompany?.id ?? '', String(debouncedSearch) || undefined),
    enabled: !!selectedCompany?.id
  })

  return (
    <AnimatePresence>
      <Link
        href="/tool/parties/create"
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-20 right-4', buttonVariants({ variant: 'default' }))}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create party
      </Link>
      <motion.div {...animateBasicMotionOpacity()} className="flex flex-col w-full gap-4 pb-24">
        {parties?.map((party: Party) => (
          <PartyCard onSelect={(party) => router.push(`/tool/parties/${party.id}`)} entity={party as Party} key={`party-list-${party?.id}`} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
