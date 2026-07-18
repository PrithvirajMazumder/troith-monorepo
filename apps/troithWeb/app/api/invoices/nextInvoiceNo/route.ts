import { NextRequest, NextResponse } from 'next/server'
import { InvoiceRepository } from '@troithWeb/repositories/invoice.repository'
import { getFinancialYear, formatInvoiceNo } from '@troithWeb/utils/financialYear'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const companyId = searchParams.get('companyId')
    const dateStr = searchParams.get('date')

    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 })
    }

    const financialYear = dateStr ? getFinancialYear(new Date(dateStr)) : getFinancialYear(new Date())
    const invoiceRepository = InvoiceRepository()
    const no = await invoiceRepository.findNextInvoiceNo(companyId, financialYear)

    return NextResponse.json({ no, financialYear, formatted: formatInvoiceNo(no, financialYear) })
  } catch (error) {
    console.error('Error finding next invoice number:', error)
    return NextResponse.json({ error: 'Unable to find next invoice number' }, { status: 500 })
  }
}
