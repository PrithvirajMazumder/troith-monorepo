'use client'
import { Invoice, Party } from '@troithWeb/__generated__/graphql'
import { useEffect, useRef, useState } from 'react'
import { getBaseInvoicePdf } from '@troithWeb/app/tool/invoices/create/utils/generateHalfPdf'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  H4,
  P,
  PdfViewer,
  ScrollArea,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@troith/shared'
import { MousePointerClick, Zap } from 'lucide-react'
import { CreateInvoiceSidePanelInvoiceItemList } from '@troithWeb/app/tool/invoices/create/components/createInvoiceSidePanelInfo/createInvoiceSidePanelInvoiceItemList'
import { getInvoiceTotals } from '@troithWeb/app/tool/invoices/create/utils/getInvoiceTotals'
import { convertAmountToInr } from '@troithWeb/utils/currency'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { Prisma } from '@prisma/client'

type Props = {
  panelWidth: number
}

export const CreateInvoiceSidePanelInfo = ({ panelWidth }: Props) => {
  const { selectedParty, selectedItems, invoiceItems, selectedBank, selectedDate, selectedInvoiceNumber, selectedTax } = useCreateInvoice()
  const [pdfBase64, setPdfBase64] = useState<string>('')
  const [pdfContainerWidth, setPdfContainerWidth] = useState(0)
  const [isExpandedDialogOpen, setIsExpandedDialogOpen] = useState(false)
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const pdfExpandedDialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const basePdf = getBaseInvoicePdf({
      company: {
        name: 'escon',
        legalName: 'escon engineering co.',
        city: 'kolkata',
        state: 'west bengal',
        addressLine1: '153/38 SN Roy Road',
        zipCode: 700038,
        id: '658db32a6cf334fc362c9cad'
      }
    } as Pick<Invoice, 'company'>)

    if (pathname.includes('finalize-invoice') && invoiceItems?.length && selectedParty) {
      basePdf
        .putFinalInvoiceInfo({
          bank: selectedBank,
          tax: selectedTax,
          invoiceItems: invoiceItems,
          date: selectedDate,
          no: selectedInvoiceNumber ?? undefined
        })
        .putInvoiceItems({
          invoiceItems
        })
        .highlightFinalInvoiceInfo()
        .putPartyData({ party: selectedParty })
        .generate()
        .getBase64((pdfBase64) => {
          setPdfBase64(pdfBase64)
        })
      return
    }
    if (pathname.includes('configure-invoice-items') && selectedItems?.length && selectedParty) {
      basePdf
        .putInvoiceItems({
          invoiceItems: invoiceItems?.length
            ? invoiceItems
            : selectedItems?.map((item) => ({
                item,
                price: 0,
                quantity: 0
              }))
        })
        .highlightInvoiceItems()
        .putPartyData({ party: selectedParty })
        .generate()
        .getBase64((pdfBase64) => {
          setPdfBase64(pdfBase64)
        })
      return
    }
    if (pathname.includes('choose-items') && selectedParty) {
      basePdf
        .putPartyData({ party: selectedParty })
        .putInvoiceItems({
          invoiceItems: selectedItems?.length
            ? selectedItems.map((item) => ({
                item,
                price: 0,
                quantity: 0
              }))
            : []
        })
        .highlightInvoiceItems()
        .generate()
        .getBase64((pdfBase64) => {
          setPdfBase64(pdfBase64)
        })
      return
    }
    if (pathname.endsWith('create')) {
      basePdf
        .highlightParty()
        .putPartyData({ party: selectedParty as Party })
        .generate()
        .getBase64((pdfBase64) => {
          setPdfBase64(pdfBase64)
        })
    }
  }, [pathname, selectedBank, selectedDate, selectedTax])

  useEffect(() => {
    setPdfContainerWidth(containerRef?.current?.clientWidth ?? 0)
  }, [panelWidth])

  return (
    <AnimatePresence>
      <motion.div {...animateBasicMotionOpacity()} className="h-[calc(100svh-117px)] pb-4 flex flex-col gap-4 px-4">
        <ScrollArea className="border-b flex-1">
          <H4>Progress</H4>
          <p className="text-xs text-muted-foreground mb-4">
            Here you can see the live update of all the selected info for creating this new invoice.
          </p>
          <AnimatePresence>
            {selectedParty && (
              <motion.div {...animateBasicMotionOpacity()} className="flex border rounded-lg flex-col bg-background items-start border-dashed">
                <span className="p-4">
                  <p className="text-[12px] underline decoration-dashed text-muted-foreground">Party</p>
                  <p className="text-lg font-semibold">{selectedParty?.name}</p>
                  <p className="text-sm text-muted-foreground italic">GSTIN: {selectedParty?.gstin}</p>
                </span>
                {selectedItems?.length ? (
                  <>
                    <Separator />
                    <motion.span {...animateBasicMotionOpacity()} className="p-4 w-full overflow-hidden duration-300">
                      <p className="text-[12px] underline decoration-dashed text-muted-foreground">Items</p>
                      {!invoiceItems?.length
                        ? selectedItems.map((item) => (
                            <CreateInvoiceSidePanelInvoiceItemList
                              key={`sneak-peak-create-invoice-item-${item.id}`}
                              invoiceItem={{
                                item,
                                price: new Prisma.Decimal(0),
                                quantity: BigInt(0)
                              }}
                            />
                          ))
                        : invoiceItems.map((invoiceItem) => (
                            <CreateInvoiceSidePanelInvoiceItemList
                              key={`sneak-peak-create-invoice-item-${invoiceItem?.item?.id}`}
                              invoiceItem={{
                                item: invoiceItem?.item,
                                price: invoiceItem?.price,
                                quantity: invoiceItem?.quantity
                              }}
                            />
                          ))}
                    </motion.span>
                  </>
                ) : null}
                {selectedTax
                  ? (() => {
                      const { cgst, grossTotal, netTotal, sgst } = getInvoiceTotals({
                        invoiceItems: invoiceItems,
                        tax: selectedTax
                      })
                      return (
                        <>
                          <Separator />
                          <motion.span {...animateBasicMotionOpacity()} className="p-4 w-full">
                            <div className="flex justify-between">
                              <p className="text-sm text-muted-foreground">Gross</p>
                              <p className="text-sm text-muted-foreground italic font-semibold">{convertAmountToInr(grossTotal)}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm text-muted-foreground">CGST({selectedTax.cgst}%)</p>
                              <p className="text-sm text-muted-foreground italic font-semibold">{convertAmountToInr(cgst)}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm text-muted-foreground">SGST({selectedTax.sgst}%)</p>
                              <p className="text-sm text-muted-foreground italic font-semibold">{convertAmountToInr(sgst)}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-sm text-muted-foreground">Total</p>
                              <p className="text-sm text-muted-foreground italic font-semibold">{convertAmountToInr(netTotal)}</p>
                            </div>
                          </motion.span>
                        </>
                      )
                    })()
                  : null}
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
        <div>
          <H4 className="flex items-center gap-1">
            PDF live feed <Zap className="w-4 h-4 text-yellow-500" />
          </H4>
          <p className="text-xs text-muted-foreground">Highlighted places will be filled with the info on this page</p>
        </div>
        <Tooltip delayDuration={800}>
          <TooltipTrigger asChild>
            <div
              onClick={() => setIsExpandedDialogOpen(true)}
              ref={containerRef}
              className="h-max w-full rounded overflow-x-hidden overflow-y-scroll dark:opacity-90 cursor-pointer"
            >
              {pdfBase64?.length ? (
                <PdfViewer
                  uniqueIdentityForPageKey="create-invoice-pdf-page"
                  className="border border-dashed overflow-y-scroll rounded-lg min-h-[20rem]"
                  key={panelWidth + 'create-invoice-side-info-panel'}
                  pdfBase64={pdfBase64}
                  pageWidth={pdfContainerWidth}
                />
              ) : null}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            <P className="flex items-center gap-2">
              Click to expand <MousePointerClick className="w-4 h-4" />
            </P>
          </TooltipContent>
        </Tooltip>
      </motion.div>
      <Dialog open={isExpandedDialogOpen} onOpenChange={setIsExpandedDialogOpen}>
        <DialogPortal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>PDF Expanded</DialogTitle>
            </DialogHeader>
            <div ref={pdfExpandedDialogRef} className="w-full h-max border border-dashed rounded-lg overflow-hidden bg-white dark:opacity-90">
              {pdfBase64?.length ? (
                <PdfViewer
                  uniqueIdentityForPageKey="create-invoice-pdf-page"
                  className="overflow-y-scroll min-h-[calc(100svh-20rem)] min-w-[20rem]"
                  key={pdfExpandedDialogRef?.current?.offsetWidth + 'create-invoice-side-info-panel'}
                  pdfBase64={pdfBase64}
                  pageWidth={460}
                />
              ) : null}
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </AnimatePresence>
  )
}
