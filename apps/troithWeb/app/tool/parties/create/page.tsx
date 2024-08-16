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
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator
} from '@troith/shared'
import { FormField } from '@troith/shared/components/ui/form-field'
import { useMutation, useSuspenseQuery } from '@apollo/client'
import { StateQueries } from '@troithWeb/app/queries/stateQueries'
import { Check, ChevronRight, ChevronsUpDown, Loader } from 'lucide-react'
import * as React from 'react'
import { cn } from '@troith/shared/lib/util'
import { useForm } from 'react-hook-form'
import { CreatePartyFormFields, CreatePartySchema } from '@troithWeb/app/tool/parties/create/schemas'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { PartyMutations } from '@troithWeb/app/tool/parties/queries/partyMutations'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { useToast } from '@troith/shared/hooks/use-toast'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next-nprogress-bar'

export default function CreatePartyPage() {
  const CREATE_PARTY_FORM_ID = 'CREATE_PARTY_FORM_ID'
  const [isStatePopupOpen, setIsStatePopupOpen] = useState(false)
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { selectedCompany } = useCompanyStore()
  const { data: stateData } = useSuspenseQuery(StateQueries.allIndianStates)
  const [createParty] = useMutation(PartyMutations.create)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const {
    formState: { errors },
    watch,
    setValue,
    clearErrors,
    register,
    handleSubmit,
    trigger
  } = useForm<CreatePartyFormFields>({
    resolver: yupResolver(CreatePartySchema),
    reValidateMode: 'onChange'
  })
  const state = watch('state')

  useEffect(() => {
    setIsSubmitting(false)
  }, [pathname])

  return (
    <>
      <Dialog open={isConfirmationPopupOpen} onOpenChange={setIsConfirmationPopupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm submission</DialogTitle>
            <DialogDescription>Are you sure you want to create this party?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isSubmitting} variant="ghost">
              No
            </Button>
            <Button disabled={isSubmitting} form={CREATE_PARTY_FORM_ID}>
              {isSubmitting && <Loader className="mr-2 animate-spin w-4 h-4" />}
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <form
        id={CREATE_PARTY_FORM_ID}
        onSubmit={handleSubmit(async (data) => {
          try {
            setIsSubmitting(true)
            const resp = await createParty({
              variables: {
                companyId: selectedCompany?.id ?? '',
                zipCode: data.zipCode,
                name: data.name,
                city: data.city,
                state: data.state,
                gstin: data.gstin,
                addressLine1: data.gstin,
                partyItemIds: [],
                addressLine2: data.addressLine2 ?? ''
              }
            })
            router.replace(`/tool/parties/${resp?.data?.createParty.id}`)
          } catch (error) {
            toast({
              variant: 'destructive',
              title: 'Uh oh! Something went wrong!',
              description: "Seems like this party can't be created right now."
            })
          }
        })}
        className="flex flex-col gap-3 px-1 w-full"
      >
        <div className="flex gap-4">
          <FormField hasError={!!errors?.name?.message} label="Party name" hint={errors?.name?.message ?? "Please enter your party's legal name"}>
            <Input
              {...register('name', {
                onChange: () => clearErrors('name')
              })}
            />
          </FormField>
          <FormField
            hasError={!!errors?.gstin?.message}
            label="GSTIN"
            hint={
              errors?.gstin?.message ??
              "Please enter the party's GSTIN number, which will be helpful for taxation purposes and for generating invoices and challans."
            }
          >
            <Input
              {...register('gstin', {
                onChange: () => clearErrors('gstin')
              })}
              maxLength={15}
              minLength={15}
            />
          </FormField>
        </div>
        <Separator className="my-4" />
        <div className="flex w-full flex-col gap-6">
          <FormField
            hasError={!!errors?.addressLine1?.message}
            label="Address Line 1"
            hint={errors?.addressLine1?.message ?? "This can be your party's housing number, street name, locality"}
          >
            <Input
              {...register('addressLine1', {
                onChange: () => clearErrors('addressLine1')
              })}
            />
          </FormField>
          <FormField label="Address Line 2 (optional)" hint="Please provide any additional address details for your party.">
            <Input
              {...register('addressLine2', {
                onChange: () => clearErrors('addressLine2')
              })}
            />
          </FormField>
          <div className="flex items-start gap-4">
            <FormField label="State" hasError={!!errors?.state?.message} hint={errors?.state?.message ?? ''}>
              <Popover open={isStatePopupOpen} onOpenChange={setIsStatePopupOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {state ? stateData?.indianStates.find((foundState) => foundState?.value && foundState?.value === state)?.displayName : '...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search state..." />
                    <CommandList>
                      <CommandEmpty>No state found.</CommandEmpty>
                      <CommandGroup>
                        {stateData?.indianStates.map((indianState) => (
                          <CommandItem
                            onSelect={() => {
                              setValue('state', indianState.value)
                              setIsStatePopupOpen(false)
                              clearErrors('state')
                            }}
                            key={indianState.value}
                            value={indianState.displayName}
                          >
                            <Check className={cn('mr-2 h-4 w-4', state === indianState.value ? 'opacity-100' : 'opacity-0')} />
                            {indianState.displayName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormField>
            <FormField label="City" hasError={!!errors?.city?.message} hint={errors?.city?.message ?? ''}>
              <Input
                {...register('city', {
                  onChange: () => clearErrors('city')
                })}
              />
            </FormField>
          </div>
          <div className="flex items-center gap-4">
            <FormField label="Zip Code" className="w-[calc(50%-0.5rem)]" hasError={!!errors?.zipCode?.message} hint={errors?.zipCode?.message ?? ''}>
              <Input
                maxLength={6}
                minLength={6}
                type="number"
                {...register('zipCode', {
                  onChange: () => clearErrors('zipCode')
                })}
              />
            </FormField>
          </div>
        </div>
        <Button
          onClick={async () => {
            if (await trigger()) {
              setIsConfirmationPopupOpen(true)
            }
          }}
          type="button"
          className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-32 right-4')}
          variant="default"
        >
          Submit
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </form>
    </>
  )
}
