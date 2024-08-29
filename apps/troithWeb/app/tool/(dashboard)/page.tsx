'use client'
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, H1, H4 } from '@troith/shared'
import { convertAmountToInr } from '@troithWeb/utils/currency'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@troith/shared/components/ui/card'
import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { DashboardQueries } from '@troithWeb/app/tool/(dashboard)/queries/dashboardQueries'
import { InvoiceCountChart } from '@troithWeb/app/tool/(dashboard)/components/InvoiceCountChart'

const lineChartData = [
  { month: 'January', earnings: 186 },
  { month: 'February', earnings: 305 },
  { month: 'March', earnings: 237 },
  { month: 'April', earnings: 73 },
  { month: 'May', earnings: 209 },
  { month: 'June', earnings: 214 }
]

const lineChartConfig = {
  earnings: {
    label: 'Desktop',
    color: 'hsl(var(--foreground))'
  }
} satisfies ChartConfig

export function LineComponent() {
  return (
    <Card className="w-[30%]">
      <CardHeader>
        <CardTitle className="text-muted-foreground">Earnings</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          style={{
            width: '100%',
            height: 200
          }}
          config={lineChartConfig}
        >
          <LineChart
            accessibilityLayer
            data={lineChartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Line dataKey="earnings" type="linear" stroke="var(--color-earnings)" strokeWidth={3} dot />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const graphChartData = [
  { month: 'January', paid: 186, draft: 80, confirmed: 45 },
  { month: 'February', paid: 305, draft: 200, confirmed: 100 },
  { month: 'March', paid: 237, draft: 120, confirmed: 150 },
  { month: 'April', paid: 73, draft: 190, confirmed: 50 },
  { month: 'May', paid: 209, draft: 130, confirmed: 100 },
  { month: 'June', paid: 214, draft: 140, confirmed: 160 }
]

const graphChartConfig = {
  paid: {
    label: 'Paid',
    color: 'rgb(var(--chart-status-paid))'
  },
  draft: {
    label: 'Draft',
    color: 'rgb(var(--chart-status-draft))'
  },
  confirmed: {
    label: 'Confirmed',
    color: 'rgb(var(--chart-status-confirmed))'
  }
} satisfies ChartConfig

export function GraphComponent() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-muted-foreground">Invoices composition</CardTitle>
        <CardDescription>Showing total composition for the last 3 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          style={{
            width: '100%',
            height: 200
          }}
          config={graphChartConfig}
        >
          <AreaChart
            accessibilityLayer
            data={graphChartData}
            margin={{
              left: 12,
              right: 12,
              top: 12
            }}
            stackOffset="expand"
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area dataKey="paid" type="natural" fill="var(--color-paid)" fillOpacity={0.6} strokeWidth={3} stroke="var(--color-paid)" stackId="a" />
            <Area
              dataKey="confirmed"
              type="natural"
              fill="var(--color-confirmed)"
              fillOpacity={0.3}
              strokeWidth={3}
              stroke="var(--color-confirmed)"
              stackId="a"
            />
            <Area
              dataKey="draft"
              type="natural"
              fill="var(--color-draft)"
              fillOpacity={0.1}
              strokeWidth={3}
              stroke="var(--color-draft)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [fetchInvoicesCountByDateRange, { loading: invoicesCountByDateRangeLoading, data: invoicesCountByDateRangeData }] = useLazyQuery(
    DashboardQueries.invoicesCountByDateRange
  )

  useEffect(() => {
    void fetchInvoicesCountByDateRange({
      variables: {
        monthsFromStart: 3,
        endingDate: new Date().toISOString()
      }
    })
  }, [])

  return (
    <div className="w-full p-4">
      <div className="mt-4 mb-6 flex items-start gap-4">
        <span>
          <H4 className="text-muted-foreground">Total revenue</H4>
          <H1>{convertAmountToInr(54879843)}</H1>
        </span>
      </div>
      <div className="flex flex-col gap-4 w-full">
        {invoicesCountByDateRangeLoading ? (
          <p>Loading</p>
        ) : invoicesCountByDateRangeData ? (
          <InvoiceCountChart
            invoicesAndChallansCountData={invoicesCountByDateRangeData?.invoiceCountByDateRange?.map((invoicesCount) => ({
              invoices: invoicesCount.count,
              challans: invoicesCount.count,
              date: invoicesCount.date
            }))}
          />
        ) : null}
        <div className="flex items-center gap-4 w-full">
          <GraphComponent />
          <LineComponent />
        </div>
      </div>
    </div>
  )
}
