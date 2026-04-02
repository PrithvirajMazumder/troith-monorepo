'use client'
import { PropsWithChildren } from 'react'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { buttonVariants, H3, ResizableHandle, ResizablePanel, ResizablePanelGroup, ScrollArea } from '@troith/shared'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { X } from 'lucide-react'

export default function CreateBankLayout({ children }: PropsWithChildren) {
  return (
    <>
      <header {...animateBasicMotionOpacity()} className="border-b px-4 pb-4">
        <div className="flex items-center gap-2 h-16">
          <H3>Create Bank</H3>
          <Link className={cn('ml-auto', buttonVariants({ variant: 'ghost', size: 'icon' }))} href="/tool/banks">
            <X className="w-4 h-4" />
          </Link>
        </div>
        <p className="text-muted-foreground text-sm">Add bank details to use them for receiving payments in invoices and challans.</p>
      </header>
      <ResizablePanelGroup autoSaveId="CREATE_BANK_FORM_REZISABLE_FORM" direction="horizontal" className=" h-full w-full">
        <ResizablePanel defaultSize={70} minSize={70} maxSize={80}>
          <ScrollArea className="px-4 pt-4 pb-20 h-full w-full relative">{children}</ScrollArea>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="bg-gray-50 dark:bg-zinc-900" defaultSize={30} maxSize={30} minSize={20}>
          <ScrollArea className="pt-4 pb-20 h-full w-full relative" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}
