import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { PartyRepository } from '@troithWeb/repositories/party.repository'

export async function POST(req: NextRequest) {
  try {
    const partyData: Prisma.PartyCreateInput = await req.json()
    const newParty = await PartyRepository().create(partyData)

    return NextResponse.json(newParty, { status: 201 })
  } catch (error) {
    console.error('Error creating party:', error)
    return NextResponse.json({ error: 'Unable to create party' }, { status: 500 })
  }
}
