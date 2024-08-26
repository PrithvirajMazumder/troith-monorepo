'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { PartyCardSkeletonLoader } from '@troithWeb/app/tool/components/partyCard'

export default function PartiesLoading() {
  return (
    <AnimatePresence>
      <motion.div {...animateBasicMotionOpacity()} className="flex flex-col w-full gap-4 pb-24">
        <PartyCardSkeletonLoader />
        <PartyCardSkeletonLoader />
        <PartyCardSkeletonLoader />
        <PartyCardSkeletonLoader />
        <PartyCardSkeletonLoader />
        <PartyCardSkeletonLoader />
      </motion.div>
    </AnimatePresence>
  )
}
