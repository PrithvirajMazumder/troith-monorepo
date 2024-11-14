import { prisma } from '@troithWeb/prisma'
import { Prisma } from '@prisma/client'

export const InvoiceRepository = () => {
  return {
    create: (invoice: Prisma.Args<typeof prisma.invoice, 'create'>['data']) => {
      return prisma.invoice.create({ data: invoice })
    },
    findByCompanyId: (companyId: string) => {
      return prisma.invoice.findMany({
        where: { companyId },
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
