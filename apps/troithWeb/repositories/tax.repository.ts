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

        }
      })
    }
  }
}
