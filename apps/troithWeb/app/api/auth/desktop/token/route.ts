import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@troithWeb/auth'
import { prisma } from '@troithWeb/prisma'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = randomBytes(32).toString('hex')
    const identifier = `desktop:${session.user.email}`
    const expires = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    await prisma.verificationToken.create({
      data: {
        identifier,
        token,
        expires,
      },
    })

    return NextResponse.json({ token }, { status: 200 })
  } catch (error) {
    console.error('Error generating desktop token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}