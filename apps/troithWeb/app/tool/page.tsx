'use client'

import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { SummaryCards } from '@troithWeb/app/tool/components/dashboard/summary-cards'
import { RevenueChart } from '@troithWeb/app/tool/components/dashboard/revenue-chart'
import { InvoiceStatusChart } from '@troithWeb/app/tool/components/dashboard/invoice-status-chart'
import { TopPartiesChart } from '@troithWeb/app/tool/components/dashboard/top-parties-chart'
import { useEffect, useState } from 'react'
import { H2, P } from '@troith/shared/components/typography'
import { useQuery } from '@tanstack/react-query'

interface DashboardData {
  summary: {
    totalRevenue: number
    totalInvoices: number
    averageInvoiceValue: number
  }
  statusBreakdown: Array<{
    status: string
    count: number
  }>
  topParties: Array<{
    name: string
    revenue: number
  }>
  monthlyRevenue: Array<{
    month: string
    revenue: number
    count: number
  }>
}

async function fetchDashboardData(companyId: string): Promise<DashboardData> {
  const res = await fetch(`/api/dashboard/company/${companyId}`)
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard data')
  }
  return res.json()
}

export default function ToolDashboard() {
  const { selectedCompany } = useCompanyStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', selectedCompany?.id],
    queryFn: () => fetchDashboardData(selectedCompany?.id ?? ''),
    enabled: !!selectedCompany?.id && mounted
  })

  if (!mounted || !selectedCompany) {
    return (
      <div className="p-6">
        <P className="text-muted-foreground">Select a company to view dashboard</P>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <P className="text-muted-foreground">Loading dashboard...</P>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <P className="text-destructive">Failed to load dashboard data</P>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <P className="text-muted-foreground">No data available</P>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <H2 className="text-2xl font-bold">Dashboard</H2>
        <P className="text-muted-foreground">{selectedCompany.name}</P>
      </div>

      <SummaryCards
        totalRevenue={data.summary.totalRevenue}
        totalInvoices={data.summary.totalInvoices}
        averageInvoiceValue={data.summary.averageInvoiceValue}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart data={data.monthlyRevenue} />
        <InvoiceStatusChart data={data.statusBreakdown} />
      </div>

      <TopPartiesChart data={data.topParties} />
    </div>
  )
}
