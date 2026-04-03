import { NextRequest, NextResponse } from 'next/server'
import { InvoiceRepository } from '@troithWeb/repositories/invoice.repository'
import { InvoiceStatus } from '@prisma/client'

function serializeBigInt(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'bigint') return obj.toString()
  if (obj instanceof Date) return obj.toISOString()
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

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const companyId = params.slug
  const { searchParams } = request.nextUrl

  const search = searchParams.get('search') || ''
  const statusParam = searchParams.get('status') || ''
  const statuses = statusParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean) as InvoiceStatus[]
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10) || 20))

  try {
    const invoiceRepository = InvoiceRepository()
    const { invoices, total } = await invoiceRepository.findByCompanyIdWithFilters({
      companyId,
      search: search || undefined,
      statuses: statuses.length > 0 ? statuses : undefined,
      page,
      limit
    })

    return NextResponse.json(serializeBigInt({ invoices, total }), { status: 200 })
  } catch (error) {
    console.error('Error finding invoices:', error)
    return NextResponse.json({ error: 'Unable to find invoices' }, { status: 500 })
  }
}
