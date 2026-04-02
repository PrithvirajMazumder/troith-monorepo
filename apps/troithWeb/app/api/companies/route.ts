import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { CompanyRepository } from '@troithWeb/repositories/company.repository'
import { auth } from '@troithWeb/auth'

export async function GET(req: NextRequest) {
  try {
    // Try to get session from cookie or Bearer token
    const authHeader = req.headers.get('authorization')
    let userId: string | null = null

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      // Find the session by token
      const { prisma } = await import('@troithWeb/prisma')
      const session = await prisma.session.findFirst({
        where: {
          sessionToken: token,
          expires: { gt: new Date() },
        },
        include: {
          user: true,
        },
      })
      
      if (session) {
        userId = session.user.id
      }
    }

    if (!userId) {
      // Try NextAuth session
      const session = await auth()
      userId = session?.user?.id || null
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const companyRepository = CompanyRepository()
    const companies = await companyRepository.findByUserId(userId)

    return NextResponse.json(companies, { status: 200 })
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json({ error: 'Unable to fetch companies' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const companyData: Prisma.CompanyCreateInput = await req.json()
    const newCompany = await CompanyRepository().create(companyData)

    return NextResponse.json(newCompany, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json({ error: 'Unable to create company' }, { status: 500 })
  }
}
