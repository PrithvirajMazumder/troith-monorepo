import { NextRequest, NextResponse } from 'next/server'
import { InvoiceRepository } from '@troithWeb/repositories/invoice.repository'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const companyId = (await params).slug
  try {
    const invoiceRepository = InvoiceRepository()
    const companies = await invoiceRepository.findByCompanyId(companyId)

    return NextResponse.json(companies, { status: 201 })
  } catch (error) {
    console.error('Error finding invoices:', error)
    return NextResponse.json({ error: 'Unable to find invoices' }, { status: 500 })
  }
}
