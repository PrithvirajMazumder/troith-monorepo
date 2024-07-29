'use client'
import { Button, H3, Input, P, ScrollArea, Tooltip, TooltipContent, TooltipTrigger } from '@troith/shared'
import { Plus, SlidersHorizontal } from 'lucide-react'
import { ReactNode } from 'react'
import { ResizableTwoColumnToolLayout } from '@troithWeb/app/tool/components/layouts/resizableTwoColumnToolLayout'

type Props = {
  children: ReactNode
  invoice: ReactNode
}

export default function InvoicesLayout(props: Props) {
  return (
    <ResizableTwoColumnToolLayout
      firstCol={
        <>
          <header className="border-b px-4 h-16 flex items-center gap-2">
            <H3>Invoices</H3>
            <Input className="ml-auto max-w-36 w-full" placeholder="Search" />
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <P>Filters</P>
              </TooltipContent>
            </Tooltip>
          </header>
          <ScrollArea className="px-4 pt-4 pb-20 h-full w-full relative">{props.children}</ScrollArea>
        </>
      }
      secondCol={props.invoice}
    />
  )
}
