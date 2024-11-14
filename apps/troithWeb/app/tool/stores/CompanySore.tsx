import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Company } from '@prisma/client'

export type CompanySoreValues = {
  selectedCompany: Company | null
  setSelectedCompany: Dispatch<SetStateAction<Company | null>>
  isSelectCompanyModalOpen: boolean
  toggleSelectCompanyModal: Dispatch<SetStateAction<boolean>>
  companies: Company[]
}

const CompanyStore = createContext<CompanySoreValues>({} as CompanySoreValues)

export const CompanyStoreProvider = ({ children }: PropsWithChildren) => {
  const SelectedCompanyLocalStorageKey = 'SELECTED_COMPANY_LOCAL_STORAGE_KEY'
  const { data: session } = useSession()
  const [companies, setCompanies] = useState<Company[]>([])
  const locallySelectedCompany = localStorage.getItem(SelectedCompanyLocalStorageKey)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(
    (locallySelectedCompany ? (JSON.parse(locallySelectedCompany) as Company) : null) ?? null
  )
  const [isSelectCompanyModalOpen, setIsSelectCompanyModalOpen] = useState(false)

  const fetchCompanies = async (userId: string) => {
    const resp = await fetch(`/api/companies/${userId}`)
    const companies: Company[] = (await resp.json())
    setCompanies(companies)
  }

  useEffect(() => {
    if (session?.user) {
      console.log('session.user: ', session.user)
      void fetchCompanies(session?.user?.id ?? '')
    }
  }, [session])

  useEffect(() => {
    if (selectedCompany) {
      localStorage.setItem(SelectedCompanyLocalStorageKey, JSON.stringify(selectedCompany))
    }
  }, [selectedCompany])

  return (
    <CompanyStore.Provider
      value={{
        isSelectCompanyModalOpen,
        toggleSelectCompanyModal: setIsSelectCompanyModalOpen,
        selectedCompany,
        setSelectedCompany,
        companies: companies
      }}
    >
      {children}
    </CompanyStore.Provider>
  )
}

export const useCompanyStore = () => {
  const context = useContext(CompanyStore)

  if (!context) {
    throw new Error('Please use useCompanyStore inside the context of CompanyStore.')
  }

  return context
}
