import { Bank, Company, Invoice, InvoiceItem, Party, Tax } from '@prisma/client'
import { ItemType } from '@troithWeb/types/items'

export type InvoiceType = Invoice & {
  party: Party
  company: Company
  InvoiceItem: InvoiceItemType[]
  tax: Tax
  bank: Bank
}

export type InvoiceItemType = InvoiceItem & { item: ItemType }
export type BlankInvoiceItemType = Omit<InvoiceItemType, 'invoiceId' | 'id' | 'itemId' | 'isPriceTotal'>
export type UpdateInvoice = Partial<Omit<Invoice, 'id' | 'no'>>
