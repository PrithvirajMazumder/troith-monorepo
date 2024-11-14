import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { TaxRepository } from '@troithWeb/repositories/tax.repository'
import { UomRepository } from '@troithWeb/repositories/uom.repository'

export async function POST(req: NextRequest) {
  try {
    const uomData: Prisma.UomCreateInput = await req.json()
    const newUom = await UomRepository().create(uomData)

    return NextResponse.json(newUom, { status: 201 })
  } catch (error) {
    console.error('Error creating uom:', error)
    return NextResponse.json({ error: 'Unable to create uom' }, { status: 500 })
  }
}
