import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react'
import { InvoiceItem, Party, Tax } from '@troithWeb/__generated__/graphql'

type CreateInvoiceContextProps = {
  selectedParty: Party | null
  setSelectedParty: Dispatch<SetStateAction<Party | null>>
  selectedTax: Tax | null
  setSelectedTax: Dispatch<SetStateAction<Tax | null>>
  selectedItems: InvoiceItem[]
  setSelectedItems: Dispatch<SetStateAction<InvoiceItem[]>>
}

const CreateInvoiceContext = createContext<CreateInvoiceContextProps>({} as CreateInvoiceContextProps)

export const CreateInvoiceProvider = ({ children }: PropsWithChildren) => {
  const [selectedParty, setSelectedParty] = useState<Party | null>(null)
  const [selectedItems, setSelectedItems] = useState<InvoiceItem[]>([])
  const [selectedTax, setSelectedTax] = useState<Tax | null>(null)

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
