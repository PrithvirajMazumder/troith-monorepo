'use client'
import { Button, buttonVariants, H3, P, ScrollArea, Separator, Tooltip, TooltipContent, TooltipTrigger } from '@troith/shared'
import { Download, Eye, Pencil, Trash, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { useSuspenseQuery } from '@apollo/client'
import { InvoiceQueries } from '@troithWeb/app/tool/invoices/queries/invoiceQueries'
import { Invoice as InvoiceType } from '@troithWeb/__generated__/graphql'
import { Document, Page, pdfjs } from 'react-pdf'
import { useEffect, useState } from 'react'
import { generateCompleteInvoicePdf } from '@troithWeb/app/tool/invoices/utils/generateCompleteInvoice'

export default function Invoice({ params: { id: invoiceId } }: { params: { id: string } }) {
  const [totalPages, setTotalPages] = useState<number>(0)
  const [pdfBase64, setPdfBase64] = useState<string>('')
  const { data: invoiceData } = useSuspenseQuery(InvoiceQueries.detailsById, {
    variables: { invoiceId }
  })
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`

  useEffect(() => {
    if (invoiceData) {
      generateCompleteInvoicePdf(invoiceData?.invoice as InvoiceType).getBase64((pdfBase64) => {
        setPdfBase64(pdfBase64)
      })
    }
  }, [invoiceData])

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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => invoiceData && generateCompleteInvoicePdf(invoiceData.invoice as InvoiceType).download()}
            >
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
      <ScrollArea className="h-full p-6">
        <H3>Invoice: {invoiceId}</H3>
        {pdfBase64?.length ? (
          <Document
            file={`data:application/pdf;base64,${pdfBase64}`}
            onLoadSuccess={(pdf) => {
              setTotalPages(pdf.numPages)
            }}
          >
            {Array.from({ length: totalPages }).map((it, index) => {
              return (
                <Page
                  key={`page-${index}`}
                  className={`h-[29rem]  md:h-[56rem] overflow-hidden`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              )
            })}
          </Document>
        ) : null}
      </ScrollArea>
    </>
  )
}
