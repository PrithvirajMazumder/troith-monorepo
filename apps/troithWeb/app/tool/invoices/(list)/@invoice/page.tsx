'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'

export default function InvoicePageDefault() {
  return (
    <AnimatePresence>
      <motion.div {...animateBasicMotionOpacity()} className="pt-28">
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-xl mb-2 font-semibold">Empty here</h1>
          <p className="text-sm">👈 Select an invoice form the list to sneak it!</p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
