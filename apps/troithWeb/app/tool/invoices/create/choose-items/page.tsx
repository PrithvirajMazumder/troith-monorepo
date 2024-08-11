'use client'
import { useSuspenseQuery } from '@apollo/client'
import { ItemQueries } from '@troithWeb/app/tool/items/queries/itemQueries'
import { ItemCard } from '@troithWeb/app/tool/components/itemCard'
import { Item } from '@troithWeb/__generated__/graphql'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button } from '@troith/shared'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import { cn } from '@troith/shared/lib/util'
import { ChevronRight } from 'lucide-react'
import { CreateInvoicePagesHeader } from '@troithWeb/app/tool/invoices/create/components/createInvoicePagesHeader'
import { useEffect, useState } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'

type ItemsMap = { [key: string]: Item }

export default function SelectItemsCreateInvoicePage() {
  const AccordionId = 'party-items-collapsible'
  const { selectedItems: previouslySelectedItems, selectedParty, setSelectedItems: setFinalSelectedItems } = useCreateInvoice()
  const [selectedItems, setSelectedItems] = useState<Item[]>(previouslySelectedItems)
  const [selectedItemsMap, setSelectedItemsMap] = useState<ItemsMap>({} as ItemsMap)
  const { data: itemsData } = useSuspenseQuery(ItemQueries.itemsByCompanyId, {
    variables: { companyId: '658db32a6cf334fc362c9cad' }
  })
  const router = useRouter()

  const handleItemSelection = (item: Item) => {
    const filteredSelectedItemsWithoutExistingItem = selectedItems.filter((selectedItem) => selectedItem?.id !== item?.id)
    if (filteredSelectedItemsWithoutExistingItem?.length !== selectedItems?.length) {
      return setSelectedItems([...filteredSelectedItemsWithoutExistingItem])
    }

    setSelectedItems([...selectedItems, item])
  }

  useEffect(() => {
    const selectedItemsMap: ItemsMap = {}
    if (selectedItems?.length) {
      selectedItems?.forEach((selectedItem) => {
        selectedItemsMap[selectedItem.id] = selectedItem
      })
    }
    setSelectedItemsMap(selectedItemsMap)
  }, [selectedItems])

  return (
    <>
      <CreateInvoicePagesHeader className="!mb-2" title="Select Items" subtitle="Select the items you would like to add to this invoice." />
      {selectedParty?.partyItemIds?.length ? (
        <Accordion defaultValue={AccordionId} type="single" collapsible className="w-full">
          <AccordionItem defaultChecked value={AccordionId}>
            <AccordionTrigger>Party Items</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-3">
              {itemsData?.items
                ?.filter((item) => selectedParty?.partyItemIds?.find((partyItemId) => partyItemId === item?.id))
                ?.map((item) => (
                  <ItemCard isSelected={!!selectedItemsMap[item.id]} item={item as Item} key={item?.id} onSelect={handleItemSelection} />
                ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : null}
      <motion.div {...animateBasicMotionOpacity()} className="flex flex-col gap-3 mt-4">
        {itemsData?.items
          ?.filter((item) => !selectedParty?.partyItemIds?.find((partyItemId) => partyItemId === item?.id))
          ?.map((item) => (
            <ItemCard isSelected={!!selectedItemsMap[item.id]} item={item as Item} key={item?.id} onSelect={handleItemSelection} />
          ))}
      </motion.div>
      <Button
        disabled={!selectedItems?.length}
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-32 right-4')}
        variant="default"
        onClick={() => {
          setFinalSelectedItems(selectedItems)
          router.push(
            '/tool/invoices/create/configure-invoice-items',
            {},
            {
              showProgressBar: true
            }
          )
        }}
      >
        Continue
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </>
  )
}
