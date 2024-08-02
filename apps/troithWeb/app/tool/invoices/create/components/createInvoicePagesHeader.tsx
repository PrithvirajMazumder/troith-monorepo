import { ComponentProps } from 'react'
import { H4, Separator } from '@troith/shared'
import { cn } from '@troith/shared/lib/util'

type Props = {
  title: string
  subtitle: string
} & ComponentProps<'div'>

export const CreateInvoicePagesHeader = ({ title, subtitle, className, ...propsToFwd }: Props) => (
  <div className={cn('mb-6', className)} {...propsToFwd}>
    <H4>{title}</H4>
    <p className="text-muted-foreground text-sm">{subtitle}</p>
    <Separator className="mt-3" />
  </div>
)
