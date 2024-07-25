export enum InvoiceStatus {
  Draft = 'DRAFT',
  Confirmed = 'CONFIRMED',
  Paid = 'PAID'
}

export const InvoiceStatusArr = Object.values(InvoiceStatus)

export type AllowedInvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus]
