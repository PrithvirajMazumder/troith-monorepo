import { Invoice, InvoiceItem } from '@troithWeb/__generated__/graphql'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { robotoBase64 } from '@troithWeb/public/fonts/robotto'
import { capitalize } from '@troithWeb/utils/string'
import { format } from 'date-fns'
import { convertAmountToInr } from '@troithWeb/utils/currency'
import { getDecimalPart } from '@troithWeb/utils/number'

pdfMake.vfs = pdfFonts.pdfMake.vfs
window.pdfMake.vfs['Roboto.ttf'] = robotoBase64

export const InvoiceFontSizes = {
  HeadTitleFontSize: 18,
  Head2TitleFontSize: 16,
  TitleFontSize: 14,
  SubTitleFontSize: 12,
  NormalFontSize: 10,
  SmallFontSize: 8
}

export function getGrossTotalValueFromInvoiceItems(invoiceItems: InvoiceItem[]) {
  return invoiceItems?.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
}

export const generateCompleteInvoicePdf = (invoice: Invoice) => {
  const grossTotal = getGrossTotalValueFromInvoiceItems(invoice?.invoiceItems)
  const sgst = (getGrossTotalValueFromInvoiceItems(invoice?.invoiceItems ?? []) * (invoice?.tax?.sgst ?? 0)) / 100
  const cgst = (getGrossTotalValueFromInvoiceItems(invoice?.invoiceItems ?? []) * (invoice?.tax?.cgst ?? 0)) / 100
  const igst = (getGrossTotalValueFromInvoiceItems(invoice?.invoiceItems ?? []) * ((invoice?.tax?.cgst ?? 0) + (invoice?.tax?.sgst ?? 0))) / 100
  const roundOff = parseInt(`0.${getDecimalPart(grossTotal + cgst + sgst)}`).toFixed(2)
  const netTotal = Math.floor(grossTotal + cgst + sgst)

  const items =
    invoice?.invoiceItems?.map((invoiceItem, index) => [
      index + 1,
      invoiceItem?.item?.name ?? '',
      invoiceItem?.item?.hsn ?? '',
      `${invoiceItem?.quantity} ${invoiceItem?.item?.uom?.abbreviation}`,
      {
        text: `${convertAmountToInr(invoiceItem?.price, false)}`,
        alignment: 'right'
      }
    ]) ?? []
  return pdfMake.createPdf({
    pageSize: 'A4',
    content: [
      {
        marginBottom: 10,
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            [
              {
                colSpan: 2,
                stack: [
                  {
                    text: capitalize(invoice?.company?.legalName ?? ''),
                    style: { fontSize: InvoiceFontSizes.HeadTitleFontSize }
                  },
                  {
                    text: 'Specialist in: Water Treatment Engineering',
                    style: {
                      italics: true
                    }
                  }
                ]
              },
              '',
              {
                stack: [
                  'To,',
                  capitalize(invoice?.party?.name ?? ''),
                  capitalize(
                    [invoice?.party?.addressLine1, invoice?.party?.addressLine2, invoice?.party?.city]
                      .filter((addressPart) => addressPart?.length)
                      .join(', ')
                  ),
                  {
                    text: capitalize(`${invoice?.party?.state}: ${invoice?.party?.zipCode}`),
                    style: { marginBottom: 10 }
                  },
                  `Vehicle No: ${invoice?.vehicleNumber}`
                ],
                rowSpan: 3,
                colSpan: 2
              },
              ''
            ],
            [
              {
                stack: [
                  capitalize(
                    `Address: ${[invoice?.company?.addressLine1, invoice?.company?.addressLine2, invoice?.company?.city]
                      .filter((addressPart) => addressPart?.length)
                      .join(', ')}`
                  ),
                  { text: capitalize(`${invoice?.company?.state}: ${invoice?.company?.zipCode}`) }
                ],
                colSpan: 2
              },
              '',
              '',
              ''
            ],
            [{ text: 'Phone: 1234567890', colSpan: 2 }, '', '', ''],
            [
              {
                text: 'Email: p@p.com',
                colSpan: 2
              },
              '',
              {
                text: `Invoice No: ${invoice?.no}`,
                colSpan: 2
              },
              ''
            ],
            [
              {
                text: `GSTIN: ${invoice?.company?.gstin}`,
                colSpan: 2
              },
              '',
              `Date: ${invoice?.date?.length ? format(invoice?.date, 'dd/MM/yyyy') : ''}`,
              `GSTIN: ${invoice?.party?.gstin}`
            ]
          ]
        }
      },
      {
        table: {
          widths: ['auto', '*', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'SL', style: { bold: true, italics: true } },
              { text: 'Name', style: { bold: true, italics: true } },
              { text: 'HSN', style: { bold: true, italics: true } },
              { text: 'Quantity', style: { bold: true, italics: true } },
              {
                text: 'Price',
                alignment: 'right',
                bold: true,
                italics: true
              }
            ],
            ...items
          ]
        },
        layout: {
          fillColor: function (rowIndex) {
            if (rowIndex === 0) {
              return '#dbdbdb'
            }
            return rowIndex % 2 === 0 ? '#f4f4f4' : null
          }
        }
      },
      {
        marginTop: 10,
        table: {
          widths: ['*', '30%', '15%', '20%'],
          body: [
            [
              { stack: ['E. & O. E.', `For ${capitalize(invoice?.company?.legalName ?? '')}`], rowSpan: 7 },
              {
                stack: [
                  {
                    text: 'Bank Details',
                    alignment: 'center'
                  },
                  {
                    marginTop: 3,
                    text: 'Account number:'
                  },
                  {
                    text: invoice?.bank?.accountNumber
                  },
                  {
                    text: 'IFSC:'
                  },
                  {
                    text: invoice?.bank?.ifsc?.toUpperCase()
                  },
                  {
                    text: 'Name:'
                  },
                  {
                    text: capitalize(invoice?.bank?.name ?? '')
                  },
                  {
                    text: 'Branch:'
                  },
                  {
                    text: capitalize(invoice?.bank?.branch ?? '')
                  }
                ],
                rowSpan: 7
              },
              'Gross Total',
              {
                text: convertAmountToInr(grossTotal, false),
                style: { alignment: 'right' }
              }
            ],
            [
              '',
              '',
              'SGST%',
              {
                text: convertAmountToInr(sgst, false),
                style: { alignment: 'right' }
              }
            ],
            [
              '',
              '',
              'CGST%',
              {
                text: convertAmountToInr(cgst, false),
                style: { alignment: 'right' }
              }
            ],
            ['', '', 'IGST%', { text: convertAmountToInr(igst, false), style: { alignment: 'right' } }],
            [
              '',
              '',
              'ROUND OFF',
              {
                text: roundOff,
                style: { alignment: 'right' }
              }
            ],
            [
              '',
              '',
              'NET TOTAL',
              {
                text: convertAmountToInr(netTotal, false),
                style: { alignment: 'right' }
              }
            ],
            ['', '', { text: 'ruppes', colSpan: 2 }, '']
          ]
        }
      }
    ]
  })
}
