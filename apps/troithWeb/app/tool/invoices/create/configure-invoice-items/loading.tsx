'use client'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { motion } from 'framer-motion'
import { CreateInvoicePagesHeader } from '@troithWeb/app/tool/invoices/create/components/createInvoicePagesHeader'
import { ConfigureInvoiceItemSkeletonLoaderCard } from '@troithWeb/app/tool/components/configureInvoiceItemCard'

export default function CreateInvoiceConfigureInvoiceItemsLoading() {
  return (
    <>
      <CreateInvoicePagesHeader title="Configure Invoice Items" subtitle="Please add the quantity and price to the items that have been selected." />
      <motion.div className="flex flex-col gap-3" {...animateBasicMotionOpacity()}>
        <ConfigureInvoiceItemSkeletonLoaderCard />
        <ConfigureInvoiceItemSkeletonLoaderCard />
        <ConfigureInvoiceItemSkeletonLoaderCard />
        <ConfigureInvoiceItemSkeletonLoaderCard />
      </motion.div>
    </>
  )
}
