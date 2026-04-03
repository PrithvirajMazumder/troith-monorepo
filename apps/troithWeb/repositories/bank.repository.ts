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
    },
    findWithFilters: async ({
      userId,
      search,
      page,
      limit,
      sortBy = 'name',
      sortOrder = 'asc'
    }: {
      userId: string
      search?: string
      page: number
      limit: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }) => {
      const where: Prisma.BankWhereInput = { userId, deletedAt: null }

      if (search && search.trim().length > 0) {
        const searchTerm = search.trim()
        where.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { ifsc: { contains: searchTerm, mode: 'insensitive' } },
          { branch: { contains: searchTerm, mode: 'insensitive' } },
          { holderName: { contains: searchTerm, mode: 'insensitive' } }
        ]
      }

      const [data, total] = await Promise.all([
        prisma.bank.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder }
        }),
        prisma.bank.count({ where })
      ])

      return { data, total }
    }
  }
}
