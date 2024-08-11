'use client'
import { Loader } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'

export default function InvoiceIdProgress() {
  return (
    <AnimatePresence>
      <motion.div {...animateBasicMotionOpacity()} className="flex flex-col w-full h-full justify-center items-center gap-2">
        <Loader className="w-6 h-6 min-w-6 min-h-6 animate-spin" />
        <motion.p {...animateBasicMotionOpacity()} className="text-muted-foreground text-sm">
          Loading
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
