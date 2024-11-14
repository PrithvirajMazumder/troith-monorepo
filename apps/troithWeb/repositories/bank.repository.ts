import { Prisma } from '@prisma/client'
import { prisma } from '@troithWeb/prisma'

export const BankRepository = () => {
  return {
    create: (bank: Prisma.Args<typeof prisma.bank, 'create'>['data']) => {
      return prisma.bank.create({ data: bank })
    }
  }
}
