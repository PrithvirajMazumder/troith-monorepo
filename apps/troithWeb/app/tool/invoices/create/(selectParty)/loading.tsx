'use client'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { motion } from 'framer-motion'
import { PartyCardSkeletonLoader } from '@troithWeb/app/tool/components/partyCard'
import { CreateInvoicePagesHeader } from '@troithWeb/app/tool/invoices/create/components/createInvoicePagesHeader'

export default function CreateInvoiceSelectPartyLoading() {
  return (
    <>
      <CreateInvoicePagesHeader
        title="Select Party"
        subtitle="Please select a party for whom you would like to create this invoice from the available options."
      />
      <motion.div {...animateBasicMotionOpacity()} className="w-full flex flex-col gap-3 h-full">
        <PartyCardSkeletonLoader />
        <PartyCardSkeletonLoader />
        <PartyCardSkeletonLoader />
        <PartyCardSkeletonLoader />
      </motion.div>
    </>
  )
}
