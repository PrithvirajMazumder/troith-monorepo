'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@troith/shared/components/ui/button'
import { H1, P } from '@troith/shared/components/typography'
import { ScrollText } from 'lucide-react'
import Link from 'next/link'
import { DESKTOP_PROTOCOL, DESKTOP_AUTH_CALLBACK_PATH } from '@troithWeb/lib/desktop-auth'

export default function DesktopAuthSuccessPage() {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const fetchToken = async () => {
        try {
          setRedirecting(true)
          const response = await fetch('/api/auth/desktop/token', {
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error('Failed to generate token')
          }
          const { token } = await response.json()
          // Build callback URL
          const callbackUrl = `${DESKTOP_PROTOCOL}://${DESKTOP_AUTH_CALLBACK_PATH}?token=${encodeURIComponent(token)}&status=success`
          window.location.href = callbackUrl
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred')
          setRedirecting(false)
        }
      }
      fetchToken()
    } else if (status === 'unauthenticated') {
      setError('You are not authenticated. Please sign in first.')
    }
  }, [session, status])

  if (status === 'loading' || redirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                  <ScrollText className="h-6 w-6 text-primary-foreground" />
                </div>
              </Link>
              <H1 className="text-3xl font-bold mb-2">
                <span className="text-primary">T</span>roith
              </H1>
              <P className="text-muted-foreground">Connecting your desktop app...</P>
            </div>
            <div className="border rounded-lg bg-card p-8 shadow-sm">
              <P className="text-center">Please wait while we complete the authentication.</P>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                  <ScrollText className="h-6 w-6 text-primary-foreground" />
                </div>
              </Link>
              <H1 className="text-3xl font-bold mb-2">
                <span className="text-primary">T</span>roith
              </H1>
              <P className="text-muted-foreground">Authentication failed</P>
            </div>
            <div className="border rounded-lg bg-card p-8 shadow-sm">
              <P className="text-destructive text-center mb-4">{error}</P>
              <Button asChild className="w-full">
                <Link href="/auth/desktop">Try again</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // This shouldn't be reached because we either redirect or show error
  return null
}