import { NextRequest, NextResponse } from 'next/server'
import { InvoiceItem, Prisma } from '@prisma/client'
import { InvoiceRepository } from '@troithWeb/repositories/invoice.repository'

export async function POST(req: NextRequest) {
  try {
    let invoiceData: Prisma.InvoiceCreateInput & { invoiceItems?: InvoiceItem[] } = await req.json()
    invoiceData = {
      ...invoiceData,
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

    return NextResponse.json(newInvoice, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Unable to create invoice' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const no = searchParams.get('no') || 'all'
  try {
    const invoiceRepository = InvoiceRepository()
    const invoice = await invoiceRepository.findByNo(parseInt(no))

    return NextResponse.json(
      invoice
        ? {
            ...invoice,
            InvoiceItem: invoice?.InvoiceItem.map((item) => ({
              ...item,
              quantity: item.quantity.toString(),
              price: item.price.toString()
            }))
          }
        : null,
      { status: 201 }
    )
  } catch (error) {
    console.error('Error finding invoice:', error)
    return NextResponse.json({ error: 'Unable to find invoice' }, { status: 500 })
  }
}
