'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  buttonVariants,
  H3,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea
} from '@troith/shared'
import { X } from 'lucide-react'
import { PropsWithChildren, useState } from 'react'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { usePathname } from 'next/navigation'
import { CreateInvoiceProvider } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import { CreateInvoiceSidePanelInfo } from '@troithWeb/app/tool/invoices/create/components/createInvoiceSidePanelInfo'

export default function CreateInvoiceLayout({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const [sidePanelWidth, setSidePanelWidth] = useState<number>(0)

  return (
    <CreateInvoiceProvider>
      <header className="border-b px-4 pb-4">
        <div className="flex items-center gap-2 h-16">
          <H3>Create Invoice</H3>
          <Link className={cn('ml-auto', buttonVariants({ variant: 'ghost', size: 'icon' }))} href="/tool/invoices">
            <X className="w-4 h-4" />
          </Link>
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {pathname === '/tool/invoices/create' ? (
                <BreadcrumbPage>Select Party</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href="/tool/invoices/create">Select Party</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {pathname === '/tool/invoices/create/choose-items' ? (
                <BreadcrumbPage>Choose Items</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href="/tool/invoices/create/choose-items">Choose Items</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {pathname === '/tool/invoices/create/configure-invoice-items' ? (
                <BreadcrumbPage>Configure Invoice Items</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href="/tool/invoices/create/configure-invoice-items">Configure Invoice Items</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {pathname === '/tool/invoices/create/finalize-invoice' ? (
                <BreadcrumbPage>Finalize invoice</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href="/tool/invoices/create/finalize-invoice">Finalize invoice</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {pathname === '/tool/invoices/create/preview' ? (
                <BreadcrumbPage>Preview</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href="/tool/invoices/create/preview">Preview</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <ResizablePanelGroup autoSaveId="CREATE_INVOICE_FORM_REZISABLE_FORM" direction="horizontal" className=" h-full w-full">
        <ResizablePanel defaultSize={70} minSize={70} maxSize={80}>
          <ScrollArea className="px-4 pt-4 pb-20 h-full w-full relative">{children}</ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="bg-gray-50 dark:bg-zinc-900/20" onResize={setSidePanelWidth} defaultSize={30} maxSize={30} minSize={20}>
          <ScrollArea className="pt-4 pb-20 h-full w-full relative">
            <CreateInvoiceSidePanelInfo panelWidth={sidePanelWidth} />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </CreateInvoiceProvider>
  )
}
