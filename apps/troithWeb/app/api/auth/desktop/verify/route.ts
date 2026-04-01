import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@troithWeb/prisma'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: { startsWith: 'desktop:' },
        token,
        expires: { gt: new Date() },
      },
    })

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    // Extract email from identifier (format: desktop:email@example.com)
    const email = verificationToken.identifier.slice('desktop:'.length)
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Delete used token (one-time use)
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        },
      },
    })

    // Create a new session
    const sessionToken = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    const session = await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires,
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
      sessionToken: session.sessionToken,
      expires: session.expires,
    }, { status: 200 })
  } catch (error) {
    console.error('Error verifying desktop token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}