'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@troith/shared/components/ui/card'
import { ChartContainer, type ChartConfig } from '@troith/shared/components/ui/chart'
import { Recharts } from '@troith/shared/components/ui/chart'

interface StatusData {
  status: string
  count: number
}

interface InvoiceStatusChartProps {
  data: StatusData[]
}

const chartConfig: ChartConfig = {
  DRAFT: {
    label: 'Draft',
    color: 'var(--chart-2)'
  },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'var(--chart-1)'
  },
  PAID: {
    label: 'Paid',
    color: 'var(--chart-3)'
  }
}

const COLORS = ['var(--chart-2)', 'var(--chart-1)', 'var(--chart-3)']

export function InvoiceStatusChart({ data }: InvoiceStatusChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <Recharts.PieChart>
            <Recharts.Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4}>
              {data.map((_, index) => (
                <Recharts.Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Recharts.Pie>
            <Recharts.Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px'
              }}
            />
            <Recharts.Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => chartConfig[value as keyof typeof chartConfig]?.label || value}
            />
          </Recharts.PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
