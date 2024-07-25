'use client'
import './global.css'
import { PropsWithChildren } from 'react'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@troith/shared/lib/util'
import { ThemeProvider } from '@troith/shared'

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
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
