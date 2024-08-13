'use client'
import {
  Button,
  buttonVariants,
  P,
  PdfViewer,
  ScrollArea,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@troith/shared'
import { Download, Eye, Pencil, SquareArrowOutUpRight, Trash, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { useSuspenseQuery } from '@apollo/client'
import { InvoiceQueries } from '@troithWeb/app/tool/invoices/queries/invoiceQueries'
import { Invoice as InvoiceType } from '@troithWeb/__generated__/graphql'
import { generateCompleteInvoicePdf } from '@troithWeb/app/tool/invoices/utils/generateCompleteInvoice'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { format } from 'date-fns'
import { CreateInvoiceSidePanelInvoiceItemList } from '@troithWeb/app/tool/invoices/create/components/createInvoiceSidePanelInfo/createInvoiceSidePanelInvoiceItemList'
import { convertAmountToInr } from '@troithWeb/utils/currency'
import { getInvoiceTotals } from '@troithWeb/app/tool/invoices/create/utils/getInvoiceTotals'
import { useEffect, useRef, useState } from 'react'
import { CustomEventsNames } from '@troithWeb/app/tool/constants/customEventsNames'

export default function Invoice({ params: { id: invoiceId } }: { params: { id: string } }) {
  const { data: invoiceData } = useSuspenseQuery(InvoiceQueries.detailsById, {
    variables: { invoiceId }
  })
  const [invoiceBase64, setInvoiceBase64] = useState('')
  const pdfContainerRef = useRef<HTMLDivElement>(null)
  const [pdfContainerWidth, setPdfContainerWidth] = useState(0)

  useEffect(() => {
    if (invoiceData?.invoice) {
      generateCompleteInvoicePdf(invoiceData?.invoice as InvoiceType).getBase64((base64) => {
        setInvoiceBase64(base64)
      })
    }
    console.log('pdfContainerRef?.current?.offsetWidthL ', pdfContainerRef?.current?.offsetWidth)
    const handleResize = () => setPdfContainerWidth(pdfContainerRef?.current?.offsetWidth ?? 0)
    handleResize()
    window.addEventListener(CustomEventsNames.InvoiceSidePanelResizeEventName, handleResize)

    return () => {
      window.removeEventListener(CustomEventsNames.InvoiceSidePanelResizeEventName, handleResize)
    }
  }, [])

  return (
    <AnimatePresence>
      <header className="border-b bg-background px-4 py-4 h-16 flex items-center">
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
      <ScrollArea ref={pdfContainerRef} className="h-full w-full max-w-full p-4 bg-gray-50 dark:bg-zinc-900">
        <Tabs defaultValue="easy" className="w-full">
          <TabsList className="justify-center">
            <TabsTrigger value="easy">Easy</TabsTrigger>
            <TabsTrigger value="pdf">PDF</TabsTrigger>
          </TabsList>
          <TabsContent className="w-full pb-36" value="easy">
            <motion.div
              transition={{ duration: 0.2 }}
              {...animateBasicMotionOpacity()}
              className="p-4 border rounded-t-lg bg-background border-dashed relative mt-4"
            >
              <p className="text-lg font-semibold capitalize">Invoice No: {invoiceData?.invoice?.no}</p>
              <div className="w-full flex flex-col">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Status:</p>
                  <p className="text-sm text-muted-foreground italic font-semibold">{invoiceData?.invoice?.status}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Date:</p>
                  <p className="text-sm text-muted-foreground italic font-semibold">
                    {format(invoiceData?.invoice?.date ?? new Date(), 'dd/MM/yyyy')}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted-foreground">Vehicle no:</p>
                  <p className="text-sm text-muted-foreground italic font-semibold capitalize">
                    {invoiceData?.invoice?.vehicleNumber?.length ? invoiceData?.invoice?.vehicleNumber : 'N/A'}
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              transition={{ duration: 0.2, delay: 0.1 }}
              {...animateBasicMotionOpacity()}
              className="p-4 border border-t-0 bg-background border-dashed relative"
            >
              <Link
                href="/"
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    size: 'icon'
                  }),
                  'absolute top-1 right-1 rounded-full'
                )}
              >
                <SquareArrowOutUpRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <p className="text-[12px] underline decoration-dashed text-muted-foreground">Company</p>
              <p className="text-lg font-semibold capitalize">{invoiceData?.invoice?.company?.legalName}</p>
              <p className="text-sm text-muted-foreground italic">GSTIN: {invoiceData?.invoice?.company?.gstin}</p>
              <p className="text-sm text-muted-foreground italic capitalize">State: {invoiceData?.invoice?.company?.state}</p>
            </motion.div>
            <motion.div
              transition={{ duration: 0.2, delay: 0.2 }}
              {...animateBasicMotionOpacity()}
              className="p-4 border border-t-0 bg-background border-dashed relative"
            >
              <Link
                href="/"
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    size: 'icon'
                  }),
                  'absolute top-1 right-1 rounded-full'
                )}
              >
                <SquareArrowOutUpRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <p className="text-[12px] underline decoration-dashed text-muted-foreground">Party</p>
              <p className="text-lg font-semibold capitalize">{invoiceData?.invoice?.party?.name}</p>
              <p className="text-sm text-muted-foreground italic">GSTIN: {invoiceData?.invoice?.party?.gstin}</p>
            </motion.div>
            <motion.div
              transition={{ duration: 0.2, delay: 0.3 }}
              {...animateBasicMotionOpacity()}
              className="p-4 border border-t-0 bg-background border-dashed relative"
            >
              <p className="text-[12px] underline decoration-dashed text-muted-foreground">Items</p>
              {invoiceData?.invoice?.invoiceItems.map((invoiceItem) => (
                <CreateInvoiceSidePanelInvoiceItemList
                  key={`sneak-peak-invoice-item-${invoiceItem?.item?.id}`}
                  invoiceItem={{
                    item: invoiceItem?.item,
                    price: invoiceItem?.price,
                    quantity: invoiceItem?.quantity
                  }}
                />
              ))}
            </motion.div>
            <motion.div
              transition={{ duration: 0.2, delay: 0.4 }}
              {...animateBasicMotionOpacity()}
              className="p-4 border border-t-0 bg-background border-dashed relative"
            >
              <p className="text-[12px] underline decoration-dashed text-muted-foreground">Totals</p>
              {(() => {
                const { cgst, grossTotal, netTotal, sgst } = getInvoiceTotals({
                  invoiceItems: invoiceData?.invoice?.invoiceItems ?? [],
                  tax: invoiceData?.invoice?.tax
                })
                return (
                  <>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Gross:</p>
                      <p className="text-sm text-muted-foreground italic font-semibold">{convertAmountToInr(grossTotal)}</p>
                    </div>
                    {invoiceData?.invoice?.shouldUseIgst ? (
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">
                          IGST({(invoiceData?.invoice?.tax?.cgst ?? 0) + (invoiceData?.invoice?.tax?.sgst ?? 0)}%):
                        </p>
                        <p className="text-sm text-muted-foreground italic font-semibold">{convertAmountToInr(cgst + sgst)}</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <p className="text-sm text-muted-foreground">CGST({invoiceData?.invoice?.tax?.cgst}%):</p>
                          <p className="text-sm text-muted-foreground italic font-semibold">{convertAmountToInr(cgst)}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-muted-foreground">SGST({invoiceData?.invoice?.tax?.sgst}%):</p>
                          <p className="text-sm text-muted-foreground italic font-semibold">{convertAmountToInr(sgst)}</p>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Net:</p>
                      <p className="text-sm text-muted-foreground italic font-semibold">{convertAmountToInr(netTotal)}</p>
                    </div>
                  </>
                )
              })()}
            </motion.div>
            <motion.div
              transition={{ duration: 0.2, delay: 0.5 }}
              {...animateBasicMotionOpacity()}
              className="p-4 border rounded-b-lg border-t-0 bg-background border-dashed relative"
            >
              <Link
                href="/"
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    size: 'icon'
                  }),
                  'absolute top-1 right-1 rounded-full'
                )}
              >
                <SquareArrowOutUpRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <p className="text-[12px] underline decoration-dashed text-muted-foreground">Bank</p>
              <p className="text-lg font-semibold capitalize">{invoiceData?.invoice?.bank?.name}</p>
              <p className="text-sm text-muted-foreground italic">Account No: {invoiceData?.invoice?.bank?.accountNumber}</p>
              <p className="text-sm text-muted-foreground italic uppercase">IFSC: {invoiceData?.invoice?.bank?.ifsc}</p>
              <p className="text-sm text-muted-foreground italic capitalize">Branch: {invoiceData?.invoice?.bank?.branch}</p>
            </motion.div>
          </TabsContent>
          <TabsContent value="pdf">
            <motion.div {...animateBasicMotionOpacity()}>
              {invoiceData?.invoice ? (
                <div className="p-4 border rounded-lg bg-background border-dashed relative w-full max-w-full overflow-hidden mt-4">
                  <p>{pdfContainerWidth}</p>
                  <PdfViewer
                    className="w-full overflow-hidden"
                    uniqueIdentityForPageKey={`inspecting-invoice-${invoiceData?.invoice?.id}`}
                    pdfBase64={invoiceBase64}
                    pageWidth={pdfContainerWidth - 30}
                  />
                </div>
              ) : null}
            </motion.div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </AnimatePresence>
  )
}
