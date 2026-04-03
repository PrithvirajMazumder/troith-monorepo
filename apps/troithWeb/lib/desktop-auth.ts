'use server'

import { randomBytes, createHash } from 'crypto'
import { cookies } from 'next/headers'

import { DESKTOP_PROTOCOL, DESKTOP_AUTH_CALLBACK_PATH } from './desktop-auth-constants'
export { DESKTOP_PROTOCOL, DESKTOP_AUTH_CALLBACK_PATH } from './desktop-auth-constants'

const DESKTOP_PKCE_VERIFIER_COOKIE = 'desktop_pkce_verifier'
const DESKTOP_PKCE_STATE_COOKIE = 'desktop_pkce_state'

/**
 * Convert a Buffer to base64url string (no padding)
 */
function base64url(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Generate a cryptographically random code verifier (32 bytes)
 */
export function generateCodeVerifier(): string {
  return base64url(randomBytes(32))
}

/**
 * Generate SHA-256 code challenge from verifier
 */
export function generateCodeChallenge(verifier: string): string {
  const hash = createHash('sha256').update(verifier).digest()
  return base64url(hash)
}

/**
 * Generate random state parameter for CSRF protection (16 bytes)
 */
export function generateState(): string {
  return base64url(randomBytes(16))
}

/**
 * Store PKCE verifier in httpOnly cookie (5 min expiry)
 */
export async function storePkceVerifier(verifier: string, state: string): Promise<void> {
  const cookieStore = cookies()
  const secure = process.env.NODE_ENV === 'production'
  
  cookieStore.set(DESKTOP_PKCE_VERIFIER_COOKIE, verifier, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 300, // 5 minutes
  })
  
  cookieStore.set(DESKTOP_PKCE_STATE_COOKIE, state, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 300,
  })
}

/**
 * Retrieve verifier, validate state, clear cookies after use
 * Returns null if state doesn't match or cookie is missing
 */
export async function retrievePkceVerifier(state: string): Promise<string | null> {
  const cookieStore = cookies()
  
  const verifier = cookieStore.get(DESKTOP_PKCE_VERIFIER_COOKIE)?.value
  const storedState = cookieStore.get(DESKTOP_PKCE_STATE_COOKIE)?.value
  
  if (!verifier || !storedState || storedState !== state) {
    return null
  }
  
  // Clear cookies
  cookieStore.delete(DESKTOP_PKCE_VERIFIER_COOKIE)
  cookieStore.delete(DESKTOP_PKCE_STATE_COOKIE)
  
  return verifier
}

/**
 * Build troith:// callback URL
 */
export function buildDesktopCallbackUrl(token: string, error?: string): string {
  const url = new URL(`${DESKTOP_PROTOCOL}://${DESKTOP_AUTH_CALLBACK_PATH}`)
  
  if (token) {
    url.searchParams.set('token', token)
  }
  
  if (error) {
    url.searchParams.set('error', error)
  }
  
  return url.toString()
}