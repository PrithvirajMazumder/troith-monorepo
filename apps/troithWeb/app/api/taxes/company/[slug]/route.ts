import { NextRequest, NextResponse } from 'next/server'
import { TaxRepository } from '@troithWeb/repositories/tax.repository'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const companyId = params.slug
  try {
    const taxRepository = TaxRepository()
    const taxes = await taxRepository.findByCompanyId(companyId)
    console.log('taxes: ', JSON.stringify(taxes))
    return NextResponse.json(taxes, { status: 201 })
  } catch (error) {
    console.error('Error finding taxes:', error)
    return NextResponse.json({ error: 'Unable to find taxes' }, { status: 500 })
  }
}
