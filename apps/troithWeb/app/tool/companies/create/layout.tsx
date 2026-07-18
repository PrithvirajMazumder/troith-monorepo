'use client'
import {
  H3,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  buttonVariants
} from '@troith/shared'
import { X } from 'lucide-react'
import { PropsWithChildren } from 'react'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'

export default function CreateCompanyLayout({ children }: PropsWithChildren) {
  return (
    <AnimatePresence>
      <motion.header {...animateBasicMotionOpacity()} className="border-b px-4 pb-4">
        <div className="flex items-center gap-2 h-16">
          <H3>Create Company</H3>
          <Link className={cn('ml-auto', buttonVariants({ variant: 'ghost', size: 'icon' }))} href="/tool/companies">
            <X className="w-4 h-4" />
          </Link>
        </div>
      </motion.header>
      <ResizablePanelGroup autoSaveId="CREATE_COMPANY_FORM_RESIZABLE" direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={70} minSize={70} maxSize={80}>
          <ScrollArea className="px-4 pt-4 pb-20 h-full w-full relative">{children}</ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="bg-gray-50 dark:bg-zinc-900" defaultSize={30} maxSize={30} minSize={20}>
          <ScrollArea className="pt-4 pb-20 h-full w-full relative" id="company-preview-panel" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </AnimatePresence>
  )
}
