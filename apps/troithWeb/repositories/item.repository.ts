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
    },
    findWithFilters: async ({
      companyId,
      search,
      page,
      limit,
      sortBy = 'name',
      sortOrder = 'asc'
    }: {
      companyId: string
      search?: string
      page: number
      limit: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }) => {
      const where: Prisma.ItemWhereInput = { companyId, deletedAt: null }

      if (search && search.trim().length > 0) {
        const searchTerm = search.trim()
        const orConditions: Prisma.ItemWhereInput[] = [
          { name: { contains: searchTerm, mode: 'insensitive' } }
        ]
        const parsedHsn = parseInt(searchTerm, 10)
        if (!isNaN(parsedHsn)) {
          orConditions.push({ hsn: parsedHsn })
        }
        where.OR = orConditions
      }

      const [data, total] = await Promise.all([
        prisma.item.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: { uom: true, tax: true }
        }),
        prisma.item.count({ where })
      ])

      return { data, total }
    }
  }
}
