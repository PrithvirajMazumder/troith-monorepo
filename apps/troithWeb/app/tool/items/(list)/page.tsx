'use client'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { buttonVariants } from '@troith/shared'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useSuspenseQuery } from '@apollo/client'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { Item } from '@troithWeb/__generated__/graphql'
import { useRouter } from 'next-nprogress-bar'
import { ItemQueries } from '@troithWeb/app/tool/items/queries/itemQueries'
import { ItemCard } from '@troithWeb/app/tool/components/itemCard'

export default function Items() {
  const { selectedCompany } = useCompanyStore()
  const router = useRouter()
  const { data: itemsData } = useSuspenseQuery(ItemQueries.all, {
    variables: {
      companyId: selectedCompany?.id ?? ''
    },
    fetchPolicy: 'network-only'
  })

  return (
    <AnimatePresence>
      <Link
        href="/tool/items/create"
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-20 right-4', buttonVariants({ variant: 'default' }))}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create item
      </Link>
      <motion.div {...animateBasicMotionOpacity()} className="flex flex-col w-full gap-4 pb-24">
        {itemsData?.items?.map((item) => (
          <ItemCard onSelect={(item) => router.push(`/tool/items/${item.id}`)} entity={item as Item} key={`item-list-${item?.id}`} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
