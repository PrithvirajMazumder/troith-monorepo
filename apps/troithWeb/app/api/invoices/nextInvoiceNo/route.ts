import { NextResponse } from 'next/server'
import { InvoiceRepository } from '@troithWeb/repositories/invoice.repository'

export async function GET() {
  try {
    const invoiceRepository = InvoiceRepository()
    const invoiceNo = await invoiceRepository.findNextInvoiceNo()

    return NextResponse.json(invoiceNo)
  } catch (error) {
    console.error('Error finding invoice:', error)
    return NextResponse.json({ error: 'Unable to find invoice' }, { status: 500 })
  }
}
