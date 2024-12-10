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
    }
  }
}
