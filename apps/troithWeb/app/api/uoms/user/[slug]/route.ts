import { NextRequest, NextResponse } from 'next/server'
import { UomRepository } from '@troithWeb/repositories/uom.repository'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const userId = params.slug
  try {
    const uomRepository = UomRepository()
    const uoms = await uomRepository.findByUserId(userId)

    return NextResponse.json(uoms, { status: 201 })
  } catch (error) {
    console.error('Error finding uoms:', error)
    return NextResponse.json({ error: 'Unable to find uoms' }, { status: 500 })
  }
}
