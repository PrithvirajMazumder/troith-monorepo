'use client'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin } from 'lucide-react'
import { cn } from '@troith/shared/lib/util'

interface CompanyBusinessCardProps {
  name: string
  legalName: string
  tagLine?: string
  phone: string
  email: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  gstin: string
}

export const CompanyBusinessCard = ({
  legalName,
  tagLine,
  phone,
  email,
  addressLine1,
  addressLine2,
  city,
  state,
  zipCode,
  gstin
}: CompanyBusinessCardProps) => {
  const hasAddress = addressLine1 || city || state

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <p className="text-xs text-muted-foreground uppercase tracking-widest">Live Preview</p>

      {/* Business Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'w-full max-w-[380px] aspect-[1.75/1] rounded-lg p-6 flex flex-col justify-between',
          'bg-gradient-to-br from-white via-stone-50 to-stone-100',
          'dark:from-zinc-800 dark:via-zinc-850 dark:to-zinc-900',
          'border border-stone-200 dark:border-zinc-700',
          'shadow-xl shadow-stone-200/50 dark:shadow-black/30',
          'relative overflow-hidden'
        )}
      >
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }}
        />

        {/* Top: Company identity */}
        <div className="relative z-10">
          <motion.h2
            key={legalName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              'text-lg font-bold tracking-wide uppercase leading-tight',
              'text-stone-800 dark:text-stone-100',
              !legalName && 'text-stone-300 dark:text-zinc-600'
            )}
          >
            {legalName || 'Company Name'}
          </motion.h2>
          {tagLine && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] italic text-stone-500 dark:text-stone-400 mt-0.5"
            >
              {tagLine}
            </motion.p>
          )}
        </div>

        {/* Divider */}
        <div className="relative z-10 my-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-stone-300 dark:via-zinc-600 to-transparent" />
        </div>

        {/* Bottom: Contact details */}
        <div className="relative z-10 space-y-1.5">
          {/* Phone & Email row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-stone-400 dark:text-stone-500" />
                <span className="text-[11px] text-stone-600 dark:text-stone-300">{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-stone-400 dark:text-stone-500" />
                <span className="text-[11px] text-stone-600 dark:text-stone-300">{email}</span>
              </div>
            )}
          </div>

          {/* Address */}
          {hasAddress && (
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3 h-3 text-stone-400 dark:text-stone-500 mt-0.5 shrink-0" />
              <span className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                {[addressLine1, addressLine2, city, state && `${state} ${zipCode}`].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {/* GSTIN */}
          {gstin && (
            <p className="text-[10px] font-mono tracking-wider text-stone-400 dark:text-stone-500 mt-1">
              GSTIN: {gstin}
            </p>
          )}
        </div>
      </motion.div>

      {/* Invoice header preview */}
      <div className="w-full max-w-[380px]">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 text-center">As seen on invoice</p>
        <div className="border rounded-md p-4 bg-white dark:bg-zinc-900 text-xs space-y-0.5 font-mono">
          <p className="font-bold text-sm">{legalName || 'Company Name'}</p>
          {tagLine && <p className="italic text-muted-foreground">{tagLine}</p>}
          {hasAddress && (
            <p className="text-muted-foreground">
              Address: {[addressLine1, addressLine2, city].filter(Boolean).join(', ')}
            </p>
          )}
          {(state || zipCode) && (
            <p className="text-muted-foreground capitalize">
              {state}: {zipCode}
            </p>
          )}
          {phone && <p className="text-muted-foreground">Phone: {phone}</p>}
          {email && <p className="text-muted-foreground">Email: {email}</p>}
          {gstin && <p className="text-muted-foreground">GSTIN: {gstin}</p>}
        </div>
      </div>
    </div>
  )
}
