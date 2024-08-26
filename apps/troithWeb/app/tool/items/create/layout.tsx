'use client'
import { PropsWithChildren } from 'react'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { buttonVariants, H3, ResizableHandle, ResizablePanel, ResizablePanelGroup, ScrollArea } from '@troith/shared'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { X } from 'lucide-react'

export default function CreateItemLayout({ children }: PropsWithChildren) {
  return (
    <>
      <header {...animateBasicMotionOpacity()} className="border-b px-4 pb-4">
        <div className="flex items-center gap-2 h-16">
          <H3>Create Item</H3>
          <Link className={cn('ml-auto', buttonVariants({ variant: 'ghost', size: 'icon' }))} href="/tool/items">
            <X className="w-4 h-4" />
          </Link>
        </div>
        <p className="text-muted-foreground text-sm">
          Creating a reusable item allows you to streamline the process of generating invoices and challans. This reduces repetitive data entry and
          ensures consistency across your financial documents.
        </p>
      </header>
      <ResizablePanelGroup autoSaveId="CREATE_ITEM_FORM_REZISABLE_FORM" direction="horizontal" className=" h-full w-full">
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
