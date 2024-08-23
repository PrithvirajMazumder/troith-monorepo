'use client'
import {
  Button,
  Calendar,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormField,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  useDebounce
} from '@troith/shared'
import { useForm } from 'react-hook-form'
import { CreateInvoicePagesHeader } from '@troithWeb/app/tool/invoices/create/components/createInvoicePagesHeader'
import { useLazyQuery, useSuspenseQuery } from '@apollo/client'
import { TaxQueries } from '@troithWeb/app/queries/taxQueries'
import { TaxCard } from '@troithWeb/app/tool/components/taxCard'
import { DialogBody } from 'next/dist/client/components/react-dev-overlay/internal/components/Dialog'
import { useEffect, useState } from 'react'
import { BankQueries } from '@troithWeb/app/queries/bankQueries'
import { BankCard } from '@troithWeb/app/tool/components/bankCard'
import { FinaliseInvoiceFormFields, FinaliseInvoiceFormValidationSchema } from 'apps/troithWeb/app/tool/invoices/create/finalize-invoice/validations'
import { yupResolver } from '@hookform/resolvers/yup'
import { cn } from '@troith/shared/lib/util'
import { CalendarIcon, ChevronRight, Loader } from 'lucide-react'
import { InvoiceQueries } from '@troithWeb/app/tool/invoices/queries/invoiceQueries'
import { GetInvoiceNumberWithNoQuery, Invoice } from '@troithWeb/__generated__/graphql'
import { format } from 'date-fns'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import { useFinalizeInvoice } from '@troithWeb/app/tool/invoices/create/finalize-invoice/hooks/useFinalizeInvoice'
import { useToast } from '@troith/shared/hooks/use-toast'
import { useRouter } from 'next-nprogress-bar'
import { usePathname } from 'next/navigation'

export default function AddMisc() {
  const FINALIZE_INVOICE_FORM_ID = 'FINALIZE_INVOICE_FORM_ID'
  const pathname = usePathname()
  const { selectedParty, invoiceItems, setCreatedInvoice, setSelectedBank, setSelectedTax, setSelectedDate } = useCreateInvoice()
  const router = useRouter()
  const { toast } = useToast()
  const { createInvoice } = useFinalizeInvoice()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: taxationData } = useSuspenseQuery(TaxQueries.all)
  const { data: bankData } = useSuspenseQuery(BankQueries.all)
  const { data: nextInvoiceNumberData } = useSuspenseQuery(InvoiceQueries.suggestedNextInvoiceNumber, {
    fetchPolicy: 'network-only'
  })
  const [fetchInvoiceByNumber, { data: invoiceNumberData, loading: isInvoiceNumberPresentLoading }] = useLazyQuery(
    InvoiceQueries.getInvoiceNumberWithNo
  )
  const [isTaxationDialogOpen, setIsTaxationDialogOpen] = useState(false)
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false)
  const [isDatePopupOpen, setIsDatePopupOpen] = useState(false)
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
  const {
    setError,
    handleSubmit,
    clearErrors,
    register,
    formState: { errors },
    watch,
    setValue,
    trigger,
    setFocus
  } = useForm<FinaliseInvoiceFormFields>({
    resolver: yupResolver(FinaliseInvoiceFormValidationSchema),
    defaultValues: {
      shouldUseIgst: false,
      invoiceNumber: nextInvoiceNumberData?.suggestedNextInvoiceNumber ?? '',
      date: ''
    }
  })
  const bankId = watch('bank')
  const taxId = watch('taxation')
  const shouldUseIgst = watch('shouldUseIgst')
  const invoiceNumber = watch('invoiceNumber')
  const date = watch('date')
  const debouncedInvoiceNumber = useDebounce(invoiceNumber, 1000)

  useEffect(() => {
    if ((debouncedInvoiceNumber as string)?.length && debouncedInvoiceNumber !== nextInvoiceNumberData?.suggestedNextInvoiceNumber) {
      void fetchInvoiceByNumber({
        variables: {
          no: `${debouncedInvoiceNumber}`
        }
      })
    }
  }, [debouncedInvoiceNumber])

  useEffect(() => {
    setIsSubmitting(false)
  }, [pathname])

  const validateInvoiceNumber = (invoiceNumberData: GetInvoiceNumberWithNoQuery | null | undefined): boolean => {
    if (invoiceNumberData?.invoiceByNo) {
      setError('invoiceNumber', {
        message: 'This invoice number cannot be used, an invoice is already present with this number'
      })
      setFocus('invoiceNumber')
      return false
    }
    clearErrors('invoiceNumber')
    return true
  }

  useEffect(() => {
    validateInvoiceNumber(invoiceNumberData)
  }, [invoiceNumberData])

  return (
    <>
      <CreateInvoicePagesHeader
        title="Finalize Invoice"
        subtitle="Please complete the invoice by entering the invoice number, tax details, and bank account information."
      />
      <form
        onSubmit={handleSubmit(async (data) => {
          const selectedBank = bankData?.banks?.find((bank) => bank.id === data.bank)
          const selectedTax = taxationData?.taxes?.find((tax) => tax.id === data.taxation)
          if (selectedBank && selectedTax) {
            try {
              setIsSubmitting(true)
              const { data: newInvoiceData } = await createInvoice({
                variables: {
                  companyId: '658db32a6cf334fc362c9cad',
                  date: new Date(data.date).toISOString(),
                  vehicleNumber: data.vehicleNumber ?? '',
                  bankId: data.bank,
                  taxId: data.taxation,
                  no: data.invoiceNumber,
                  partyId: selectedParty?.id ?? '',
                  invoiceItems: invoiceItems.map((invoiceItem) => ({
                    itemId: invoiceItem.item?.id ?? '',
                    price: invoiceItem.price,
                    quantity: invoiceItem.quantity
                  }))
                }
              })
              setCreatedInvoice(newInvoiceData?.createInvoice as Invoice)
              router.push(
                `/tool/invoices/${newInvoiceData?.createInvoice?.id}`,
                {},
                {
                  showProgressBar: true
                }
              )
            } catch (error) {
              toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong!',
                description: "Seems like this invoice can't be created right now."
              })
              setIsSubmitting(false)
            }
          }
        })}
        id={FINALIZE_INVOICE_FORM_ID}
        className="flex flex-col gap-3 px-1 w-full"
      >
        <div className="flex w-full items-start gap-4">
          <FormField
            hasError={!!errors?.invoiceNumber}
            label="Invoice number"
            hint={
              errors?.invoiceNumber?.message?.length
                ? errors?.invoiceNumber?.message
                : 'Must be a number. Default increment available for new values; do not use for past invoices.'
            }
          >
            <div className="h-max relative w-full">
              <Input {...register('invoiceNumber')} />
              {isInvoiceNumberPresentLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-max h-max flex items-center justify-center">
                  <Loader className="w-4 h-4 animate-spin" />
                </div>
              )}
            </div>
          </FormField>
          <FormField
            hasError={!!errors?.date}
            label="Date"
            hint={errors?.date?.message?.length ? errors?.date?.message : 'This is the primary date of your invoice.'}
          >
            <Popover open={isDatePopupOpen} onOpenChange={setIsDatePopupOpen}>
              <PopoverTrigger asChild>
                <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.length ? date : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(date)}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date.toISOString())
                      setValue('date', format(date, 'dd/MM/yyyy'))
                      void trigger('date')
                      setIsDatePopupOpen(false)
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </FormField>
        </div>
        <Separator decorative className="my-4" />
        <Label className={cn({ 'text-destructive': !!errors?.taxation })}>Taxation</Label>
        <Dialog open={isTaxationDialogOpen} onOpenChange={setIsTaxationDialogOpen}>
          <DialogTrigger asChild>
            <Button
              {...register('taxation')}
              className={cn(
                'border-dashed shadow-sm',
                { 'justify-start': Boolean(taxId?.length) },
                { 'text-destructive bg-destructive-foreground border-destructive hover:text-destructive': !!errors?.taxation }
              )}
              variant="outline"
            >
              {taxId?.length
                ? (() => {
                    const selectedTaxation = taxationData?.taxes?.find((tax) => tax.id === taxId)
                    return shouldUseIgst
                      ? `IGST: ${(selectedTaxation?.cgst ?? 0) + (selectedTaxation?.sgst ?? 0)}%`
                      : `CGST: ${selectedTaxation?.cgst}% | SGST: ${selectedTaxation?.sgst}%`
                  })()
                : 'Click to select a Taxation scheme'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Taxation</DialogTitle>
              <DialogDescription>Choose a GST scheme for your invoice.</DialogDescription>
            </DialogHeader>
            <DialogBody>
              {taxationData?.taxes?.map((tax) => {
                return (
                  <TaxCard
                    entity={tax}
                    onSelect={(tax) => {
                      setSelectedTax(tax)
                      setValue('taxation', tax.id ?? '')
                      setIsTaxationDialogOpen(false)
                      void trigger('taxation')
                    }}
                    key={tax.id}
                  />
                )
              })}
            </DialogBody>
          </DialogContent>
        </Dialog>
        <FormField
          htmlFor="shouldUseIgst"
          label="Should use IGST only in the invoice instead of CGST and SGST?"
          className="!flex-row-reverse w-max mt-4"
          labelClassName="!m-0"
        >
          <Checkbox checked={shouldUseIgst} onCheckedChange={(checked) => setValue('shouldUseIgst', checked as boolean)} id="shouldUseIgst" />
        </FormField>
        <Separator className="my-4" decorative />
        <Label className={cn({ 'text-destructive': !!errors?.bank })}>Bank</Label>
        <Dialog open={isBankDialogOpen} onOpenChange={setIsBankDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className={cn(
                'border-dashed shadow-sm capitalize',
                { 'justify-start': !!bankId?.length },
                { 'text-destructive bg-destructive-foreground border-destructive hover:text-destructive': !!errors?.bank }
              )}
              variant="outline"
            >
              {(() => {
                const selectedBank = bankData?.banks?.find((bank) => bank.id === bankId)
                return selectedBank ? `${selectedBank?.name} | ${selectedBank?.accountNumber}` : 'Click to select a Bank'
              })()}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Bank</DialogTitle>
              <DialogDescription>Choose a bank for your invoice.</DialogDescription>
            </DialogHeader>
            <DialogBody>
              {bankData?.banks?.map((bank) => {
                return (
                  <BankCard
                    isCompact
                    entity={bank}
                    onSelect={(bank) => {
                      setSelectedBank(bank)
                      setValue('bank', bank.id)
                      setIsBankDialogOpen(false)
                      void trigger('bank')
                    }}
                    key={bank.id}
                  />
                )
              })}
            </DialogBody>
          </DialogContent>
        </Dialog>
        <Separator className="my-4" />
        <FormField
          hasError={!!errors?.vehicleNumber}
          label="Vechicle umber (optional)"
          hint={
            errors?.vehicleNumber?.message?.length
              ? errors?.vehicleNumber?.message
              : "For example: WB AA XXXX, MH 12 AA XXXX. Alternatively, you can provide other details, such as 'self.'"
          }
          className="w-[calc(50%-0.5rem)]"
        >
          <Input {...register('vehicleNumber')} />
        </FormField>
      </form>
      <Button
        onClick={async () => {
          if (!validateInvoiceNumber(invoiceNumberData)) return
          const isValid = await trigger()
          if (isValid) {
            setIsConfirmationPopupOpen(true)
          }
        }}
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-32 right-4')}
        variant="default"
      >
        Submit
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
      <Dialog open={isConfirmationPopupOpen} onOpenChange={setIsConfirmationPopupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm submission</DialogTitle>
            <DialogDescription>Are you sure you want to create this invoice?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isSubmitting} variant="ghost" onClick={() => setIsConfirmationPopupOpen(false)}>
              No
            </Button>
            <Button form={FINALIZE_INVOICE_FORM_ID} disabled={isSubmitting}>
              {isSubmitting && <Loader className="mr-2 animate-spin w-4 h-4" />}
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
