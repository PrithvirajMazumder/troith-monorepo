import { Invoice } from '@troithWeb/__generated__/graphql'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { robotoBase64 } from '@troithWeb/public/fonts/robotto'
import { capitalize } from '@troithWeb/utils/string'
import { getGrossTotalValueFromInvoiceItems, InvoiceFontSizes } from '@troithWeb/app/tool/invoices/utils/generateCompleteInvoice'
import { TDocumentDefinitions } from 'pdfmake/interfaces'
import { convertAmountToInr } from '@troithWeb/utils/currency'
import { getDecimalPart } from '@troithWeb/utils/number'
import { format } from 'date-fns'
import { getInvoiceTotals } from '@troithWeb/app/tool/invoices/create/utils/getInvoiceTotals'

pdfMake.vfs = pdfFonts.pdfMake.vfs
window.pdfMake.vfs['Roboto.ttf'] = robotoBase64

const generate = (pdf: TDocumentDefinitions) => {
  return pdfMake.createPdf(pdf)
}

const putPartyData = ({ party }: Pick<Invoice, 'party'>, pdf: TDocumentDefinitions) => {
  const newPdf = { ...pdf }
  // @ts-expect-error while copying content becomes un-iterable
  newPdf.content[0].table.body[0][2] = {
    stack: [
      'To,',
      capitalize(party?.name ?? ''),
      capitalize([party?.addressLine1, party?.addressLine2, party?.city].filter((addressPart) => addressPart?.length).join(', ')),
      {
        text: capitalize(`${party?.state}: ${party?.zipCode}`),
        style: { marginBottom: 10 }
      },
      `Vehicle No: `
    ],
    rowSpan: 3,
    colSpan: 2
  }

  return {
    generate: () => generate(newPdf),
    putInvoiceItems: (invoiceItems: Pick<Invoice, 'invoiceItems'>) => putInvoiceItems(invoiceItems, pdf),
    highlightParty: () => highlights.party(newPdf),
    highlightInvoiceItems: () => highlights.invoiceItems(newPdf),
    highlightFinalInvoiceInfo: () => highlights.finalInvoiceInfo(newPdf)
  }
}

const putInvoiceItems = ({ invoiceItems }: Pick<Invoice, 'invoiceItems'>, pdf: TDocumentDefinitions) => {
  const items = invoiceItems?.map((invoiceItem, index) => [
    index + 1,
    invoiceItem?.item?.name ?? '',
    invoiceItem?.item?.hsn ?? '',
    `${invoiceItem?.quantity} ${invoiceItem?.item?.uom?.abbreviation}`,
    {
      text: `${convertAmountToInr(invoiceItem?.price, false)}`,
      alignment: 'right'
    }
  ])

  const newPdf = { ...pdf }
  // @ts-expect-error while copying content becomes un-iterable
  newPdf.content[1] = {
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
      fillColor: function (rowIndex: number) {
        if (rowIndex === 0) {
          return '#dbdbdb'
        }
        return rowIndex % 2 === 0 ? '#f4f4f4' : null
      }
    }
  }
  // @ts-expect-error while copying content becomes un-iterable
  newPdf.content[2].table.body[0][3].text = convertAmountToInr(getGrossTotalValueFromInvoiceItems(invoiceItems), false)
  return {
    generate: () => generate(newPdf),
    putPartyData: (party: Pick<Invoice, 'party'>) => putPartyData(party, newPdf),
    highlightInvoiceItems: () => highlights.invoiceItems(newPdf),
    highlightFinalInvoiceInfo: () => highlights.finalInvoiceInfo(newPdf),
    highlightParty: () => highlights.party(newPdf),
    putInvoiceItems: (invoiceItems: Pick<Invoice, 'invoiceItems'>) => putInvoiceItems(invoiceItems, pdf)
  }
}

const putFinalInvoiceInfo = (invoice: Partial<Omit<Invoice, 'party' | 'company' | 'status' | 'id'>>, basePdf: TDocumentDefinitions) => {
  const newPdf = { ...basePdf }
  const { cgst, grossTotal, igst, netTotal, roundOff, sgst } = getInvoiceTotals({
    invoiceItems: invoice.invoiceItems ?? [],
    tax: invoice.tax
  })

  // @ts-expect-error while copying content becomes un-iterable
  const thirdSection = newPdf.content[2].table
  thirdSection.body[1][3].text = convertAmountToInr(sgst, false)
  thirdSection.body[2][3].text = convertAmountToInr(cgst, false)
  thirdSection.body[3][3].text = convertAmountToInr(igst, false)
  thirdSection.body[4][3].text = convertAmountToInr(roundOff, false)
  thirdSection.body[5][3].text = convertAmountToInr(netTotal, false)
  const bankSection = thirdSection.body[0][1].stack
  if (invoice?.bank) {
    bankSection[2].text = invoice?.bank?.accountNumber
    bankSection[4].text = invoice.bank?.ifsc?.toUpperCase()
    bankSection[6].text = capitalize(invoice.bank?.name ?? '')
    bankSection[8].text = capitalize(invoice.bank?.branch ?? '')
  }
  // @ts-expect-error while copying content becomes un-iterable
  const firstSection = newPdf.content[0].table
  firstSection.body[0][2].stack[4] = `Vehicle No: ${invoice?.vehicleNumber}`
  firstSection.body[3][2] = `Invoice No: ${invoice?.no ? invoice?.no : ''}`
  firstSection.body[4][2] = `Date: ${invoice?.date?.length ? format(invoice?.date, 'dd/MM/yyyy') : ''}`

  return {
    generate: () => generate(newPdf),
    putPartyData: (party: Pick<Invoice, 'party'>) => putPartyData(party, newPdf),
    putInvoiceItems: (invoiceItems: Pick<Invoice, 'invoiceItems'>) => putInvoiceItems(invoiceItems, newPdf),
    highlightInvoiceItems: () => highlights.invoiceItems(newPdf),
    highlightFinalInvoiceInfo: () => highlights.finalInvoiceInfo(newPdf),
    highlightParty: () => highlights.party(newPdf)
  }
}

const highlights = {
  party: (basePdf: TDocumentDefinitions) => {
    const newPdf = { ...basePdf }
    // @ts-expect-error while copying content becomes un-iterable
    newPdf.content[0].layout = {
      fillColor: (rowIndex: number, _: unknown, columnIndex: number) => {
        return (rowIndex === 0 || rowIndex === 1 || rowIndex === 2) && columnIndex === 2 ? '#ffeedd' : '#fff'
      }
    }
    return {
      generate: () => generate(newPdf),
      putPartyData: (party: Pick<Invoice, 'party'>) => putPartyData(party, basePdf),
      putInvoiceItems: (invoiceItems: Pick<Invoice, 'invoiceItems'>) => putInvoiceItems(invoiceItems, basePdf)
    }
  },
  invoiceItems: (basePdf: TDocumentDefinitions) => {
    const newPdf = { ...basePdf }
    // @ts-expect-error while copying content becomes un-iterable
    newPdf.content[1].layout = {
      fillColor: function (rowIndex: number) {
        if (rowIndex === 0) {
          return '#dbdbdb'
        }
        return '#ffeedd'
      }
    }
    // @ts-expect-error while copying content becomes un-iterable
    newPdf.content[2].layout = {
      fillColor: (rowIndex: number, _: unknown, columnIndex: number) => {
        return columnIndex === 3 && rowIndex === 0 ? '#ffeedd' : ''
      }
    }
    return {
      generate: () => generate(newPdf),
      putPartyData: (party: Pick<Invoice, 'party'>) => putPartyData(party, newPdf),
      putInvoiceItems: (invoiceItems: Pick<Invoice, 'invoiceItems'>) => putInvoiceItems(invoiceItems, newPdf)
    }
  },
  finalInvoiceInfo: (basePdf: TDocumentDefinitions) => {
    const newPdf = { ...basePdf }
    // @ts-expect-error while copying content becomes un-iterable
    newPdf.content[0].layout = {
      fillColor: function (rowIndex: number, _: unknown, columnIndex: number) {
        if (rowIndex === 4 && columnIndex === 2) {
          return '#ffeedd'
        }
        if (rowIndex === 3 && (columnIndex === 2 || columnIndex === 3)) {
          return '#ffeedd'
        }
        return ''
      }
    }
    // @ts-expect-error while copying content becomes un-iterable
    newPdf.content[2].layout = {
      fillColor: function (rowIndex: number, _: unknown, columnIndex: number) {
        if ((rowIndex === 3 || rowIndex === 2 || rowIndex === 1 || rowIndex === 4 || rowIndex === 5) && columnIndex === 3) {
          return '#ffeedd'
        }
        if (rowIndex === 6 && (columnIndex === 3 || columnIndex === 2)) {
          return '#ffeedd'
        }
        if (
          (rowIndex === 3 || rowIndex === 2 || rowIndex === 1 || rowIndex === 0 || rowIndex === 4 || rowIndex === 5 || rowIndex === 6) &&
          columnIndex === 1
        ) {
          return '#ffeedd'
        }
        return ''
      }
    }
    return {
      generate: () => generate(newPdf),
      putPartyData: (party: Pick<Invoice, 'party'>) => putPartyData(party, newPdf),
      putInvoiceItems: (invoiceItems: Pick<Invoice, 'invoiceItems'>) => putInvoiceItems(invoiceItems, newPdf)
    }
  }
}

export const getBaseInvoicePdf = ({ company }: Pick<Invoice, 'company'>) => {
  const basePdf: TDocumentDefinitions = {
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
                    text: capitalize(company?.legalName ?? ''),
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
                stack: ['To,'],
                rowSpan: 3,
                colSpan: 2
              },
              ''
            ],
            [
              {
                stack: [
                  capitalize(
                    `Address: ${[company?.addressLine1, company?.addressLine2, company?.city]
                      .filter((addressPart) => addressPart?.length)
                      .join(', ')}`
                  ),
                  { text: capitalize(`${company?.state}: ${company?.zipCode}`) }
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
                text: `Invoice No: `,
                colSpan: 2
              },
              ''
            ],
            [
              {
                text: `GSTIN: ${company?.gstin}`,
                colSpan: 2
              },
              '',
              `Date: `,
              `GSTIN: `
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
            [' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ']
          ]
        }
      },
      {
        marginTop: 10,
        table: {
          widths: ['*', '30%', '15%', '20%'],
          body: [
            [
              { stack: ['E. & O. E.', `For ${capitalize(company?.legalName ?? '')}`], rowSpan: 7 },
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
                    text: ' '
                  },
                  {
                    text: 'IFSC:'
                  },
                  {
                    text: ' '
                  },
                  {
                    text: 'Name:'
                  },
                  {
                    text: ' '
                  },
                  {
                    text: 'Branch:'
                  },
                  {
                    text: ' '
                  }
                ],
                rowSpan: 7
              },
              'Gross Total',
              {
                text: convertAmountToInr(0, false),
                style: { alignment: 'right' }
              }
            ],
            [
              '',
              '',
              'SGST%',
              {
                text: { text: convertAmountToInr(0, false) },
                style: { alignment: 'right' }
              }
            ],
            [
              '',
              '',
              'CGST%',
              {
                text: convertAmountToInr(0, false),
                style: { alignment: 'right' }
              }
            ],
            ['', '', 'IGST%', { text: convertAmountToInr(0, false), style: { alignment: 'right' } }],
            [
              '',
              '',
              'ROUND OFF',
              {
                text: 0,
                style: { alignment: 'right' }
              }
            ],
            [
              '',
              '',
              'NET TOTAL',
              {
                text: convertAmountToInr(0, false),
                style: { alignment: 'right' }
              }
            ],
            ['', '', { text: 'ruppes', colSpan: 2 }, '']
          ]
        }
      }
    ]
  }

  return {
    generate: () => generate(basePdf),
    putPartyData: (party: Pick<Invoice, 'party'>) => putPartyData(party, basePdf),
    putInvoiceItems: (invoiceItems: Pick<Invoice, 'invoiceItems'>) => putInvoiceItems(invoiceItems, basePdf),
    putFinalInvoiceInfo: (invoice: Partial<Omit<Invoice, 'party' | 'company' | 'status' | 'id'>>) => putFinalInvoiceInfo(invoice, basePdf),
    highlightParty: () => highlights.party(basePdf),
    highlightInvoiceItems: () => highlights.invoiceItems(basePdf),
    highlightFinalInvoiceInfo: () => highlights.finalInvoiceInfo(basePdf)
  }
}
