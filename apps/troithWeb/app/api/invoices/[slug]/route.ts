import { NextRequest, NextResponse } from 'next/server'
import { InvoiceRepository } from '@troithWeb/repositories/invoice.repository'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const invoiceId = params.slug
  try {
    const invoiceRepository = InvoiceRepository()
    const invoice = await invoiceRepository.findById(invoiceId)

    return NextResponse.json(
      {
        ...invoice,
        InvoiceItem: invoice?.InvoiceItem.map((item) => ({
          ...item,
          quantity: item.quantity.toString(),
          price: item.price.toString()
        }))
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error finding invoice:', error)
    return NextResponse.json({ error: 'Unable to find invoice' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const invoiceId = (await params).slug
  try {
    const invoiceRepository = InvoiceRepository()
    const invoice = await invoiceRepository.findById(invoiceId)

    return NextResponse.json(
      {
        ...invoice,
        InvoiceItem: invoice?.InvoiceItem.map((item) => ({
          ...item,
          quantity: item.quantity.toString(),
          price: item.price.toString()
        }))
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error finding invoice:', error)
    return NextResponse.json({ error: 'Unable to find invoice' }, { status: 500 })
  }
}
