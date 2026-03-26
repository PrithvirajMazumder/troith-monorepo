'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@troith/shared/components/ui/card'
import { H3, P } from '@troith/shared/components/typography'
import { DollarSign, FileText, TrendingUp } from 'lucide-react'

interface SummaryCardProps {
  title: string
  value: string | number
  icon: 'dollar' | 'file' | 'trend'
  description?: string
}

export function SummaryCard({ title, value, icon, description }: SummaryCardProps) {
  const icons = {
    dollar: DollarSign,
    file: FileText,
    trend: TrendingUp
  }
  const Icon = icons[icon]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <H3 className="text-2xl font-bold">{value}</H3>
        {description && <P className="text-xs text-muted-foreground">{description}</P>}
      </CardContent>
    </Card>
  )
}

interface SummaryCardsProps {
  totalRevenue: number
  totalInvoices: number
  averageInvoiceValue: number
}

export function SummaryCards({ totalRevenue, totalInvoices, averageInvoiceValue }: SummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <SummaryCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon="dollar" description="All time revenue" />
      <SummaryCard title="Total Invoices" value={totalInvoices.toString()} icon="file" description="All time invoices" />
      <SummaryCard title="Avg. Invoice Value" value={formatCurrency(averageInvoiceValue)} icon="trend" description="Average per invoice" />
    </div>
  )
}
