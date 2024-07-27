'use client'
import { Button, buttonVariants, P, ScrollArea, Separator, Tooltip, TooltipContent, TooltipTrigger } from '@troith/shared'
import { Download, Eye, Pencil, Trash, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { useSuspenseQuery } from '@apollo/client'
import { InvoiceQueries } from '@troithWeb/app/tool/invoices/queries/invoiceQueries'
import { generateInvoicePdf } from '@troithWeb/app/tool/invoices/utils/generateInvoice'

export default function Invoice({ params: { id: invoiceId } }: { params: { id: string } }) {
  const { data: invoiceData } = useSuspenseQuery(InvoiceQueries.detailsById, {
    variables: { invoiceId }
  })

  return (
    <>
      <header className="border-b px-4 py-4 h-16 flex items-center">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <P>Delete</P>
          </TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <P>Archive</P>
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="mx-2" />
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => invoiceData && generateInvoicePdf(invoiceData)}>
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <P>Download</P>
          </TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <P>View</P>
          </TooltipContent>
        </Tooltip>

        <div className="ml-auto">
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Link href="./" className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
                <X className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <P>Close this invoice</P>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
      <ScrollArea className="h-full p-6">Invoice: {invoiceId}</ScrollArea>
    </>
  )
}
