'use client'
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@troith/shared'
import { Check, ChevronRight, ChevronsUpDown, Loader } from 'lucide-react'
import { cn } from '@troith/shared/lib/util'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CreateItemValidationFormFields, CreateItemValidationSchema } from '@troithWeb/app/tool/items/create/validations'
import { yupResolver } from '@hookform/resolvers/yup'
import { usePathname } from 'next/navigation'
import { useToast } from '@troith/shared/hooks/use-toast'
import { useRouter } from 'next-nprogress-bar'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { uomKeys } from '@troithWeb/app/tool/queryKeys/uomKeys'
import { taxesKeys } from '@troithWeb/app/tool/queryKeys/taxes'
import { fetchTaxes, fetchUoms, saveItem } from '@troithWeb/app/tool/items/create/apis'
import { itemsKeys } from '@troithWeb/app/tool/queryKeys/items'

export default function CreateItemPage() {
  const CREATE_ITEM_FORM_ID = 'CREATE_ITEM_FORM_ID'
  const queryClient = useQueryClient()
  const { selectedCompany } = useCompanyStore()
  const { data: session } = useSession()
  const [isUomPopupOpen, setIsUomPopupOpen] = useState(false)
  const [isTaxesPopupOpen, setIsTaxesPopupOpen] = useState(false)
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const pathname = usePathname()
  const { toast } = useToast()
  const router = useRouter()

  const createItemMutation = useMutation({
    mutationFn: saveItem,
    onSuccess: () => {
      void queryClient?.invalidateQueries({
        queryKey: itemsKeys.lists(selectedCompany?.id ?? '')
      })
      router.replace('/tool/items')
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong!',
        description: "Seems like this item can't be created right now."
      })
      setIsSubmitting(false)
    }
  })

  const { data: uomsData } = useSuspenseQuery({
    queryKey: uomKeys.lists(session?.user?.id ?? ''),
    queryFn: () => fetchUoms(session?.user?.id ?? ''),
  })

  const { data: taxesData } = useSuspenseQuery({
    queryKey: taxesKeys.lists(selectedCompany?.id ?? ''),
    queryFn: () => fetchTaxes(selectedCompany?.id ?? '')
  })

  const {
    handleSubmit,
    trigger,
    register,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateItemValidationFormFields>({
    resolver: yupResolver(CreateItemValidationSchema)
  })
  const selectedUom = watch('uom')
  const selectedTax = watch('tax')

  useEffect(() => {
    setIsSubmitting(false)
  }, [pathname])

  const onSubmit = async (item: CreateItemValidationFormFields) => {
    setIsSubmitting(true)
    createItemMutation?.mutate({
      ...item,
      companyId: selectedCompany?.id ?? ''
    })
  }

  return (
    <>
      <Dialog open={isConfirmationPopupOpen} onOpenChange={setIsConfirmationPopupOpen}>
        <DialogContent autoFocus={false}>
          <DialogHeader>
            <DialogTitle>Confirm submission</DialogTitle>
            <DialogDescription>Are you sure you want to create this item?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isSubmitting} variant="ghost">
              No
            </Button>
            <Button disabled={isSubmitting} form={CREATE_ITEM_FORM_ID}>
              {isSubmitting && <Loader className="mr-2 animate-spin w-4 h-4" />}
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <form id={CREATE_ITEM_FORM_ID} onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-1 w-full gap-3">
        <div className="flex items-start gap-4">
          <FormField
            hasError={!!errors?.name?.message}
            hint={errors?.name?.message ?? 'This will be the official name of the item.'}
            className="w-full"
            label="Name"
          >
            <Input
              {...register('name', {
                onChange: () => trigger('name')
              })}
            />
          </FormField>
          <FormField
            className="w-3/5"
            label="HSN"
            hasError={!!errors?.hsn?.message}
            hint={
              errors?.hsn?.message ??
              'This will be the designated HSN (Harmonized System of Nomenclature) code for the item, which is required for official purposes.'
            }
          >
            <Input
              type="number"
              {...register('hsn', {
                onChange: () => trigger('hsn')
              })}
            />
          </FormField>
        </div>
        <div className="flex items-start gap-4">
          <FormField
            label="Unit of measurement"
            hasError={!!errors?.uom?.message}
            hint={errors?.uom?.message ?? 'Standard quantity used to express and compare dimensions, weight, volume, or other attributes.'}
          >
            <Popover open={isUomPopupOpen} onOpenChange={setIsUomPopupOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between capitalize">
                  {selectedUom ? uomsData?.find((companyUom) => companyUom?.id === selectedUom)?.name : '...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search uom..." />
                  <CommandList>
                    <CommandEmpty>No uom found.</CommandEmpty>
                    <CommandGroup>
                      {uomsData?.map((uom) => (
                        <CommandItem
                          className="capitalize"
                          onSelect={() => {
                            setValue('uom', uom?.id ?? '')
                            setIsUomPopupOpen(false)
                            void trigger('uom')
                          }}
                          key={uom.id}
                          value={`${uom.abbreviation} ${uom.name}`}
                        >
                          <Check className={cn('mr-2 h-4 w-4', selectedUom === uom.id ? 'opacity-100' : 'opacity-0')} />
                          {uom.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormField>
          <FormField
            hasError={!!errors?.tax?.message}
            label="Tax"
            hint={errors?.tax?.message ?? 'A percentage-based charge added to the price of goods/services, collected by the government.'}
          >
            <Popover open={isTaxesPopupOpen} onOpenChange={setIsTaxesPopupOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {selectedTax
                    ? (() => {
                        const tax = taxesData?.find((tax) => tax?.id === selectedTax)
                        return `CGST: ${tax?.cgst} | SGST: ${tax?.sgst}`
                      })()
                    : '...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search tax scheme..." />
                  <CommandList>
                    <CommandEmpty>No tax scheme found.</CommandEmpty>
                    <CommandGroup>
                      {taxesData?.map((tax) => (
                        <CommandItem
                          onSelect={() => {
                            setValue('tax', tax.id ?? '')
                            setIsTaxesPopupOpen(false)
                            void trigger('tax')
                          }}
                          key={tax.id}
                          value={`${tax.cgst} ${tax.sgst} ${tax.sgst + tax.cgst}`}
                        >
                          <Check className={cn('mr-2 h-4 w-4', selectedTax === tax.id ? 'opacity-100' : 'opacity-0')} />
                          {`CGST: ${tax?.cgst} | SGST: ${tax?.sgst}`}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormField>
        </div>
      </form>
      <Button
        onClick={async () => {
          const isValid = await trigger()
          if (isValid) {
            setIsConfirmationPopupOpen(true)
          }
        }}
        type="button"
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-36 right-4')}
        variant="default"
      >
        Submit
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </>
  )
}


