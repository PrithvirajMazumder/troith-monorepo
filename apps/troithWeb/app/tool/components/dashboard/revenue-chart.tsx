'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@troith/shared/components/ui/card'
import { ChartContainer, type ChartConfig } from '@troith/shared/components/ui/chart'
import { Recharts } from '@troith/shared/components/ui/chart'

interface MonthlyRevenueData {
  month: string
  revenue: number
  count: number
}

interface RevenueChartProps {
  data: MonthlyRevenueData[]
}

const chartConfig: ChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-1)'
  }
}

export function RevenueChart({ data }: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <Recharts.AreaChart data={data}>
            <Recharts.CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <Recharts.XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} className="text-muted-foreground" />
            <Recharts.YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value: number) => formatCurrency(value)}
              className="text-muted-foreground"
            />
            <Recharts.Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label: string) => `Month: ${label}`}
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
            />
            <Recharts.Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.3} strokeWidth={2} />
          </Recharts.AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
