import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from 'react'
import { InvoiceItem, Item, Party, Tax } from '@troithWeb/__generated__/graphql'
import { useRouter } from 'next/navigation'

type CreateInvoiceContextProps = {
  selectedParty: Party | null
  setSelectedParty: Dispatch<SetStateAction<Party | null>>
  selectedTax: Tax | null
  setSelectedTax: Dispatch<SetStateAction<Tax | null>>
  selectedItems: Item[]
  setSelectedItems: Dispatch<SetStateAction<Item[]>>
}

const CreateInvoiceContext = createContext<CreateInvoiceContextProps>({} as CreateInvoiceContextProps)

export const CreateInvoiceProvider = ({ children }: PropsWithChildren) => {
  const [selectedParty, setSelectedParty] = useState<Party | null>(null)
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [selectedTax, setSelectedTax] = useState<Tax | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!selectedParty) {
      router.replace('/tool/invoices/create')
    }
  }, [selectedParty])

  return (
    <CreateInvoiceContext.Provider
      value={{
        selectedItems,
        selectedParty,
        setSelectedParty,
        setSelectedItems,
        setSelectedTax,
        selectedTax
      }}
    >
      {children}
    </CreateInvoiceContext.Provider>
  )
}

export const useCreateInvoice = () => {
  const context = useContext(CreateInvoiceContext)

  if (!context) {
    throw new Error(`Please use 'useCreateInvoice' hook inside the context of CreateInvoiceContext`)
  }

  return context
}
