import { Prisma } from '@prisma/client'
import { prisma } from '@troithWeb/prisma'

export const BankRepository = () => {
  return {
    create: (bank: Prisma.Args<typeof prisma.bank, 'create'>['data']) => {
      return prisma.bank.create({ data: bank })
    },
    findByUserId: (userId: string) => {
      return prisma.bank.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }
  }
}
