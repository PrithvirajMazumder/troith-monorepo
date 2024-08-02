'use client'
import { useSuspenseQuery } from '@apollo/client'
import { TaxQueries } from '@troithWeb/app/queries/taxQueries'
import { H3 } from '@troith/shared'
import { TaxCard } from '@troithWeb/app/tool/components/taxCard'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import { useRouter } from 'next/navigation'

export default function TaxCreateInvoicePage() {
  const { setSelectedTax, selectedTax } = useCreateInvoice()
  const { data: taxData } = useSuspenseQuery(TaxQueries.all)
  const router = useRouter()

  return (
    <>
      <H3 className="mb-4">GST</H3>
      <div className="flex flex-col gap-3 mt-4">
        {taxData?.taxes?.map((tax, index) => {
          return (
            <TaxCard
              tax={tax}
              isSelected={selectedTax?.id === tax?.id}
              onSelect={(tax) => {
                setSelectedTax(tax)
                router.push('/tool/invoices/create/bank')
              }}
              key={tax.id}
            />
          )
        })}
      </div>
    </>
  )
}
