'use client'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { buttonVariants } from '@troith/shared'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useQuery } from '@tanstack/react-query'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { BankCard } from '@troithWeb/app/tool/components/bankCard'
import { useRouter } from 'next-nprogress-bar'
import { Bank } from '@prisma/client'
import { useSession } from 'next-auth/react'

const fetchBanks = async (userId: string) => {
  const res = await fetch(`/api/banks/user/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch banks')
  return res.json()
}

export default function BanksPage() {
  const { selectedCompany } = useCompanyStore()
  const router = useRouter()
  const { data: session } = useSession()
  const { data: banks } = useQuery({
    queryKey: ['banks', session?.user?.id],
    queryFn: () => fetchBanks(session?.user?.id ?? ''),
    enabled: !!session?.user?.id
  })

  return (
    <AnimatePresence>
      <Link
        href="/tool/banks/create"
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-20 right-4', buttonVariants({ variant: 'default' }))}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create bank
      </Link>
      <motion.div {...animateBasicMotionOpacity()} className="flex flex-col w-full gap-4 pb-24">
        {banks?.map((bank: Bank) => (
          <BankCard onSelect={(bank) => router.push(`/tool/banks/${bank.id}`)} entity={bank} key={`bank-list-${bank?.id}`} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
