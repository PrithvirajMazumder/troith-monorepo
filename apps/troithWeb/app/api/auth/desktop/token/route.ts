import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@troithWeb/auth'
import { prisma } from '@troithWeb/prisma'
import { randomBytes } from 'crypto'

// Handle CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    console.log('[Desktop Auth] Token generation - session:', !!session, 'email:', session?.user?.email)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    const token = randomBytes(32).toString('hex')
    const identifier = `desktop:${session.user.email}`
    const expires = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    console.log('[Desktop Auth] Creating token for identifier:', identifier)

    await prisma.verificationToken.create({
      data: {
        identifier,
        token,
        expires,
      },
    })

    console.log('[Desktop Auth] Token created, length:', token.length)

    return NextResponse.json(
      { token },
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  } catch (error) {
    console.error('[Desktop Auth] Error generating desktop token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  }
}
