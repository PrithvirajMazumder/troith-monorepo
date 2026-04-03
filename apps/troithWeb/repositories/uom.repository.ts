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
      }),
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
      const where: Prisma.UomWhereInput = { userId, deletedAt: null }

      if (search && search.trim().length > 0) {
        const searchTerm = search.trim()
        where.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { abbreviation: { contains: searchTerm, mode: 'insensitive' } }
        ]
      }

      const [data, total] = await Promise.all([
        prisma.uom.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder }
        }),
        prisma.uom.count({ where })
      ])

      return { data, total }
    }
  }
}
