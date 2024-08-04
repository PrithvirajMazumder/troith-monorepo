import { gql } from '@troithWeb/__generated__'

export const InvoiceQueries = {
  allByCompanyId: gql(`query
  GetInvoices ($companyId: String!) {
      invoices(companyId: $companyId){
          id
          date
          status
          party{
              name
          }
          invoiceItems{
              quantity
              price
          }
          no
          vehicleNumber
      }
  }`),
  detailsById: gql(`
      query GetInvoice($invoiceId: String!) {
          invoice(id: $invoiceId) {
              id
              date
              invoiceItems {
                  quantity
                  item {
                      id
                      name
                      hsn
                      tax{
                          cgst
                          sgst
                      }
                      uom{
                          abbreviation
                          name
                      }
                  }
                  price
              }
              party{
                  id
                  addressLine1
                  addressLine2
                  zipCode
                  name
                  state
                  gstin
                  city
                  partyItemIds
              }
              vehicleNumber
              company{
                  legalName
                  city
                  state
                  addressLine1
                  addressLine2
                  zipCode
                  gstin
              }
              tax{
                  cgst
                  sgst
              }
              no
              bank{
                  id
                  accountNumber
                  branch
                  name
                  ifsc
              }
              status
          }
      }`),
  suggestedNextInvoiceNumber: gql(`query GetNextInvoiceNumber { suggestedNextInvoiceNumber }`),
  getInvoiceNumberWithNo: gql(`query GetInvoiceNumberWithNo ($no: String!) {
    invoiceByNo(no: $no){
      no
    }
  }`)
} as const
