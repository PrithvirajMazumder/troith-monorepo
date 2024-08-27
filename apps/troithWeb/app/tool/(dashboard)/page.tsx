'use client'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { CardFooter, ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, H1, H4 } from '@troith/shared'
import { convertAmountToInr } from '@troithWeb/utils/currency'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@troith/shared/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { Pie, PieChart } from 'recharts'
import { useMemo, useState } from 'react'

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

const barChartData = [
  { date: '2024-04-01', invoices: 222, challans: 150 },
  { date: '2024-04-02', invoices: 97, challans: 180 },
  { date: '2024-04-03', invoices: 167, challans: 120 },
  { date: '2024-04-04', invoices: 242, challans: 260 },
  { date: '2024-04-05', invoices: 373, challans: 290 },
  { date: '2024-04-06', invoices: 301, challans: 340 },
  { date: '2024-04-07', invoices: 245, challans: 180 },
  { date: '2024-04-08', invoices: 409, challans: 320 },
  { date: '2024-04-09', invoices: 59, challans: 110 },
  { date: '2024-04-10', invoices: 261, challans: 190 },
  { date: '2024-04-11', invoices: 327, challans: 350 },
  { date: '2024-04-12', invoices: 292, challans: 210 },
  { date: '2024-04-13', invoices: 342, challans: 380 },
  { date: '2024-04-14', invoices: 137, challans: 220 },
  { date: '2024-04-15', invoices: 120, challans: 170 },
  { date: '2024-04-16', invoices: 138, challans: 190 },
  { date: '2024-04-17', invoices: 446, challans: 360 },
  { date: '2024-04-18', invoices: 364, challans: 410 },
  { date: '2024-04-19', invoices: 243, challans: 180 },
  { date: '2024-04-20', invoices: 89, challans: 150 },
  { date: '2024-04-21', invoices: 137, challans: 200 },
  { date: '2024-04-22', invoices: 224, challans: 170 },
  { date: '2024-04-23', invoices: 138, challans: 230 },
  { date: '2024-04-24', invoices: 387, challans: 290 },
  { date: '2024-04-25', invoices: 215, challans: 250 },
  { date: '2024-04-26', invoices: 75, challans: 130 },
  { date: '2024-04-27', invoices: 383, challans: 420 },
  { date: '2024-04-28', invoices: 122, challans: 180 },
  { date: '2024-04-29', invoices: 315, challans: 240 },
  { date: '2024-04-30', invoices: 454, challans: 380 },
  { date: '2024-05-01', invoices: 165, challans: 220 },
  { date: '2024-05-02', invoices: 293, challans: 310 },
  { date: '2024-05-03', invoices: 247, challans: 190 },
  { date: '2024-05-04', invoices: 385, challans: 420 },
  { date: '2024-05-05', invoices: 481, challans: 390 },
  { date: '2024-05-06', invoices: 498, challans: 520 },
  { date: '2024-05-07', invoices: 388, challans: 300 },
  { date: '2024-05-08', invoices: 149, challans: 210 },
  { date: '2024-05-09', invoices: 227, challans: 180 },
  { date: '2024-05-10', invoices: 293, challans: 330 },
  { date: '2024-05-11', invoices: 335, challans: 270 },
  { date: '2024-05-12', invoices: 197, challans: 240 },
  { date: '2024-05-13', invoices: 197, challans: 160 },
  { date: '2024-05-14', invoices: 448, challans: 490 },
  { date: '2024-05-15', invoices: 473, challans: 380 },
  { date: '2024-05-16', invoices: 338, challans: 400 },
  { date: '2024-05-17', invoices: 499, challans: 420 },
  { date: '2024-05-18', invoices: 315, challans: 350 },
  { date: '2024-05-19', invoices: 235, challans: 180 },
  { date: '2024-05-20', invoices: 177, challans: 230 },
  { date: '2024-05-21', invoices: 82, challans: 140 },
  { date: '2024-05-22', invoices: 81, challans: 120 },
  { date: '2024-05-23', invoices: 252, challans: 290 },
  { date: '2024-05-24', invoices: 294, challans: 220 },
  { date: '2024-05-25', invoices: 201, challans: 250 },
  { date: '2024-05-26', invoices: 213, challans: 170 },
  { date: '2024-05-27', invoices: 420, challans: 460 },
  { date: '2024-05-28', invoices: 233, challans: 190 },
  { date: '2024-05-29', invoices: 78, challans: 130 },
  { date: '2024-05-30', invoices: 340, challans: 280 },
  { date: '2024-05-31', invoices: 178, challans: 230 },
  { date: '2024-06-01', invoices: 178, challans: 200 },
  { date: '2024-06-02', invoices: 470, challans: 410 },
  { date: '2024-06-03', invoices: 103, challans: 160 },
  { date: '2024-06-04', invoices: 439, challans: 380 },
  { date: '2024-06-05', invoices: 88, challans: 140 },
  { date: '2024-06-06', invoices: 294, challans: 250 },
  { date: '2024-06-07', invoices: 323, challans: 370 },
  { date: '2024-06-08', invoices: 385, challans: 320 },
  { date: '2024-06-09', invoices: 438, challans: 480 },
  { date: '2024-06-10', invoices: 155, challans: 200 },
  { date: '2024-06-11', invoices: 92, challans: 150 },
  { date: '2024-06-12', invoices: 492, challans: 420 },
  { date: '2024-06-13', invoices: 81, challans: 130 },
  { date: '2024-06-14', invoices: 426, challans: 380 },
  { date: '2024-06-15', invoices: 307, challans: 350 },
  { date: '2024-06-16', invoices: 371, challans: 310 },
  { date: '2024-06-17', invoices: 475, challans: 520 },
  { date: '2024-06-18', invoices: 107, challans: 170 },
  { date: '2024-06-19', invoices: 341, challans: 290 },
  { date: '2024-06-20', invoices: 408, challans: 450 },
  { date: '2024-06-21', invoices: 169, challans: 210 },
  { date: '2024-06-22', invoices: 317, challans: 270 },
  { date: '2024-06-23', invoices: 480, challans: 530 },
  { date: '2024-06-24', invoices: 132, challans: 180 },
  { date: '2024-06-25', invoices: 141, challans: 190 },
  { date: '2024-06-26', invoices: 434, challans: 380 },
  { date: '2024-06-27', invoices: 448, challans: 490 },
  { date: '2024-06-28', invoices: 149, challans: 200 },
  { date: '2024-06-29', invoices: 103, challans: 160 },
  { date: '2024-06-30', invoices: 446, challans: 400 }
]

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

export function Component() {
  const [activeChart, setActiveChart] = useState<keyof typeof barChartConfig>('invoices')

  const total = useMemo(
    () => ({
      invoices: barChartData.reduce((acc, curr) => acc + curr.invoices, 0),
      challans: barChartData.reduce((acc, curr) => acc + curr.challans, 0)
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
            data={barChartData}
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
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
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

export default function DashboardPage() {
  return (
    <div className="w-full p-4">
      <div className="mt-4 mb-6 flex items-start gap-4">
        <span>
          <H4 className="text-muted-foreground">Total revenue</H4>
          <H1>{convertAmountToInr(54879843)}</H1>
        </span>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <Component />
        <div className="flex items-center gap-4 w-full">
          <GraphComponent />
          <LineComponent />
        </div>
      </div>
    </div>
  )
}
