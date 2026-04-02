'use client'
import './global.css'
import { PropsWithChildren } from 'react'
import { Inter as FontSans } from 'next/font/google'
import { Oswald } from 'next/font/google'
import { Poppins } from 'next/font/google'
import { cn } from '@troith/shared/lib/util'
import { ThemeProvider, Toaster } from '@troith/shared'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import { SessionProvider } from 'next-auth/react'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

const fontOswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  weight: ['400', '500', '600', '700']
})

const fontPoppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700']
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable, fontOswald.variable, fontPoppins.variable)}>
        <SessionProvider>
          <div className="container mx-auto">
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <ProgressBar height="3px" color="#000000" options={{ showSpinner: false }} />
            </ThemeProvider>
            <Toaster />
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
