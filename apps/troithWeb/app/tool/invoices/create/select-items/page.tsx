'use client'
import { useSuspenseQuery } from '@apollo/client'
import { ItemQueries } from '@troithWeb/app/tool/items/queries/itemQueries'
import { ItemCard } from '@troithWeb/app/tool/components/itemCard'
import { Item } from '@troithWeb/__generated__/graphql'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, buttonVariants, H3 } from '@troith/shared'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import { cn } from '@troith/shared/lib/util'
import { ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SelectItemsCreateInvoicePage() {
  const AccordionId = 'party-items-collapsible'
  const { data: itemsData } = useSuspenseQuery(ItemQueries.itemsByCompanyId, {
    variables: { companyId: '658db32a6cf334fc362c9cad' }
  })
  const { selectedParty, setSelectedItems, selectedItems } = useCreateInvoice()
  const router = useRouter()

  const handleItemSelection = (item: Item) => {
    const filteredSelectedItemsWithoutExistingItem = selectedItems.filter((selectedItem) => selectedItem?.id !== item?.id)
    if (filteredSelectedItemsWithoutExistingItem?.length !== selectedItems?.length) {
      return setSelectedItems([...filteredSelectedItemsWithoutExistingItem])
    }

    setSelectedItems([...selectedItems, item])
  }

  return (
    <>
      <H3 className="mb-4">Select Items</H3>
      {selectedParty?.partyItemIds?.length ? (
        <Accordion defaultValue={AccordionId} type="single" collapsible className="w-full">
          <AccordionItem defaultChecked value={AccordionId}>
            <AccordionTrigger>Party Items</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-3">
              {itemsData?.items
                ?.filter((item) => selectedParty?.partyItemIds?.find((partyItemId) => partyItemId === item?.id))
                ?.map((item) => (
                  <ItemCard
                    isSelected={!!selectedItems.find((selectedItem) => selectedItem.id === item.id)}
                    item={item as Item}
                    key={item?.id}
                    onSelect={handleItemSelection}
                  />
                ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : null}
      <div className="flex flex-col gap-3 mt-4">
        {itemsData?.items
          ?.filter((item) => !selectedParty?.partyItemIds?.find((partyItemId) => partyItemId === item?.id))
          ?.map((item) => (
            <ItemCard
              isSelected={!!selectedItems.find((selectedItem) => selectedItem.id === item.id)}
              item={item as Item}
              key={item?.id}
              onSelect={handleItemSelection}
            />
          ))}
      </div>
      <Button
        disabled={!selectedItems?.length}
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-32 right-4')}
        variant="default"
        onClick={() => {
          router.push('/tool/invoices/create/tax')
        }}
      >
        Continue
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </>
  )
}
