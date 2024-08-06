'use client'
import { useSuspenseQuery } from '@apollo/client'
import { PartyQueries } from '@troithWeb/app/tool/parties/queries/partyQueries'
import { H4, Separator } from '@troith/shared'
import { PartyCard } from '@troithWeb/app/tool/components/partyCard'
import { Party } from '@troithWeb/__generated__/graphql'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import { CreateInvoicePagesHeader } from '@troithWeb/app/tool/invoices/create/components/createInvoicePagesHeader'
import { useRouter } from 'next-nprogress-bar'

export default function SelectPartyCreateInvoicePage() {
  const router = useRouter()
  const { data: partiesData } = useSuspenseQuery(PartyQueries.partiesByCompanyId, {
    variables: { companyId: '658db32a6cf334fc362c9cad' }
  })
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
    <>
      <CreateInvoicePagesHeader
        title="Select Party"
        subtitle="Please select a party for whom you would like to create this invoice from the available options."
      />
      {partiesData?.parties?.map((party) => (
        <PartyCard
          isSelected={party.id === selectedParty?.id}
          onSelect={handlePartySelection}
          key={`party-card-create-invoice-${party?.id}`}
          party={party as Party}
        />
      ))}
    </>
  )
}
