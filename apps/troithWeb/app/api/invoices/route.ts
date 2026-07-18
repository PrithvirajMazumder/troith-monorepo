import { NextRequest, NextResponse } from 'next/server'
import { InvoiceItem, Prisma } from '@prisma/client'
import { InvoiceRepository } from '@troithWeb/repositories/invoice.repository'
import { getFinancialYear } from '@troithWeb/utils/financialYear'

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

export async function POST(req: NextRequest) {
  try {
    let invoiceData: Prisma.InvoiceCreateInput & { invoiceItems?: InvoiceItem[] } = await req.json()
    const financialYear = getFinancialYear(new Date(invoiceData.date as string))
    invoiceData = {
      ...invoiceData,
      financialYear,
      InvoiceItem: {
        create: invoiceData?.invoiceItems?.map((invoiceItem) => ({
          quantity: BigInt(invoiceItem.quantity),
          price: invoiceItem.price,
          isPriceTotal: invoiceItem.isPriceTotal,
          item: {
            connect: { id: invoiceItem.itemId }
          }
        }))
      }
    }
    delete invoiceData.invoiceItems
    const newInvoice = await InvoiceRepository().create(invoiceData)

    return NextResponse.json(serializeBigInt(newInvoice), { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Unable to create invoice' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const no = searchParams.get('no')
  const companyId = searchParams.get('companyId')
  const financialYear = searchParams.get('financialYear')

  if (!no || !companyId || !financialYear) {
    return NextResponse.json({ error: 'no, companyId, and financialYear are required' }, { status: 400 })
  }

  try {
    const invoiceRepository = InvoiceRepository()
    const invoice = await invoiceRepository.findByNo(parseInt(no), companyId, financialYear)

    return NextResponse.json(serializeBigInt(invoice), { status: 200 })
  } catch (error) {
    console.error('Error finding invoice:', error)
    return NextResponse.json({ error: 'Unable to find invoice' }, { status: 500 })
  }
}
