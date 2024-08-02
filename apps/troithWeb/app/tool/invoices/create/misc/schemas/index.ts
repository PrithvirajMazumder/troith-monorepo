import { boolean, InferType, number, object, string } from 'yup'

export const FinaliseInvoiceFormValidationSchema = object().shape({
  invoiceNumber: number().required('Invoice number cannot be empty.'),
  shouldUseIgst: boolean(),
  bank: string().required('You have to select a bank to create an invoice.'),
  taxation: string().required('Taxation is required to create an invoice.')
})

export type FinaliseInvoiceFormFields = InferType<typeof FinaliseInvoiceFormValidationSchema>
