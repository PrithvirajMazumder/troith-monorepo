import { gql } from '@troithWeb/__generated__'

export const InvoiceMutations = {
  create: gql(`mutation CreateInvoice(
  $date: String!
  $invoiceItems: [CreateInvoiceItemInput!]!
  $partyId: String!
  $vehicleNumber: String!
  $companyId: String!
  $taxId: String!
  $no: Int!
  $bankId: String!
) {
  createInvoice(
    createInvoiceInput: {
      date: $date
      invoiceItems: $invoiceItems
      partyId: $partyId
      vehicleNumber: $vehicleNumber
      companyId: $companyId
      taxId: $taxId
      no: $no
      bankId: $bankId
    }
  ) {
    id
    date
    invoiceItems {
      quantity
      item {
        id
        name
        hsn
        tax {
          id
          cgst
          sgst
        }
        uom {
          id
          abbreviation
          name
        }
      }
      price
    }
    party {
      id
      addressLine1
      addressLine2
      zipCode
      name
      state
      gstin
      city
    }
    vehicleNumber
    company{
      id
      name
      legalName
      city
      state
      addressLine1
      addressLine2
      gstin
    }
    tax {
      id
      cgst
      sgst
    }
    bank {
      id
      accountNumber
      branch
      name
      ifsc
    }
    status
    no
  }
}`)
} as const
