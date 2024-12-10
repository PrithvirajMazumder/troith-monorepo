import { getGrossTotalValueFromInvoiceItems } from '@troithWeb/app/tool/invoices/utils/generateCompleteInvoice'
import { getDecimalPart } from '@troithWeb/utils/number'
import { InvoiceType } from '@troithWeb/types/invoices'

export const getInvoiceTotals = (invoice: Pick<InvoiceType, 'tax' | 'InvoiceItem'>) => {
  const grossTotal = invoice?.tax ? getGrossTotalValueFromInvoiceItems(invoice?.InvoiceItem ?? []) : 0
  const sgst = invoice?.tax ? (getGrossTotalValueFromInvoiceItems(invoice?.InvoiceItem ?? []) * (invoice?.tax?.sgst ?? 0)) / 100 : 0
  const cgst = invoice?.tax ? (getGrossTotalValueFromInvoiceItems(invoice?.InvoiceItem ?? []) * (invoice?.tax?.cgst ?? 0)) / 100 : 0
  const igst = invoice?.tax
    ? (getGrossTotalValueFromInvoiceItems(invoice?.InvoiceItem ?? []) * ((invoice?.tax?.cgst ?? 0) + (invoice?.tax?.sgst ?? 0))) / 100
    : 0
  const roundOff = invoice?.tax ? parseInt(`0.${getDecimalPart(grossTotal + cgst + sgst)}`).toFixed(2) : 0
  const netTotal = invoice?.tax ? Math.floor(grossTotal + cgst + sgst) : 0

  return {
    grossTotal,
    sgst,
    cgst,
    igst,
    roundOff,
    netTotal
  }
}
