import { Bank, InvoiceItem, Prisma, Tax } from '@prisma/client'
import { InvoiceType } from '@troithWeb/types/invoices'
import { prisma } from '@troithWeb/prisma'

export const fetchTaxes = async (companyId: string): Promise<Array<Tax>> => await (await fetch(`/api/taxes/company/${companyId}`)).json()
export const fetchBanks = async (userId: string): Promise<Array<Bank>> => await (await fetch(`/api/banks/user/${userId}`)).json()
export const fetchNextInvoiceNo = async (): Promise<number> => await (await fetch('/api/invoices/nextInvoiceNo')).json()
export const fetchInvoiceByNo = async (invoiceNo: number): Promise<InvoiceType> => await (await fetch(`/api/invoices?no=${invoiceNo}`)).json()

export const createNewInvoice = async (
  invoice: Omit<Prisma.Args<typeof prisma.invoice, 'create'>['data'], 'InvoiceItem'> & {
    invoiceItems: Omit<InvoiceItem, 'id' | 'invoiceId'>[]
  }
): Promise<InvoiceType> =>
  await (
    await fetch('/api/invoices', {
      body: JSON.stringify(invoice),
      method: 'POST'
    })
  ).json()
