import { NextResponse } from 'next/server'
import { prisma } from '@troithWeb/prisma'

function serializeBigInt(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'bigint') return obj.toString()
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(serializeBigInt)
    }
    const result: Record<string, unknown> = {}
    for (const key in obj) {
      result[key] = serializeBigInt((obj as Record<string, unknown>)[key])
    }
    return result
  }
  return obj
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const company = await prisma.company.findUnique({
      where: { id: slug }
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    const invoices = await prisma.invoice.findMany({
      where: { companyId: slug },
      include: {
        InvoiceItem: {
          include: {
            item: true
          }
        },
        party: true
      }
    })

    const totalRevenue = invoices.reduce((sum, inv) => {
      const invTotal = inv.InvoiceItem.reduce((itemSum, item) => {
        const price = Number(item.price)
        const qty = Number(item.quantity)
        return itemSum + price * Number(qty)
      }, 0)
      return sum + invTotal
    }, 0)

    const statusCounts = invoices.reduce((acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const partyRevenue: Record<string, { name: string; revenue: number }> = {}
    invoices.forEach((inv) => {
      const partyName = inv.party?.name || 'Unknown'
      const invTotal = inv.InvoiceItem.reduce((sum, item) => {
        return sum + Number(item.price) * Number(item.quantity)
      }, 0)
      if (!partyRevenue[partyName]) {
        partyRevenue[partyName] = { name: partyName, revenue: 0 }
      }
      partyRevenue[partyName].revenue += invTotal
    })

    const monthlyData: Record<string, { month: string; revenue: number; count: number }> = {}
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toISOString().slice(0, 7)
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      monthlyData[monthKey] = { month: monthName, revenue: 0, count: 0 }
    }

    invoices.forEach((inv) => {
      const monthKey = inv.date.toISOString().slice(0, 7)
      if (monthlyData[monthKey]) {
        const invTotal = inv.InvoiceItem.reduce((sum, item) => {
          return sum + Number(item.price) * Number(item.quantity)
        }, 0)
        monthlyData[monthKey].revenue += invTotal
        monthlyData[monthKey].count += 1
      }
    })

    return NextResponse.json(
      serializeBigInt({
        summary: {
          totalRevenue,
          totalInvoices: invoices.length,
          averageInvoiceValue: invoices.length > 0 ? totalRevenue / invoices.length : 0
        },
        statusBreakdown: Object.entries(statusCounts).map(([status, count]) => ({
          status,
          count
        })),
        topParties: Object.values(partyRevenue)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5),
        monthlyRevenue: Object.values(monthlyData)
      })
    )
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
