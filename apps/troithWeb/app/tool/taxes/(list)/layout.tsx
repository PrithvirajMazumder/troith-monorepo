'use client'
import { ResizableTwoColumnToolLayout } from '@troithWeb/app/tool/components/layouts/resizableTwoColumnToolLayout'
import { Input, ScrollArea } from '@troith/shared'
import { PropsWithChildren, ReactNode } from 'react'

type Props = PropsWithChildren & { tax: ReactNode }

export default function TaxesLayout(props: Props) {
  return (
    <ResizableTwoColumnToolLayout
      autoSaveId="TAX_RESIZABLE_LAYOUT_KEY"
      firstCol={
        <>
          <header className="border-b px-4 h-16 flex items-center gap-2">
            <Input className="h-8 w-6xl shadow-sm" placeholder="Filter Taxes" />
          </header>
          <ScrollArea className="px-4 pt-4 pb-20 h-full w-full relative">{props.children}</ScrollArea>
        </>
      }
      secondCol={props.tax}
    />
  )
}
