import { NextRequest, NextResponse } from 'next/server'
import { CompanyRepository } from '@troithWeb/repositories/company.repository'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const userId = (await params).slug
  const { searchParams } = request.nextUrl

  const search = searchParams.get('search') || ''
  const page = searchParams.get('page')
  const limit = searchParams.get('limit')
  const sortBy = searchParams.get('sortBy')
  const sortOrder = searchParams.get('sortOrder')

  try {
    const companyRepository = CompanyRepository()

    // If pagination params provided, use filtered query
    if (page || limit) {
      const result = await companyRepository.findWithFilters({
        userId,
        search: search || undefined,
        page: Math.max(1, parseInt(page || '1', 10) || 1),
        limit: Math.max(1, Math.min(100, parseInt(limit || '20', 10) || 20)),
        sortBy: sortBy || 'name',
        sortOrder: (sortOrder || 'asc') as 'asc' | 'desc'
      })
      return NextResponse.json(result, { status: 200 })
    }

    // Otherwise return all (backward compatible for company selector modal)
    const companies = await companyRepository.findByUserId(userId)
    return NextResponse.json(companies, { status: 201 })
  } catch (error) {
    console.error('Error finding companies:', error)
    return NextResponse.json({ error: 'Unable to find companies' }, { status: 500 })
  }
}
