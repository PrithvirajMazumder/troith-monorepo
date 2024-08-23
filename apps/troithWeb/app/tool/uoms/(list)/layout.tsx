'use client'
import { ResizableTwoColumnToolLayout } from '@troithWeb/app/tool/components/layouts/resizableTwoColumnToolLayout'
import { Input, ScrollArea } from '@troith/shared'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren

export default function UomsLayout({ children }: Props) {
  return (
    <ResizableTwoColumnToolLayout
      autoSaveId="UOMS_RESIZABLE_LAYOUT_KEY"
      firstCol={
        <>
          <header className="border-b px-4 h-16 flex items-center gap-2">
            <Input className="h-8 w-6xl shadow-sm" placeholder="Filter Units" />
          </header>
          <ScrollArea className="px-4 pt-4 pb-20 h-full w-full relative">{children}</ScrollArea>
        </>
      }
      shouldShowHandle={false}
      secondCol={<div className="pt-4 pb-20 bg-gray-50 dark:bg-zinc-900 h-full w-full relative" />}
    />
  )
}
