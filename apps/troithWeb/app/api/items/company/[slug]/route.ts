import { NextRequest, NextResponse } from 'next/server'
import { ItemRepository } from '@troithWeb/repositories/item.repository'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const companyId = params.slug
  try {
    const itemRepository = ItemRepository()
    const items = await itemRepository.findByCompanyId(companyId)

    return NextResponse.json(items, { status: 201 })
  } catch (error) {
    console.error('Error finding invoice:', error)
    return NextResponse.json({ error: 'Unable to find invoice' }, { status: 500 })
  }
}
