import { prisma } from '@troithWeb/prisma'
import { Prisma, InvoiceStatus } from '@prisma/client'
import { UpdateInvoice } from '@troithWeb/types/invoices'

export const InvoiceRepository = () => {
  return {
    create: (invoice: Prisma.Args<typeof prisma.invoice, 'create'>['data']) => {
      return prisma.invoice.create({ data: invoice })
    },
    findNextInvoiceNo: async (companyId: string, financialYear: string) => {
      const latestInvoice = await prisma.invoice.findFirst({
        where: { companyId, financialYear },
        orderBy: { no: 'desc' },
        select: { no: true }
      })
      return (latestInvoice?.no || 0) + 1
    },
    findByCompanyIdWithFilters: async ({
      companyId,
      financialYear,
      search,
      statuses,
      page,
      limit
    }: {
      companyId: string
      financialYear?: string
      search?: string
      statuses?: InvoiceStatus[]
      page: number
      limit: number
    }) => {
      const where: Prisma.InvoiceWhereInput = { companyId }

      if (financialYear) {
        where.financialYear = financialYear
      }

      if (statuses && statuses.length > 0) {
        where.status = { in: statuses }
      }

      if (search && search.trim().length > 0) {
        const searchTerm = search.trim()
        const orConditions: Prisma.InvoiceWhereInput[] = [
          { party: { name: { contains: searchTerm, mode: 'insensitive' } } }
        ]
        const parsedNo = parseInt(searchTerm, 10)
        if (!isNaN(parsedNo)) {
          orConditions.push({ no: parsedNo })
        }
        where.OR = orConditions
      }

      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
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
        }),
        prisma.invoice.count({ where })
      ])

      return { invoices, total }
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
    findByNo: (no: number, companyId: string, financialYear: string) => {
      return prisma.invoice.findUnique({
        where: {
          companyId_financialYear_no: { companyId, financialYear, no }
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
    findFinancialYears: async (companyId: string) => {
      const results = await prisma.invoice.findMany({
        where: { companyId },
        select: { financialYear: true },
        distinct: ['financialYear'],
        orderBy: { financialYear: 'desc' }
      })
      return results.map((r) => r.financialYear)
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
