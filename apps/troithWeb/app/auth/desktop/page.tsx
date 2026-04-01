'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@troith/shared/components/ui/button'
import { H1, P } from '@troith/shared/components/typography'
import { ScrollText } from 'lucide-react'
import Link from 'next/link'

export default function DesktopAuthPage() {
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
            <P className="text-muted-foreground">Sign in to connect your desktop app</P>
          </div>

          <div className="border rounded-lg bg-card p-8 shadow-sm">
            <div className="flex flex-col gap-4">
              <Button
                size="lg"
                onClick={() =>
                  signIn('google', {
                    redirect: true,
                    redirectTo: '/auth/desktop/success'
                  })
                }
                className="w-full"
              >
                Continue with Google
              </Button>
            </div>

            <P className="text-xs text-muted-foreground text-center mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </P>
          </div>
        </div>
      </div>
    </div>
  )
}