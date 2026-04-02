import { NextRequest, NextResponse } from 'next/server'
import { InvoiceRepository } from '@troithWeb/repositories/invoice.repository'

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
  try {
    const invoiceRepository = InvoiceRepository()
    const invoices = await invoiceRepository.findByCompanyId(companyId)

    return NextResponse.json(serializeBigInt(invoices), { status: 201 })
  } catch (error) {
    console.error('Error finding invoices:', error)
    return NextResponse.json({ error: 'Unable to find invoices' }, { status: 500 })
  }
}
