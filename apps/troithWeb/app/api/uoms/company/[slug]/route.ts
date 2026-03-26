import { NextRequest, NextResponse } from 'next/server'
import { UomRepository } from '@troithWeb/repositories/uom.repository'
import { CompanyRepository } from '@troithWeb/repositories/company.repository'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const companyId = params.slug
  try {
    const companyRepository = CompanyRepository()
    const company = await companyRepository.findById(companyId)
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }
    const uomRepository = UomRepository()
    const uoms = await uomRepository.findByUserId(company.userId)

    return NextResponse.json(uoms, { status: 200 })
  } catch (error) {
    console.error('Error finding uoms:', error)
    return NextResponse.json({ error: 'Unable to find uoms' }, { status: 500 })
  }
}
