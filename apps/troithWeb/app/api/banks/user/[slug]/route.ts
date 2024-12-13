import { NextRequest, NextResponse } from 'next/server'
import { BankRepository } from '@troithWeb/repositories/bank.repository'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const userId = params.slug
  try {
    const bankRepository = BankRepository()
    const banks = await bankRepository.findByUserId(userId)

    return NextResponse.json(banks, { status: 201 })
  } catch (error) {
    console.error('Error finding banks:', error)
    return NextResponse.json({ error: 'Unable to find banks' }, { status: 500 })
  }
}
