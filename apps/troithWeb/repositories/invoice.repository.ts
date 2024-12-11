import { prisma } from '@troithWeb/prisma'
import { Prisma } from '@prisma/client'
import { UpdateInvoice } from '@troithWeb/types/invoices'

export const InvoiceRepository = () => {
  return {
    create: (invoice: Prisma.Args<typeof prisma.invoice, 'create'>['data']) => {
      return prisma.invoice.create({ data: invoice })
    },
    findNextInvoiceNo: async () => {
      const latestInvoice = await prisma.invoice.findFirst({
        orderBy: {
          no: 'desc'
        },
        select: {
          no: true
        }
      })

      return (latestInvoice?.no || 0) + 1
    },
    findByCompanyId: (companyId: string) => {
      return prisma.invoice.findMany({
        where: { companyId },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          InvoiceItem: {
            include: {
              item: {
                include: {
                  uom: true,
                  tax: true
                }
              }
            }
          },
          company: true,
          bank: true,
          tax: true,
          party: true
        }
      })
    },
    findById: (id: string) => {
      return prisma.invoice.findUnique({
        where: {
          id: id
        },
        include: {
          InvoiceItem: {
            include: {
              item: {
                include: {
                  uom: true,
                  tax: true
                }
              }
            }
          },
          company: true,
          bank: true,
          tax: true,
          party: true
        }
      })
    },
    findByNo: (no: number) => {
      return prisma.invoice.findUnique({
        where: {
          no: no
        },
        include: {
          InvoiceItem: {
            include: {
              item: {
                include: {
                  uom: true,
                  tax: true
                }
              }
            }
          },
          company: true,
          bank: true,
          tax: true,
          party: true
        }
      })
    },
    update: (newInvoiceData: UpdateInvoice, invoiceId: string) => {
      return prisma.invoice.update({
        where: {
          id: invoiceId
        },
        data: {
          ...newInvoiceData
        },
        include: {
          InvoiceItem: {
            include: {
              item: {
                include: {
                  uom: true,
                  tax: true
                }
              }
            }
          },
          company: true,
          bank: true,
          tax: true,
          party: true
        }
      })
    }
  }
}
