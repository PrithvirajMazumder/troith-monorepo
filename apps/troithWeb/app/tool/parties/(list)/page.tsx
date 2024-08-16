'use client'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { buttonVariants } from '@troith/shared'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useSuspenseQuery } from '@apollo/client'
import { PartyQueries } from '@troithWeb/app/tool/parties/queries/partyQueries'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { PartyCard } from '@troithWeb/app/tool/components/partyCard'
import { Party } from '@troithWeb/__generated__/graphql'
import { useRouter } from 'next-nprogress-bar'

export default function Parties() {
  const { selectedCompany } = useCompanyStore()
  const router = useRouter()
  const { data: partiesData } = useSuspenseQuery(PartyQueries.partiesByCompanyId, {
    variables: {
      companyId: selectedCompany?.id ?? ''
    },
    fetchPolicy: 'network-only'
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
        {partiesData?.parties?.map((party) => (
          <PartyCard onSelect={(party) => router.push(`/tool/parties/${party.id}`)} party={party as Party} key={`party-list-${party?.id}`} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
