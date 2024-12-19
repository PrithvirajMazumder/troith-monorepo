'use client'
import { InvoiceSkeletonLoader } from '@troithWeb/app/tool/components/invoiceCard'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'

export default function InvoicesProgress() {
  return (
    <AnimatePresence>
      <motion.div {...animateBasicMotionOpacity()} key="invoice-skeleton-loaders" className="flex flex-col w-full gap-4 pb-24">
        <InvoiceSkeletonLoader />
        <InvoiceSkeletonLoader />
        <InvoiceSkeletonLoader />
        <InvoiceSkeletonLoader />
        <InvoiceSkeletonLoader />
        <InvoiceSkeletonLoader />
      </motion.div>
    </AnimatePresence>
  )
}
