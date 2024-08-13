'use client'
import './global.css'
import { PropsWithChildren } from 'react'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@troith/shared/lib/util'
import { ThemeProvider, Toaster } from '@troith/shared'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <div className="container mx-auto">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <ProgressBar height="3px" color="#000000" options={{ showSpinner: false }} />
          </ThemeProvider>
          <Toaster />
        </div>
      </body>
    </html>
  )
}
