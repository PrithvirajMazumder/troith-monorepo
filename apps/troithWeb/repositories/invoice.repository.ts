import { prisma } from '@troithWeb/prisma'
import { Prisma, InvoiceStatus } from '@prisma/client'
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
    findByCompanyIdWithFilters: async ({
      companyId,
      search,
      statuses,
      page,
      limit
    }: {
      companyId: string
      search?: string
      statuses?: InvoiceStatus[]
      page: number
      limit: number
    }) => {
      const where: Prisma.InvoiceWhereInput = { companyId }

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
