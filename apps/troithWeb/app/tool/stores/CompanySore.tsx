import { Company } from '@troithWeb/__generated__/graphql'
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { CompanyQueries } from '@troithWeb/app/queries/companyQueries'

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
  const { data: companiesData } = useQuery(CompanyQueries.allByUserId, {
    variables: {
      userId: '658d9270b7894c3d678c37af'
    }
  })
  const locallySelectedCompany = localStorage.getItem(SelectedCompanyLocalStorageKey)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(
    (locallySelectedCompany ? (JSON.parse(locallySelectedCompany) as Company) : null) ?? null
  )
  const [isSelectCompanyModalOpen, setIsSelectCompanyModalOpen] = useState(false)

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
        companies: (companiesData?.companies as Company[]) ?? []
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
