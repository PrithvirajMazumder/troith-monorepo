import { NextRequest, NextResponse } from 'next/server'
import { CompanyRepository } from '@troithWeb/repositories/company.repository'
import { auth } from '@troithWeb/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const company = await CompanyRepository().findById(id)
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json({ error: 'Unable to fetch company' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await req.json()
    const updated = await CompanyRepository().update(id, data)

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating company:', error)
    return NextResponse.json({ error: 'Unable to update company' }, { status: 500 })
  }
}
