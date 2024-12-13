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
import { TaxCard } from '@troithWeb/app/tool/components/taxCard'
import { useEffect, useState } from 'react'
import { BankCard } from '@troithWeb/app/tool/components/bankCard'
import { FinaliseInvoiceFormFields, FinaliseInvoiceFormValidationSchema } from 'apps/troithWeb/app/tool/invoices/create/finalize-invoice/validations'
import { yupResolver } from '@hookform/resolvers/yup'
import { cn } from '@troith/shared/lib/util'
import { CalendarIcon, ChevronRight, Loader } from 'lucide-react'
import { format } from 'date-fns'
import { useCreateInvoice } from '@troithWeb/app/tool/invoices/create/stores/createInvoice.store'
import { useFinalizeInvoice } from '@troithWeb/app/tool/invoices/create/finalize-invoice/hooks/useFinalizeInvoice'
import { usePathname } from 'next/navigation'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { taxesKeys } from '@troithWeb/app/tool/queryKeys/taxes'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { banksKeys } from '@troithWeb/app/tool/queryKeys/banks'
import { invoicesKeys } from '@troithWeb/app/tool/queryKeys/invoices'
import { fetchBanks, fetchInvoiceByNo, fetchNextInvoiceNo, fetchTaxes } from '@troithWeb/app/tool/invoices/create/finalize-invoice/apis'
import { InvoiceType } from '@troithWeb/types/invoices'
import { useSession } from 'next-auth/react'

export default function AddMisc() {
  const FINALIZE_INVOICE_FORM_ID = 'FINALIZE_INVOICE_FORM_ID'
  const pathname = usePathname()
  const { data: session } = useSession()
  const { selectedCompany } = useCompanyStore()
  const { setSelectedBank, setSelectedTax, setSelectedDate } = useCreateInvoice()
  const { createInvoice } = useFinalizeInvoice()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: taxationData } = useSuspenseQuery({
    queryKey: taxesKeys.lists(selectedCompany?.id ?? ''),
    queryFn: () => fetchTaxes(selectedCompany?.id ?? '')
  })
  const { data: bankData } = useSuspenseQuery({
    queryKey: banksKeys.lists(session?.user?.id ?? ''),
    queryFn: () => fetchBanks(session?.user?.id ?? '')
  })
  const { data: nextInvoiceNumberData } = useSuspenseQuery({
    queryKey: invoicesKeys.nextNo(selectedCompany?.id ?? ''),
    queryFn: fetchNextInvoiceNo
  })
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
      invoiceNumber: nextInvoiceNumberData ?? '',
      date: ''
    }
  })
  const bankId = watch('bank')
  const taxId = watch('taxation')
  const shouldUseIgst = watch('shouldUseIgst')
  const invoiceNumber = watch('invoiceNumber')
  const date = watch('date')
  const debouncedInvoiceNumber = useDebounce(invoiceNumber, 1000)

  const {
    refetch: fetchInvoiceByNumber,
    data: invoiceNumberData,
    isFetching: isInvoiceNumberPresentLoading
  } = useQuery({
    queryKey: invoicesKeys.byNo(invoiceNumber),
    queryFn: () => fetchInvoiceByNo(invoiceNumber),
    enabled: Boolean(invoiceNumber)
  })

  useEffect(() => {
    if ((debouncedInvoiceNumber as string)?.length && debouncedInvoiceNumber !== nextInvoiceNumberData) {
      void fetchInvoiceByNumber()
    }
  }, [debouncedInvoiceNumber])

  const validateInvoiceNumber = (invoiceNumberData: InvoiceType | null | undefined): boolean => {
    if (invoiceNumberData) {
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

  useEffect(() => {
    setIsSubmitting(false)
  }, [pathname])

  return (
    <>
      <CreateInvoicePagesHeader
        title="Finalize Invoice"
        subtitle="Please complete the invoice by entering the invoice number, tax details, and bank account information."
      />
      <form
        onSubmit={handleSubmit(async (data) => {
          const selectedBank = bankData?.find((bank) => bank.id === data.bank)
          const selectedTax = taxationData?.find((tax) => tax.id === data.taxation)
          if (selectedBank && selectedTax) {
            setIsSubmitting(true)
            void createInvoice({
              ...data,
              selectedBank,
              selectedTax
            })
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
                    const selectedTaxation = taxationData?.find((tax) => tax.id === taxId)
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
            {taxationData?.map((tax) => {
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
                const selectedBank = bankData?.find((bank) => bank.id === bankId)
                return selectedBank ? `${selectedBank?.name} | ${selectedBank?.accountNumber}` : 'Click to select a Bank'
              })()}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Bank</DialogTitle>
              <DialogDescription>Choose a bank for your invoice.</DialogDescription>
            </DialogHeader>
            {bankData?.map((bank) => {
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
