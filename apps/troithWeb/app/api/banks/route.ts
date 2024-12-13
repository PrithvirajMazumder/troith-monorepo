import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { BankRepository } from '@troithWeb/repositories/bank.repository'

export async function POST(req: NextRequest) {
  try {
    const bankData: Prisma.BankCreateInput = await req.json()
    const newBank = await BankRepository().create(bankData)

    return NextResponse.json(newBank, { status: 201 })
  } catch (error) {
    console.error('Error creating bank:', error)
    return NextResponse.json({ error: 'Unable to create bank' }, { status: 500 })
  }
}



