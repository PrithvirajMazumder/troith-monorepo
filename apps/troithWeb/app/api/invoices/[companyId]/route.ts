import { NextRequest, NextResponse } from 'next/server'
import { InvoiceRepository } from '@troithWeb/repositories/invoice.repository'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const companyId = (await params).slug
  try {
    const invoiceRepository = InvoiceRepository()
    const invoices = await invoiceRepository.findByCompanyId(companyId)

    return NextResponse.json(
      invoices.map((invoice) => ({
        ...invoice,
        InvoiceItem: invoice.InvoiceItem.map((item) => ({
          ...item,
          quantity: item.quantity.toString(),
          price: item.price.toString()
        }))
      })),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error finding invoices:', error)
    return NextResponse.json({ error: 'Unable to find invoices' }, { status: 500 })
  }
}
