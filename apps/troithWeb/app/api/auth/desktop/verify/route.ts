import { NextRequest, NextResponse } from 'next/server'
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
    const { token } = await req.json()
    console.log('[Desktop Auth] Verify POST request received')
    console.log('[Desktop Auth] Token length:', token?.length)
    console.log('[Desktop Auth] Token starts with:', token?.substring(0, 10))
    
    if (!token || typeof token !== 'string') {
      console.log('[Desktop Auth] Token is missing or invalid type')
      return NextResponse.json(
        { error: 'Token is required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    // First, find the token without expiry check to debug
    const tokenWithoutExpiry = await prisma.verificationToken.findFirst({
      where: {
        identifier: { startsWith: 'desktop:' },
        token,
      },
    })
    console.log('[Desktop Auth] Token found (any state):', !!tokenWithoutExpiry)
    if (tokenWithoutExpiry) {
      console.log('[Desktop Auth] Token expires:', tokenWithoutExpiry.expires)
      console.log('[Desktop Auth] Current time:', new Date())
      console.log('[Desktop Auth] Is expired:', tokenWithoutExpiry.expires < new Date())
    }

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: { startsWith: 'desktop:' },
        token,
        expires: { gt: new Date() },
      },
    })

    if (!verificationToken) {
      console.log('[Desktop Auth] Token not found or expired')
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        {
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    // Extract email from identifier (format: desktop:email@example.com)
    const email = verificationToken.identifier.slice('desktop:'.length)
    console.log('[Desktop Auth] Extracted email:', email)
    
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log('[Desktop Auth] User not found for email:', email)
      return NextResponse.json(
        { error: 'User not found' },
        {
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    console.log('[Desktop Auth] User found:', user.email)

    // Delete used token (one-time use)
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        },
      },
    })
    console.log('[Desktop Auth] Token deleted, creating session')

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
    
    console.log('[Desktop Auth] Session created successfully')

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        },
        sessionToken: session.sessionToken,
        expires: session.expires,
      },
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  } catch (error) {
    console.error('[Desktop Auth] Error verifying desktop token:', error)
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
