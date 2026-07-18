import { NextRequest, NextResponse } from 'next/server'
import { InvoiceRepository } from '@troithWeb/repositories/invoice.repository'

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const invoiceRepository = InvoiceRepository()
    const financialYears = await invoiceRepository.findFinancialYears(params.slug)

    return NextResponse.json(financialYears)
  } catch (error) {
    console.error('Error finding financial years:', error)
    return NextResponse.json({ error: 'Unable to find financial years' }, { status: 500 })
  }
}
