export const InvoiceStatuses = {
  Confirmed: 'confirmed',
  Draft: 'draft',
  Paid: 'paid'
} as const

export type InvoiceStatus = (typeof InvoiceStatuses)[keyof typeof InvoiceStatuses]
