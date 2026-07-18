import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function getFinancialYear(date: Date): string {
  const month = date.getMonth()
  const year = date.getFullYear()
  if (month >= 3) {
    return `${String(year).slice(-2)}-${String(year + 1).slice(-2)}`
  }
  return `${String(year - 1).slice(-2)}-${String(year).slice(-2)}`
}

async function main() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { no: 'asc' },
    select: { id: true, date: true, companyId: true, no: true }
  })

  const groups = new Map<string, { id: string; date: Date; companyId: string; no: number }[]>()
  for (const inv of invoices) {
    const fy = getFinancialYear(new Date(inv.date))
    const key = `${inv.companyId}::${fy}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(inv)
  }

  for (const [key, group] of groups) {
    const fy = key.split('::')[1]
    for (let i = 0; i < group.length; i++) {
      await prisma.invoice.update({
        where: { id: group[i].id },
        data: { financialYear: fy, no: i + 1 }
      })
    }
  }

  console.log(`Migrated ${invoices.length} invoices across ${groups.size} company-FY groups`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
