import { NextRequest, NextResponse } from 'next/server'
import { TaxRepository } from '@troithWeb/repositories/tax.repository'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const companyId = params.slug
  const { searchParams } = request.nextUrl

  const search = searchParams.get('search') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10) || 20))
  const sortBy = searchParams.get('sortBy') || 'cgst'
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

  try {
    const taxRepository = TaxRepository()
    const result = await taxRepository.findWithFilters({
      companyId,
      search: search || undefined,
      page,
      limit,
      sortBy,
      sortOrder
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error finding taxes:', error)
    return NextResponse.json({ error: 'Unable to find taxes' }, { status: 500 })
  }
}
