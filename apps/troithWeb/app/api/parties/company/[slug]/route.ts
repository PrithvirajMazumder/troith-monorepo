import { NextRequest, NextResponse } from 'next/server'
import { PartyRepository } from '@troithWeb/repositories/party.repository'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const companyId = params.slug
  try {
    const partyRepository = PartyRepository()
    const parties = await partyRepository.findByCompanyId(companyId)

    return NextResponse.json(parties, { status: 201 })
  } catch (error) {
    console.error('Error finding invoice:', error)
    return NextResponse.json({ error: 'Unable to find invoice' }, { status: 500 })
  }
}
