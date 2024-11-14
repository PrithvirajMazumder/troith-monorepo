import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { ItemRepository } from '@troithWeb/repositories/item.repository'

export async function POST(req: NextRequest) {
  try {
    const itemData: Prisma.ItemCreateInput = await req.json()
    const newItem = await ItemRepository().create(itemData)

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Error creating tax:', error)
    return NextResponse.json({ error: 'Unable to create tax' }, { status: 500 })
  }
}
