import { Prisma } from '@prisma/client'
import { prisma } from '@troithWeb/prisma'

export const TaxRepository = () => {
  return {
    create: (tax: Prisma.Args<typeof prisma.tax, 'create'>['data']) => {
      return prisma.tax.create({
        data: tax
      })
    },
    findByCompanyId: (companyId: string) => {
      return prisma.tax.findMany({
        where: {
          companyId: companyId
        }
      })
    },
    findWithFilters: async ({
      companyId,
      search,
      page,
      limit,
      sortBy = 'cgst',
      sortOrder = 'asc'
    }: {
      companyId: string
      search?: string
      page: number
      limit: number
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }) => {
      const where: Prisma.TaxWhereInput = { companyId, deletedAt: null }

      if (search && search.trim().length > 0) {
        const parsed = parseInt(search.trim(), 10)
        if (!isNaN(parsed)) {
          where.OR = [{ cgst: parsed }, { sgst: parsed }]
        }
      }

      const [data, total] = await Promise.all([
        prisma.tax.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder }
        }),
        prisma.tax.count({ where })
      ])

      return { data, total }
    }
  }
}
