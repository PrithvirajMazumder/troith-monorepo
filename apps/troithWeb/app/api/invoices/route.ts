import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { InvoiceRepository } from '@troithWeb/repositories/invoice.repository'

export async function POST(req: NextRequest) {
  try {
    const invoiceData: Prisma.InvoiceCreateInput = await req.json()
    const newInvoice = await InvoiceRepository().create(invoiceData)

    return NextResponse.json(newInvoice, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Unable to create invoice' }, { status: 500 })
  }
}
