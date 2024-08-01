import { InvoiceStatus } from '@troithWeb/__generated__/graphql'

export const InvoiceStatuses: Record<InvoiceStatus, string> = {
  Confirmed: 'confirmed',
  Draft: 'draft',
  Paid: 'paid'
} as const
