import { GetInvoiceQuery } from '@troithWeb/__generated__/graphql'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { robotoBase64 } from '@troithWeb/public/fonts/robotto'
import { capitalize } from '@troithWeb/utils/string'
import { format } from 'date-fns'

pdfMake.vfs = pdfFonts.pdfMake.vfs
window.pdfMake.vfs['TiroTamil-Regular.ttf'] = robotoBase64

const FontSizes = {
  HeadTitleFontSize: 18,
  Head2TitleFontSize: 16,
  TitleFontSize: 14,
  SubTitleFontSize: 12,
  NormalFontSize: 10,
  SmallFontSize: 8
}

export const generateInvoicePdf = (invoiceData: GetInvoiceQuery) => {
  const { invoice } = invoiceData
  const items = invoiceData?.invoice?.invoiceItems?.map((invoiceItem, index) => [
    index + 1,
    invoiceItem?.item?.name ?? '',
    invoiceItem?.item?.hsn ?? '',
    `${invoiceItem?.quantity} ${invoiceItem?.item?.uom?.abbreviation}`,
    {
      text: `${invoiceItem?.price.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR'
      })}`.replace('₹', ''),
      alignment: 'right'
    }
  ])
  pdfMake
    .createPdf({
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
                      style: { fontSize: FontSizes.HeadTitleFontSize }
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
                `Date: ${format(invoice?.date, 'dd/MM/yyyy')}`,
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
            fillColor: function (rowIndex, node, columnIndex) {
              if (rowIndex === 0) {
                return '#dbdbdb'
              }
              return rowIndex % 2 === 0 ? '#f4f4f4' : null
            }
          }
        },
        [
          {
            table: {
              widths: [''],
              body: []
            }
          }
        ]
      ]
    })
    .download(`${invoice.party.name?.split(' ').join('-')}-invoice-no:${invoice?.no}}`)
}
