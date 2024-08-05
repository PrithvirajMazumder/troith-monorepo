'use client'
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from 'react'
import { Bank, Invoice, InvoiceItem, Item, Party, Tax } from '@troithWeb/__generated__/graphql'
import { useRouter } from 'next/navigation'

type FinalInvoicePayload = { date: string; invoiceNumber: number; vehicleNumber?: string; bank: Bank; tax: Tax }
type CreateInvoiceContextProps = {
  selectedParty: Party | null
  setSelectedParty: Dispatch<SetStateAction<Party | null>>
  selectedTax: Tax | null
  setSelectedTax: Dispatch<SetStateAction<Tax | null>>
  selectedItems: Item[]
  setSelectedItems: Dispatch<SetStateAction<Item[]>>
  invoiceItems: InvoiceItem[]
  setInvoiceItems: Dispatch<SetStateAction<InvoiceItem[]>>
  selectedBank: Bank | null
  setSelectedBank: Dispatch<SetStateAction<Bank | null>>
  selectedDate: string
  setSelectedDate: Dispatch<SetStateAction<string>>
  selectedVehicleNumber: string
  setSelectedVehicleNumber: Dispatch<SetStateAction<string>>
  selectedInvoiceNumber: number | null
  setSelectedInvoiceNumber: Dispatch<SetStateAction<number | null>>
  setFinalInvoiceData: (data: FinalInvoicePayload) => void
  createdInvoice: Invoice | null
  setCreatedInvoice: Dispatch<SetStateAction<Invoice | null>>
}

const CreateInvoiceContext = createContext<CreateInvoiceContextProps>({} as CreateInvoiceContextProps)

export const CreateInvoiceProvider = ({ children }: PropsWithChildren) => {
  const [selectedParty, setSelectedParty] = useState<Party | null>(null)
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [selectedTax, setSelectedTax] = useState<Tax | null>(null)
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState('')
  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState<number | null>(null)
  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null)
  const router = useRouter()

  const setFinalInvoiceData = (data: FinalInvoicePayload) => {
    setSelectedDate(data.date)
    setSelectedTax(data.tax)
    setSelectedInvoiceNumber(data.invoiceNumber)
    setSelectedVehicleNumber(data.vehicleNumber ?? '')
  }

  useEffect(() => {
    if (!selectedParty) {
      router.replace('/tool/invoices/create')
    }
  }, [selectedParty])

  return (
    <CreateInvoiceContext.Provider
      value={{
        createdInvoice,
        setCreatedInvoice,
        selectedDate,
        selectedInvoiceNumber,
        selectedVehicleNumber,
        setFinalInvoiceData,
        setSelectedDate,
        setSelectedInvoiceNumber,
        setSelectedVehicleNumber,
        setInvoiceItems,
        invoiceItems,
        selectedBank,
        setSelectedBank,
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
