'use client'
import {
  Button,
  buttonVariants,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  H4,
  P,
  PdfViewer,
  ScrollArea,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@troith/shared'
import { CheckCircle, ChevronDown, Download, EllipsisVertical, Gem, Loader, PencilLine, SquareArrowOutUpRight, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { InvoiceQueries } from '@troithWeb/app/tool/invoices/queries/invoiceQueries'
import { Invoice as InvoiceType, InvoiceStatus } from '@troithWeb/__generated__/graphql'
import { generateCompleteInvoicePdf } from '@troithWeb/app/tool/invoices/utils/generateCompleteInvoice'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useEffect, useRef, useState } from 'react'
import { CustomEventsNames } from '@troithWeb/app/tool/constants/customEventsNames'
import { format } from 'date-fns'
import { CreateInvoiceSidePanelInvoiceItemList } from '@troithWeb/app/tool/invoices/create/components/createInvoiceSidePanelInfo/createInvoiceSidePanelInvoiceItemList'
import { getInvoiceTotals } from '@troithWeb/app/tool/invoices/create/utils/getInvoiceTotals'
import { convertAmountToInr } from '@troithWeb/utils/currency'
import { InvoiceMutations } from '@troithWeb/app/tool/invoices/queries/invoiceMutations'

export default function Invoice({ params: { id: invoiceId } }: { params: { id: string } }) {
  const { data: invoiceData } = useSuspenseQuery(InvoiceQueries.detailsById, {
    variables: { invoiceId }
  })
  const [updateInvoiceStatus, { loading: isChangingStatus }] = useMutation(InvoiceMutations.updateInvoiceStatus)
  const [invoiceBase64, setInvoiceBase64] = useState('')
  const pdfContainerRef = useRef<HTMLDivElement>(null)
  const [pdfContainerWidth, setPdfContainerWidth] = useState(0)
  const [isChangeStatusDropdownOpen, setIsChangeStatusDropdownOpen] = useState(false)

  useEffect(() => {
    if (invoiceData?.invoice) {
      generateCompleteInvoicePdf(invoiceData?.invoice as InvoiceType).getBase64((base64) => {
        setInvoiceBase64(base64)
      })
    }
    const handleResize = () => setPdfContainerWidth(pdfContainerRef?.current?.offsetWidth ?? 0)
    handleResize()
    window.addEventListener(CustomEventsNames.InvoiceSidePanelResizeEventName, handleResize)
    window.addEventListener(CustomEventsNames.ToolSideMenuResizeEventName, handleResize)

    return () => {
      window.removeEventListener(CustomEventsNames.InvoiceSidePanelResizeEventName, handleResize)
      window.removeEventListener(CustomEventsNames.ToolSideMenuResizeEventName, handleResize)
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        <header className="border-b bg-background p-4 h-16 flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={isChangingStatus}
                onClick={() => setIsChangeStatusDropdownOpen(!isChangeStatusDropdownOpen)}
                variant="ghost"
                className={cn(
                  'border border-dashed flex h-7 items-center mr-3 shadow ml-1',
                  {
                    'bg-green-50 dark:bg-green-900 hover:dark:bg-green-900/50 hover:bg-green-50/90 border-green-600':
                      invoiceData?.invoice?.status === InvoiceStatus.Paid
                  },
                  {
                    'bg-orange-50 dark:bg-orange-900 hover:dark:bg-orange-900/50 hover:bg-orange-50/90 border-orange-600':
                      invoiceData?.invoice?.status === InvoiceStatus.Draft
                  },
                  {
                    'bg-blue-50 dark:bg-blue-900 hover:dark:bg-blue-900/50 hover:bg-blue-50/90 border-blue-600':
                      invoiceData?.invoice?.status === InvoiceStatus.Confirmed
                  }
                )}
              >
                {isChangingStatus ? <Loader className={cn('w-4 h-4 mr-2 animate-spin')} /> : <CheckCircle className={cn('w-4 h-4 mr-2')} />}
                {invoiceData?.invoice?.status}
                <ChevronDown className={cn('w-3 h-3 ml-2')} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent className="z-[999]">
                <DropdownMenuLabel>Change status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    updateInvoiceStatus({
                      variables: {
                        id: invoiceId,
                        status: InvoiceStatus.Draft
                      }
                    })
                  }
                  className="capitalize"
                >
                  <PencilLine className="w-4 h-4 mr-2" /> {InvoiceStatus.Draft}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    updateInvoiceStatus({
                      variables: {
                        id: invoiceId,
                        status: InvoiceStatus.Confirmed
                      }
                    })
                  }
                  className="capitalize"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> {InvoiceStatus.Confirmed}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="capitalize"
                  onClick={() =>
                    updateInvoiceStatus({
                      variables: {
                        id: invoiceId,
                        status: InvoiceStatus.Paid
                      }
                    })
                  }
                >
                  <Gem className="w-4 h-4 mr-2" /> {InvoiceStatus.Paid}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
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
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <P>Menu</P>
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
        <ScrollArea ref={pdfContainerRef} className="h-full w-full max-w-full p-4 bg-gray-50 dark:bg-zinc-900 pb-[2rem]">
          <div className="w-full relative">
            {invoiceData?.invoice?.status === InvoiceStatus.Paid ? (
              <motion.div
                transition={{
                  delay: 0.7,
                  duration: 0.3,
                  easings: [0.6, 0.04, 0.98, 0.335]
                }}
                initial={{
                  opacity: 0,
                  scale: 5
                }}
                animate={{
                  opacity: 0.1,
                  rotate: -12,
                  scale: 1,
                  translateX: '-50%',
                  translateY: '-50%'
                }}
                className="absolute -rotate-12 top-1/2 left-1/2 z-50 border-green-600 dark:border-green-200 border-8 text-green-600 dark:text-green-400 rounded-xl p-1 font-extrabold"
              >
                <div className="w-full h-full flex justify-center items-center border-2 border-green-600 dark:border-green-200 rounded-lg py-4 px-6">
                  <p className="text-3xl uppercase">{invoiceData?.invoice?.status}</p>
                </div>
              </motion.div>
            ) : null}
            <motion.div
              transition={{ duration: 0.2 }}
              {...animateBasicMotionOpacity()}
              className="p-4 border rounded-t-lg bg-background border-dashed relative"
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
          </div>
          <motion.div
            transition={{
              delay: 0.6
            }}
            {...animateBasicMotionOpacity()}
            className="border-t mt-6 pt-4 px-1"
          >
            <H4 className="flex items-center gap-1">Invoice PDF</H4>
            <p className="text-xs text-muted-foreground">This is the precise layout of the invoice as it will appear in the PDF.</p>
          </motion.div>
          <motion.div
            {...animateBasicMotionOpacity()}
            style={{
              height: (pdfContainerWidth - 70) * 1.414
            }}
          >
            {invoiceData?.invoice ? (
              <motion.div
                transition={{
                  delay: 0.6
                }}
                {...animateBasicMotionOpacity()}
                className="p-4 border rounded-lg bg-background border-dashed w-full max-w-full overflow-hidden mt-4 z-10"
              >
                <PdfViewer
                  className="overflow-y-scroll w-full h-full max-w-full rounded-lg dark:opacity-80"
                  pdfBase64={invoiceBase64}
                  pageWidth={pdfContainerWidth - 70}
                />
              </motion.div>
            ) : null}
          </motion.div>
        </ScrollArea>
      </AnimatePresence>
    </>
  )
}
