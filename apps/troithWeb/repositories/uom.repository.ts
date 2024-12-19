import { Prisma } from '@prisma/client'
import { prisma } from '@troithWeb/prisma'

export const UomRepository = () => {
  return {
    create: (uom: Prisma.Args<typeof prisma.uom, 'create'>['data']) => {
      return prisma.uom.create({ data: uom })
    },
    findByUserId: (userId: string) =>
      prisma.uom.findMany({
        where: {
          userId
        }
      })
  }
}
