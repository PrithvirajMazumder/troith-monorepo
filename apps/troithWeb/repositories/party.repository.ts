import { Prisma } from '@prisma/client'
import { prisma } from '@troithWeb/prisma'

export const PartyRepository = () => {
  return {
    create: (party: Prisma.Args<typeof prisma.party, 'create'>['data']) => {
      return prisma.party.create({ data: party })
    },
    findByCompanyId: (companyId: string) => {
      return prisma.party.findMany({
        where: { companyId },
        include: {
          PartyItem: {
            include: {
              item: true
            }
          }
        }
      })
    },
    findWithSearch: async ({
      companyId,
      search
    }: {
      companyId: string
      search?: string
    }) => {
      const where: Prisma.PartyWhereInput = { companyId, deletedAt: null }

      if (search && search.trim().length > 0) {
        const searchTerm = search.trim()
        where.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { gstin: { contains: searchTerm, mode: 'insensitive' } },
          { state: { contains: searchTerm, mode: 'insensitive' } }
        ]
      }

      return prisma.party.findMany({
        where,
        include: {
          PartyItem: {
            include: {
              item: true
            }
          }
        }
      })
    }
  }
}
