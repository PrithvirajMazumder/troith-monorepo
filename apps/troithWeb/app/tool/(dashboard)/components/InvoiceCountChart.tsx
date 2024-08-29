import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@troith/shared'
import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { parse } from 'date-fns'

export type InvoicesAndChallansCount = { date: string; invoices: number; challans: number }

type Props = {
  invoicesAndChallansCountData: Array<InvoicesAndChallansCount>
}

const barChartConfig = {
  views: {
    label: 'Page Views'
  },
  invoices: {
    label: 'Invoices',
    color: 'rgb(var(--chart-status-confirmed))'
  },
  challans: {
    label: 'Challans',
    color: 'rgb(var(--chart-status-draft))'
  }
} satisfies ChartConfig

export function InvoiceCountChart({ invoicesAndChallansCountData }: Props) {
  const [activeChart, setActiveChart] = useState<keyof typeof barChartConfig>('invoices')

  const total = useMemo(
    () => ({
      invoices: invoicesAndChallansCountData.reduce((acc, curr) => acc + curr.invoices, 0),
      challans: invoicesAndChallansCountData.reduce((acc, curr) => acc + curr.challans, 0)
    }),
    []
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-muted-foreground">Invoices/Challans interactive</CardTitle>
          <CardDescription>Showing total invoices/challans for the last 3 months</CardDescription>
        </div>
        <div className="flex">
          {['invoices', 'challans'].map((key) => {
            const chart = key as keyof typeof barChartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">{barChartConfig[chart].label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">{total[key as keyof typeof total].toLocaleString()}</span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={barChartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={invoicesAndChallansCountData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = parse(value, 'dd/MM/yyyy', new Date())
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px] capitalize"
                  nameKey="count"
                  labelFormatter={(value) => {
                    return parse(value, 'dd/MM/yyyy', new Date())?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
