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
    }
  }
}
