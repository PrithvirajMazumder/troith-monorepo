import { NextRequest, NextResponse } from 'next/server'
import { PartyRepository } from '@troithWeb/repositories/party.repository'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const companyId = params.slug
  const { searchParams } = request.nextUrl
  const search = searchParams.get('search') || ''

  try {
    const partyRepository = PartyRepository()

    if (search) {
      const parties = await partyRepository.findWithSearch({
        companyId,
        search: search || undefined
      })
      return NextResponse.json(parties, { status: 200 })
    }

    const parties = await partyRepository.findByCompanyId(companyId)
    return NextResponse.json(parties, { status: 201 })
  } catch (error) {
    console.error('Error finding parties:', error)
    return NextResponse.json({ error: 'Unable to find parties' }, { status: 500 })
  }
}
