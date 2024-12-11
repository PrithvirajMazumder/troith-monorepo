import { Prisma } from '@prisma/client'
import { prisma } from '@troithWeb/prisma'

export const ItemRepository = () => {
  return {
    create: (item: Prisma.Args<typeof prisma.item, 'create'>['data']) => {
      return prisma.item.create({ data: item })
    },
    findByCompanyId: (companyId: string) => {
      return prisma.item.findMany({
        where: { companyId },
        include: {
          uom: true,
          tax: true,
        }
      })
    }
  }
}
