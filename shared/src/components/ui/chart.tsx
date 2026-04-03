'use client'

import * as React from 'react'
import * as Recharts from 'recharts'

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
    theme?: Record<'light' | 'dark', string>
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

const ChartContext = React.createContext<ChartConfig>({})

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(({ config, children, className, ...props }, ref) => {
  return (
    <ChartContext.Provider value={config}>
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = 'ChartContainer'

interface ChartTooltipProps extends React.ComponentProps<typeof Recharts.Tooltip> {
  children?: React.ReactNode
}

export const ChartTooltip = ({ children, ...props }: ChartTooltipProps) => {
  return <Recharts.Tooltip {...props} />
}

interface ChartTooltipContentProps extends React.ComponentProps<typeof Recharts.Tooltip> {
  config: ChartConfig
  hideLabel?: boolean
  hideIndicator?: boolean
}

export const ChartTooltipContent = ({ config, hideLabel, hideIndicator, ...props }: ChartTooltipContentProps) => {
  // @ts-expect-error recharts Tooltip type mismatch with custom content component
  return <Recharts.Tooltip content={<ChartTooltipContentInner config={config} hideLabel={hideLabel} hideIndicator={hideIndicator} {...props} />} />
}

function ChartTooltipContentInner({
  config,
  hideLabel,
  hideIndicator,
  payload
}: ChartTooltipContentProps & { payload?: Array<{ name: string; value: number; color: string }> }) {
  if (!payload?.length) return null

  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-md">
      {payload.map((entry, index) => {
        const name = entry.name as string
        return (
          <div key={index} className="flex items-center gap-2">
            {!hideIndicator && <div className="h-2 w-2 rounded-full" style={{ background: entry.color || config[name]?.color }} />}
            {!hideLabel && config[name]?.label && <span className="text-muted-foreground">{config[name].label}</span>}
            <span className="font-semibold">{entry.value}</span>
          </div>
        )
      })}
    </div>
  )
}

export { Recharts }
