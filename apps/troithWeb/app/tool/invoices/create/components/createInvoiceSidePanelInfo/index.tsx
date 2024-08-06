'use client'
import { Invoice } from '@troithWeb/__generated__/graphql'
import { Document, Page, pdfjs } from 'react-pdf'
import { useEffect, useRef, useState } from 'react'
import { getBaseInvoicePdf } from '@troithWeb/app/tool/invoices/create/utils/generateHalfPdf'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import { H4, ScrollArea, Separator } from '@troith/shared'
import { Zap } from 'lucide-react'
import { CreateInvoiceSidePanelInvoiceItemList } from '@troithWeb/app/tool/invoices/create/components/createInvoiceSidePanelInfo/createInvoiceSidePanelInvoiceItemList'

type Props = {
  panelWidth: number
}

export const CreateInvoiceSidePanelInfo = ({ panelWidth }: Props) => {
  const { selectedParty, selectedItems, invoiceItems } = useCreateInvoice()
  const [totalPages, setTotalPages] = useState<number>(0)
  const [pdfBase64, setPdfBase64] = useState<string>('')
  const [pdfContainerWidth, setPdfContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`

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
    if (invoiceItems?.length && selectedParty) {
      basePdf
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
    if (!invoiceItems?.length && selectedItems?.length && selectedParty) {
      basePdf
        .putInvoiceItems({
          invoiceItems: selectedItems?.map((item) => ({
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
    if (selectedParty) {
      basePdf
        .highlightInvoiceItems()
        .putPartyData({ party: selectedParty })
        .generate()
        .getBase64((pdfBase64) => {
          setPdfBase64(pdfBase64)
        })
      return
    }

    basePdf
      .highlightParty()
      .generate()
      .getBase64((pdfBase64) => {
        setPdfBase64(pdfBase64)
      })
  }, [selectedParty, selectedItems, invoiceItems])

  useEffect(() => {
    setPdfContainerWidth(containerRef?.current?.clientWidth ?? 0)
  }, [panelWidth])

  return (
    <div className="h-[calc(100svh-117px)] pb-4 flex flex-col gap-4 px-4">
      <ScrollArea className="border-b flex-1">
        <H4>Progress</H4>
        <p className="text-xs text-muted-foreground">Here you can see the live update of all the selected info for creating this new invoice.</p>
        <Separator className="my-4" />
        {selectedParty && (
          <div className="flex border rounded-lg flex-col items-start border-dashed">
            <span className="p-2">
              <p className="text-[12px] underline decoration-dashed text-muted-foreground">Party</p>
              <p className="text-lg font-semibold">{selectedParty?.name}</p>
              <p className="text-sm text-muted-foreground italic">GSTIN: {selectedParty?.gstin}</p>
            </span>
            {selectedItems?.length ? (
              <>
                <Separator />
                <span className="p-2 w-full">
                  <p className="text-[12px] underline decoration-dashed text-muted-foreground">Items</p>
                  {!invoiceItems?.length
                    ? selectedItems.map((item) => (
                        <CreateInvoiceSidePanelInvoiceItemList
                          key={`sneak-peak-create-invoice-item-${item.id}`}
                          invoiceItem={{
                            item,
                            price: 0,
                            quantity: 0
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
                </span>
              </>
            ) : null}
          </div>
        )}
      </ScrollArea>
      <div>
        <H4 className="flex items-center gap-1">
          PDF live feed <Zap className="w-4 h-4 text-yellow-500" />
        </H4>
        <p className="text-xs text-muted-foreground">Highlighted places will be filled with the info on this page</p>
      </div>
      <div ref={containerRef} className="h-max w-full rounded overflow-x-hidden overflow-y-scroll dark:opacity-90">
        {pdfBase64?.length ? (
          <Document
            className="border border-dashed overflow-y-scroll rounded-lg min-h-[20rem]"
            key={panelWidth + 'create-invoice-side-info-panel'}
            file={`data:application/pdf;base64,${pdfBase64}`}
            onLoadSuccess={(pdf) => {
              setTotalPages(pdf.numPages)
            }}
          >
            {Array.from({ length: totalPages }).map((_, index) => {
              return (
                <Page
                  width={pdfContainerWidth}
                  key={`create-invoice-pdf-page-${index}`}
                  className="h-[20rem]"
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              )
            })}
          </Document>
        ) : null}
      </div>
    </div>
  )
}
