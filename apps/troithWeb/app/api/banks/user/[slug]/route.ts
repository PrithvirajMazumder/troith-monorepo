import { NextRequest, NextResponse } from 'next/server'
import { BankRepository } from '@troithWeb/repositories/bank.repository'

function serializeBigInt(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'bigint') return obj.toString()
  if (obj instanceof Date) return obj.toISOString()
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(serializeBigInt)
    }
    const result: Record<string, unknown> = {}
    for (const key in obj) {
      result[key] = serializeBigInt((obj as Record<string, unknown>)[key])
    }
    return result
  }
  return obj
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const userId = params.slug
  const { searchParams } = request.nextUrl

  const search = searchParams.get('search') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10) || 20))
  const sortBy = searchParams.get('sortBy') || 'name'
  const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

  try {
    const bankRepository = BankRepository()
    const result = await bankRepository.findWithFilters({
      userId,
      search: search || undefined,
      page,
      limit,
      sortBy,
      sortOrder
    })

    return NextResponse.json(serializeBigInt(result), { status: 200 })
  } catch (error) {
    console.error('Error finding banks:', error)
    return NextResponse.json({ error: 'Unable to find banks' }, { status: 500 })
  }
}
