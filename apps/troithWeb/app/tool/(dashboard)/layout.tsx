import { H3, ScrollArea } from '@troith/shared'
import { PropsWithChildren } from 'react'

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    // <div className="w-full h-full flex flex-col justify-start">
    //   <header className="border-b px-4 h-16 flex items-center gap-2">
    //     <H3>Dashboard</H3>
    //   </header>
    // </div>
    <ScrollArea className="flex-1">{children}</ScrollArea>
  )
}
