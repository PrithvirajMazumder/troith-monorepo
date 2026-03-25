'use client'
import { InvoiceSkeletonLoader } from '@troithWeb/app/tool/components/invoiceCard'

export default function InvoicesProgress() {
  return (
    <div className="flex flex-col w-full gap-4 pb-24">
      <InvoiceSkeletonLoader />
      <InvoiceSkeletonLoader />
      <InvoiceSkeletonLoader />
      <InvoiceSkeletonLoader />
      <InvoiceSkeletonLoader />
      <InvoiceSkeletonLoader />
    </div>
  )
}
