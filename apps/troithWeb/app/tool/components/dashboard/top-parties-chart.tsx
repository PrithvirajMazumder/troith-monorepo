'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@troith/shared/components/ui/card'
import { ChartContainer, type ChartConfig } from '@troith/shared/components/ui/chart'
import { Recharts } from '@troith/shared/components/ui/chart'

interface PartyData {
  name: string
  revenue: number
}

interface TopPartiesChartProps {
  data: PartyData[]
}

const chartConfig: ChartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-1)'
  }
}

export function TopPartiesChart({ data }: TopPartiesChartProps) {
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
        <CardTitle>Top Parties</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <Recharts.BarChart data={data} layout="vertical">
            <Recharts.CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
            <Recharts.XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value: number) => formatCurrency(value)}
              className="text-muted-foreground"
            />
            <Recharts.YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              width={100}
              className="text-muted-foreground"
            />
            <Recharts.Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
            />
            <Recharts.Bar dataKey="revenue" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
          </Recharts.BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
