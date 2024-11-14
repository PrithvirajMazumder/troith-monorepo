import { Prisma } from '@prisma/client'
import { prisma } from '@troithWeb/prisma'

export const PartyRepository = () => {
  return {
    create: (party: Prisma.Args<typeof prisma.party, 'create'>['data']) => {
      return prisma.party.create({ data: party })
    }
  }
}
