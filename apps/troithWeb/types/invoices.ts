import { Invoice, InvoiceItem, Party } from '@prisma/client'

export type InvoiceType = Invoice & {
  party: Party
  InvoiceItem: (InvoiceItem & { item: any })[]
}

export type UpdateInvoice = Partial<Omit<Invoice, 'id'>>
