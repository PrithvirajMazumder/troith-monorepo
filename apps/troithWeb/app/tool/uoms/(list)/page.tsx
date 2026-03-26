'use client'
import { cn } from '@troith/shared/lib/util'
import { Button, Dialog, DialogContent, DialogPortal } from '@troith/shared'
import { Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { UomQueries } from '@troithWeb/app/tool/uoms/queries/uomQueries'
import { UomCard } from '@troithWeb/app/tool/components/uomCard'
import { Uom } from '@prisma/client'
import { CreateUomForm } from '@troithWeb/app/tool/uoms/components/CreateUomForm'
import { useState } from 'react'

export default function UomsListPage() {
  const { selectedCompany } = useCompanyStore()
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const { data: uomsData } = useSuspenseQuery(UomQueries.all(selectedCompany?.id ?? ''))

  return (
    <>
      <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
        <DialogPortal>
          <DialogContent autoFocus={false}>
            <CreateUomForm onSubmit={() => setIsCreateFormOpen(false)} />
          </DialogContent>
        </DialogPortal>
      </Dialog>
      <AnimatePresence>
        <Button onClick={() => setIsCreateFormOpen(true)} className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-20 right-4')}>
          <Plus className="h-4 w-4 mr-2" />
          Create UOM
        </Button>
        <motion.div {...animateBasicMotionOpacity()} className="flex flex-col w-full gap-4 pb-24">
          {uomsData?.map((uom: { id: string; name: string; abbreviation: string }) => (
            <UomCard entity={uom as unknown as Uom} onSelect={() => undefined} key={`uom-list-${uom?.id}`} />
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
