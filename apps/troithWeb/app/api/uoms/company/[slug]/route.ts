import { NextRequest, NextResponse } from 'next/server'
import { UomRepository } from '@troithWeb/repositories/uom.repository'
import { CompanyRepository } from '@troithWeb/repositories/company.repository'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const companyId = params.slug
  const { searchParams } = request.nextUrl

  const search = searchParams.get('search') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10) || 20))
  const sortBy = searchParams.get('sortBy') || 'name'
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

  try {
    const companyRepository = CompanyRepository()
    const company = await companyRepository.findById(companyId)
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }
    const uomRepository = UomRepository()
    const result = await uomRepository.findWithFilters({
      userId: company.userId,
      search: search || undefined,
      page,
      limit,
      sortBy,
      sortOrder
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error finding uoms:', error)
    return NextResponse.json({ error: 'Unable to find uoms' }, { status: 500 })
  }
}
