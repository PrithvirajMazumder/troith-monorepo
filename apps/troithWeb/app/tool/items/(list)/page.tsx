'use client'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { buttonVariants } from '@troith/shared'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { useRouter } from 'next-nprogress-bar'
import { ItemCard } from '@troithWeb/app/tool/components/itemCard'
import { ItemType } from '@troithWeb/types/items'
import { useSuspenseQuery } from '@tanstack/react-query'
import { itemsKeys } from '@troithWeb/app/tool/queryKeys/items'

const fetchItems = async (companyId: string): Promise<Array<ItemType>> => await (await fetch(`/api/items/company/${companyId}`)).json()

export default function Items() {
  const { selectedCompany } = useCompanyStore()
  const router = useRouter()
  const { data: items } = useSuspenseQuery({
    queryKey: itemsKeys.lists(selectedCompany?.id ?? ''),
    queryFn: () => fetchItems(selectedCompany?.id ?? '')
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
        {items?.map((item) => (
          <ItemCard onSelect={(item) => router.push(`/tool/items/${item.id}`)} entity={item as ItemType} key={`item-list-${item?.id}`} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
