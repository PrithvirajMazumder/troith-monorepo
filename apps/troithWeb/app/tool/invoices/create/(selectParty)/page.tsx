'use client'
import { PartyCard } from '@troithWeb/app/tool/components/partyCard'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import { CreateInvoicePagesHeader } from '@troithWeb/app/tool/invoices/create/components/createInvoicePagesHeader'
import { useRouter } from 'next-nprogress-bar'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { Party } from '@prisma/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { partiesKeys } from '@troithWeb/app/tool/queryKeys/parties'

const fetchPartiesByCompany = async (companyId: string): Promise<Array<Party>> => await (await fetch(`/api/parties/company/${companyId}`)).json()

export default function SelectPartyCreateInvoicePage() {
  const { selectedCompany } = useCompanyStore()
  const {data: partiesData} = useSuspenseQuery({
    queryKey: partiesKeys.lists(selectedCompany?.id ?? ''),
    queryFn: () => fetchPartiesByCompany(selectedCompany?.id ?? '')
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
        {partiesData?.map((party) => (
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
