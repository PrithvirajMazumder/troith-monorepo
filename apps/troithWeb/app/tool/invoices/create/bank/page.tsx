'use client'
import { H4 } from '@troith/shared'
import { useSuspenseQuery } from '@apollo/client'
import { BankQueries } from '@troithWeb/app/queries/bankQueries'
import { BankCard } from '@troithWeb/app/tool/components/bankCard'
import { useRouter } from 'next/navigation'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'

export default function SelectBank() {
  const { selectedBank, setSelectedBank } = useCreateInvoice()
  const { data: banksData } = useSuspenseQuery(BankQueries.all)
  const router = useRouter()

  return (
    <>
      <H4>Select Bank</H4>
      <div className="flex flex-col gap-3 mt-4">
        {banksData?.banks?.map((bank) => (
          <BankCard
            key={bank?.id}
            bank={bank}
            onSelect={(bank) => {
              setSelectedBank(bank)
              router.push('/tool/invoices/create/misc')
            }}
            isSelected={bank?.id === selectedBank?.id}
          />
        ))}
      </div>
    </>
  )
}
