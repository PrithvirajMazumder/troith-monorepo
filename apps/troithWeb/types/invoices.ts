import { Bank, Company, Invoice, InvoiceItem, Item, Party, Tax, Uom } from '@prisma/client'

export type InvoiceType = Invoice & {
  party: Party
  company: Company
  InvoiceItem: InvoiceItemType[]
  tax: Tax
  bank: Bank
}

export type InvoiceItemType = InvoiceItem & { item: Item; uom: Uom }

export type UpdateInvoice = Partial<Omit<Invoice, 'id' | 'no'>>
