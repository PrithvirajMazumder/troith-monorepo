'use client'
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useRef, useState } from 'react'
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

const SELECTED_COMPANY_COOKIE_KEY = 'selected_company'

const setCompanyCookie = (company: Company | null) => {
  if (company) {
    document.cookie = `${SELECTED_COMPANY_COOKIE_KEY}=${encodeURIComponent(JSON.stringify(company))};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`
  } else {
    document.cookie = `${SELECTED_COMPANY_COOKIE_KEY}=;path=/;max-age=0`
  }
}

const useCompanyFetcher = (isSelectCompanyModalOpen: boolean) => {
  const { data: session } = useSession()
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() => {
    if (isSelectCompanyModalOpen && companies.length === 0 && session?.user?.id) {
      fetch(`/api/companies/${session.user.id}`)
        .then((resp) => resp.json())
        .then((data: Company[]) => setCompanies(data))
    }
  }, [isSelectCompanyModalOpen, session])

  return companies
}

export const CompanyStoreProvider = ({ children, initialCompany }: PropsWithChildren<{ initialCompany: Company | null }>) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(initialCompany)
  const [isSelectCompanyModalOpen, setIsSelectCompanyModalOpen] = useState(false)
  const companies = useCompanyFetcher(isSelectCompanyModalOpen)
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    setCompanyCookie(selectedCompany)
  }, [selectedCompany])

  return (
    <CompanyStore.Provider
      value={{
        isSelectCompanyModalOpen,
        toggleSelectCompanyModal: setIsSelectCompanyModalOpen,
        selectedCompany,
        setSelectedCompany,
        companies
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
