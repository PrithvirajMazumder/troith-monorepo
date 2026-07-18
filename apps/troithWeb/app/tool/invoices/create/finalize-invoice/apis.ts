import { Bank, InvoiceItem, Prisma, Tax } from '@prisma/client'
import { InvoiceType } from '@troithWeb/types/invoices'
import { prisma } from '@troithWeb/prisma'

export const fetchTaxes = async (companyId: string): Promise<Array<Tax>> => {
  const res = await (await fetch(`/api/taxes/company/${companyId}`)).json()
  return res?.data ?? res
}
export const fetchBanks = async (userId: string): Promise<Array<Bank>> => {
  const res = await (await fetch(`/api/banks/user/${userId}`)).json()
  return res?.data ?? res
}
export const fetchNextInvoiceNo = async (companyId: string, date: string): Promise<{ no: number; financialYear: string; formatted: string }> =>
  await (await fetch(`/api/invoices/nextInvoiceNo?companyId=${companyId}&date=${encodeURIComponent(date)}`)).json()
export const fetchInvoiceByNo = async (invoiceNo: number, companyId: string, financialYear: string): Promise<InvoiceType> =>
  await (await fetch(`/api/invoices?no=${invoiceNo}&companyId=${companyId}&financialYear=${financialYear}`)).json()

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
