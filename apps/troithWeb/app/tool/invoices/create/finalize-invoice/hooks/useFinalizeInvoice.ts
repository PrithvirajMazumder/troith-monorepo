import { useMutation } from '@apollo/client'
import { InvoiceMutations } from '@troithWeb/app/tool/invoices/queries/invoiceMutations'

export const useFinalizeInvoice = () => {
  const [createInvoice, { data: newInvoice, loading: isInvoiceCreating, error: invoiceCreationHasError }] = useMutation(InvoiceMutations.create)

  return {
    createInvoice,
    newInvoice,
    isInvoiceCreating,
    invoiceCreationHasError
  }
}
