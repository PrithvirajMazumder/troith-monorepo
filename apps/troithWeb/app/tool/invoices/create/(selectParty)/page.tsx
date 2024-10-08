'use client'
import { useSuspenseQuery } from '@apollo/client'
import { PartyQueries } from '@troithWeb/app/tool/parties/queries/partyQueries'
import { H4, Separator } from '@troith/shared'
import { PartyCard } from '@troithWeb/app/tool/components/partyCard'
import { Party } from '@troithWeb/__generated__/graphql'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import { CreateInvoicePagesHeader } from '@troithWeb/app/tool/invoices/create/components/createInvoicePagesHeader'
import { useRouter } from 'next-nprogress-bar'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'

export default function SelectPartyCreateInvoicePage() {
  const { selectedCompany } = useCompanyStore()
  const { data: partiesData } = useSuspenseQuery(PartyQueries.partiesByCompanyId, {
    variables: { companyId: selectedCompany?.id ?? '' }
  })
  const router = useRouter()
  const { setSelectedParty, selectedParty } = useCreateInvoice()

  const handlePartySelection = (party: Party) => {
    setSelectedParty(party)
    void router.replace(
      '/tool/invoices/create/choose-items',
      {},
      {
        showProgressBar: true
      }
    )
  }

  return (
    <AnimatePresence>
      <CreateInvoicePagesHeader
        title="Select Party"
        subtitle="Please select a party for whom you would like to create this invoice from the available options."
      />
      <motion.div {...animateBasicMotionOpacity()} className="w-full flex flex-col gap-3 h-full">
        {partiesData?.parties?.map((party) => (
          <PartyCard
            isSelected={party.id === selectedParty?.id}
            onSelect={handlePartySelection}
            key={`party-card-create-invoice-${party?.id}`}
            entity={party as Party}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
