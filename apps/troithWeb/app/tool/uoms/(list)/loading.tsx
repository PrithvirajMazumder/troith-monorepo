'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { UomCardSkeletonLoader } from '@troithWeb/app/tool/components/taxCard'

export default function PartiesLoading() {
  return (
    <AnimatePresence>
      <motion.div {...animateBasicMotionOpacity()} className="flex flex-col w-full gap-4 pb-24">
        <UomCardSkeletonLoader />
        <UomCardSkeletonLoader />
        <UomCardSkeletonLoader />
        <UomCardSkeletonLoader />
        <UomCardSkeletonLoader />
        <UomCardSkeletonLoader />
      </motion.div>
    </AnimatePresence>
  )
}
