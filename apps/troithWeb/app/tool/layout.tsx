import { cookies } from 'next/headers'
import { Company } from '@prisma/client'
import { PropsWithChildren } from 'react'
import { ToolProviders } from '@troithWeb/app/tool/providers'

export default async function ToolLayout({ children }: PropsWithChildren) {
  const cookieStore = await cookies()
  const companyCookie = cookieStore.get('selected_company')
  let initialCompany: Company | null = null
  if (companyCookie?.value) {
    try {
      initialCompany = JSON.parse(decodeURIComponent(companyCookie.value)) as Company
    } catch {}
  }

  return <ToolProviders initialCompany={initialCompany}>{children}</ToolProviders>
}
