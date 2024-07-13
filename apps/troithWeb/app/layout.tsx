import './global.css'
import { PropsWithChildren } from 'react'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@troith/shared/lib/util'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const metadata = {
  title: 'Troith',
  description: 'Create bill at ease'
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <div className="container mx-auto">{children}</div>
      </body>
    </html>
  )
}
