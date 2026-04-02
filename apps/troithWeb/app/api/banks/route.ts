import { NextRequest, NextResponse } from 'next/server'
import { BankRepository } from '@troithWeb/repositories/bank.repository'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const bankData = {
      ...body,
      accountNumber: BigInt(body.accountNumber)
    }
    const newBank = await BankRepository().create(bankData)
    const serializedBank = {
      ...newBank,
      accountNumber: newBank.accountNumber.toString()
    }

    return NextResponse.json(serializedBank, { status: 201 })
  } catch (error) {
    console.error('Error creating bank:', error)
    return NextResponse.json({ error: 'Unable to create bank' }, { status: 500 })
  }
}
