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
import { PropsWithChildren } from 'react'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { usePathname } from 'next/navigation'
import { CreateInvoiceProvider } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'

export default function CreateInvoiceLayout({ children }: PropsWithChildren) {
  const pathname = usePathname()

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
              )}{' '}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {pathname === '/tool/invoices/create/configure-invoice-items' ? (
                <BreadcrumbPage>Configure Invoice Items</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href="/tool/invoices/create/configure-invoice-items">Configure Invoice Items</Link>
                </BreadcrumbLink>
              )}{' '}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {pathname === '/tool/invoices/create/tax' ? (
                <BreadcrumbPage>Tax</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href="/tool/invoices/create/tax">Tax</Link>
                </BreadcrumbLink>
              )}{' '}
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
      <ResizablePanelGroup direction="horizontal" className=" h-full w-full">
        <ResizablePanel defaultSize={60} minSize={60} maxSize={80}>
          <ScrollArea className="px-4 pt-4 pb-20 h-full w-full relative">{children}</ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} maxSize={40} minSize={20}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </CreateInvoiceProvider>
  )
}
