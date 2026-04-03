import { NextRequest, NextResponse } from 'next/server'
import { InvoiceRepository } from '@troithWeb/repositories/invoice.repository'
import { InvoiceType } from '@troithWeb/types/invoices'

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
  const invoiceId = params.slug
  try {
    const invoiceRepository = InvoiceRepository()
    const invoice = await invoiceRepository.findById(invoiceId)

    return NextResponse.json(serializeBigInt(invoice), { status: 201 })
  } catch (error) {
    console.error('Error finding invoice:', error)
    return NextResponse.json({ error: 'Unable to find invoice' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const invoiceId = (await params).slug
  const reqBody: InvoiceType = await request.json()
  const { no, id, ...invoiceData } = reqBody
  try {
    const invoiceRepository = InvoiceRepository()
    const invoice = await invoiceRepository.update(invoiceData, invoiceId)

    return NextResponse.json(serializeBigInt(invoice), { status: 201 })
  } catch (error) {
    console.error('Error finding invoice:', error)
    return NextResponse.json({ error: 'Unable to find invoice' }, { status: 500 })
  }
}
