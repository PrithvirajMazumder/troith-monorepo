'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { ItemCardSkeletonLoader } from '@troithWeb/app/tool/components/itemCard'

export default function PartiesLoading() {
  return (
    <AnimatePresence>
      <motion.div {...animateBasicMotionOpacity()} className="flex flex-col w-full gap-4 pb-24">
        <ItemCardSkeletonLoader />
        <ItemCardSkeletonLoader />
        <ItemCardSkeletonLoader />
        <ItemCardSkeletonLoader />
        <ItemCardSkeletonLoader />
        <ItemCardSkeletonLoader />
      </motion.div>
    </AnimatePresence>
  )
}
