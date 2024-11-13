import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { CompanyRepository } from '@troithWeb/repositories/company.repository'

export async function POST(req: NextRequest) {
  try {
    // Parse the request body as JSON
    const companyData: Prisma.CompanyCreateInput = await req.json()

    // Create the new company record
    const newCompany = await CompanyRepository().create(companyData)

    return NextResponse.json(newCompany, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json({ error: 'Unable to create company' }, { status: 500 })
  }
}
