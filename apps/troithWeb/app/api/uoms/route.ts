import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { UomRepository } from '@troithWeb/repositories/uom.repository'
import { CompanyRepository } from '@troithWeb/repositories/company.repository'

export async function POST(req: NextRequest) {
  try {
    const { name, abbreviation, companyId } = await req.json()
    const companyRepository = CompanyRepository()
    const company = await companyRepository.findById(companyId)
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }
    const uomData: Prisma.UomCreateInput = {
      name,
      abbreviation,
      user: {
        connect: {
          id: company.userId
        }
      }
    }
    const newUom = await UomRepository().create(uomData)

    return NextResponse.json(newUom, { status: 201 })
  } catch (error) {
    console.error('Error creating uom:', error)
    return NextResponse.json({ error: 'Unable to create uom' }, { status: 500 })
  }
}
