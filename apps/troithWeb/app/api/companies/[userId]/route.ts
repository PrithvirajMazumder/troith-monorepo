import { NextRequest, NextResponse } from 'next/server'
import { CompanyRepository } from '@troithWeb/repositories/company.repository'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const userId = (await params).slug
  try {
    const companyRepository = CompanyRepository()
    const companies = await companyRepository.findByUserId(userId)

    return NextResponse.json(companies, { status: 201 })
  } catch (error) {
    console.error('Error finding companies:', error)
    return NextResponse.json({ error: 'Unable to find companies' }, { status: 500 })
  }
}
