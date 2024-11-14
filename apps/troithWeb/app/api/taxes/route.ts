import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { TaxRepository } from '@troithWeb/repositories/tax.repository'

export async function POST(req: NextRequest) {
  try {
    const taxData: Prisma.TaxCreateInput = await req.json()
    const newTax = await TaxRepository().create(taxData)

    return NextResponse.json(newTax, { status: 201 })
  } catch (error) {
    console.error('Error creating tax:', error)
    return NextResponse.json({ error: 'Unable to create tax' }, { status: 500 })
  }
}
