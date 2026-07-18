import { prisma } from '@troithWeb/prisma'
import { Prisma } from '@prisma/client'

export function CompanyRepository() {
  return {
    findById: (id: string) => {
      return prisma.company.findUnique({
        where: {
          id
        }
      })
    },
    findByUserId: (userId: string) => {
      return prisma.company.findMany({
        where: {
          userId
        }
      })
    },
    create: (company: Prisma.Args<typeof prisma.company, 'create'>['data']) => {
      return prisma.company.create({
        data: company
      })
    },
    update: (id: string, data: Prisma.CompanyUpdateInput) => {
      return prisma.company.update({
        where: { id },
        data
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
      const where: Prisma.CompanyWhereInput = { userId, deletedAt: null }

      if (search && search.trim().length > 0) {
        const searchTerm = search.trim()
        where.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { legalName: { contains: searchTerm, mode: 'insensitive' } },
          { gstin: { contains: searchTerm, mode: 'insensitive' } },
          { state: { contains: searchTerm, mode: 'insensitive' } },
          { city: { contains: searchTerm, mode: 'insensitive' } }
        ]
      }

      const [data, total] = await Promise.all([
        prisma.company.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder }
        }),
        prisma.company.count({ where })
      ])

      return { data, total }
    }
  }
}
