'use client'
import { ReactNode } from 'react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  ScrollArea
} from '@troith/shared'
import { CheckCircle, Gem, PencilLine, PlusCircle } from 'lucide-react'
import { ResizableTwoColumnToolLayout } from '@troithWeb/app/tool/components/layouts/resizableTwoColumnToolLayout'
import { InvoiceStatuses } from '@troithWeb/app/constants/invoiceStatuses'
import { CustomEventsNames } from '@troithWeb/app/tool/constants/customEventsNames'

type Props = {
  children: ReactNode
  invoice: ReactNode
}

export default function InvoicesLayout(props: Props) {
  return (
    <ResizableTwoColumnToolLayout
      autoSaveId="INVOICE_RESIZABLE_LAYOUT_KEY"
      firstCol={
        <>
          <header className="border-b px-4 h-16 flex items-center gap-2">
            <Input className="h-8 w-6xl shadow-sm" placeholder="Filter Invoices" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="shadow-sm border-dashed h-8 border">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="capitalize">
                  <PencilLine className="w-4 h-4 mr-2" /> {InvoiceStatuses.Draft}
                </DropdownMenuItem>
                <DropdownMenuItem className="capitalize">
                  <CheckCircle className="w-4 h-4 mr-2" /> {InvoiceStatuses.Confirmed}
                </DropdownMenuItem>
                <DropdownMenuItem className="capitalize">
                  <Gem className="w-4 h-4 mr-2" /> {InvoiceStatuses.Paid}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <ScrollArea className="px-4 pt-4 pb-20 h-full w-full relative">{props.children}</ScrollArea>
        </>
      }
      onResize={(size) => {
        window.dispatchEvent(
          new CustomEvent(CustomEventsNames.InvoiceSidePanelResizeEventName, {
            detail: {
              message: size
            }
          })
        )
      }}
      secondCol={props.invoice}
    />
  )
}
