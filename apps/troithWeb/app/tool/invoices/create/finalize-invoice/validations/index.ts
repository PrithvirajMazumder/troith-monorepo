import { boolean, InferType, number, object, string } from 'yup'

export const FinaliseInvoiceFormValidationSchema = object().shape({
  invoiceNumber: number().typeError('Invalid invoice number.').required('Invoice number cannot be empty.'),
  vehicleNumber: string().optional().nullable(),
  bank: string().required('You have to select a bank to create an invoice.'),
  taxation: string().required('Taxation is required to create an invoice.'),
  shouldUseIgst: boolean(),
  date: string().required('Date is required to create an invoice').typeError('Please enter a valid date')
})

export type FinaliseInvoiceFormFields = InferType<typeof FinaliseInvoiceFormValidationSchema>
