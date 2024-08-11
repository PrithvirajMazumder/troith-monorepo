'use client'
import { motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { ItemCardSkeletonLoader } from '@troithWeb/app/tool/components/itemCard'
import { CreateInvoicePagesHeader } from '@troithWeb/app/tool/invoices/create/components/createInvoicePagesHeader'

export default function CreateInvoiceChooseItemsLoading() {
  return (
    <>
      <CreateInvoicePagesHeader className="!mb-2" title="Select Items" subtitle="Select the items you would like to add to this invoice." />
      <motion.div {...animateBasicMotionOpacity()} className="flex flex-col gap-3 mt-4 w-full">
        <ItemCardSkeletonLoader />
        <ItemCardSkeletonLoader />
        <ItemCardSkeletonLoader />
        <ItemCardSkeletonLoader />
      </motion.div>
    </>
  )
}
