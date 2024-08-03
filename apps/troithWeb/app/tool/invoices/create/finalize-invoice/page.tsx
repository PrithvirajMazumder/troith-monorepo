'use client'
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Separator
} from '@troith/shared'
import { useForm } from 'react-hook-form'
import { CreateInvoicePagesHeader } from '@troithWeb/app/tool/invoices/create/components/createInvoicePagesHeader'
import { FormField } from '@troith/shared/components/ui/form-field'
import { useSuspenseQuery } from '@apollo/client'
import { TaxQueries } from '@troithWeb/app/queries/taxQueries'
import { TaxCard } from '@troithWeb/app/tool/components/taxCard'
import { DialogBody } from 'next/dist/client/components/react-dev-overlay/internal/components/Dialog'
import { useState } from 'react'
import { BankQueries } from '@troithWeb/app/queries/bankQueries'
import { BankCard } from '@troithWeb/app/tool/components/bankCard'
import { FinaliseInvoiceFormFields, FinaliseInvoiceFormValidationSchema } from '@troithWeb/app/tool/invoices/create/finalize-invoice/schemas'
import { yupResolver } from '@hookform/resolvers/yup'
import { cn } from '@troith/shared/lib/util'
import { ChevronRight } from 'lucide-react'

export default function AddMisc() {
  const FINALIZE_INVOICE_FORM_ID = 'FINALIZE_INVOICE_FORM_ID'
  const { data: taxationData } = useSuspenseQuery(TaxQueries.all)
  const { data: bankData } = useSuspenseQuery(BankQueries.all)
  const [isTaxationDialogOpen, setIsTaxationDialogOpen] = useState(false)
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false)
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm<FinaliseInvoiceFormFields>({
    resolver: yupResolver(FinaliseInvoiceFormValidationSchema),
    defaultValues: {
      shouldUseIgst: false
    }
  })
  const bankId = watch('bank')
  const taxId = watch('taxation')
  const shouldUseIgst = watch('shouldUseIgst')

  return (
    <>
      <CreateInvoicePagesHeader
        title="Final information"
        subtitle="Please complete the invoice by entering the invoice number, tax details, and bank account information."
      />
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data)
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
            <Input {...register('invoiceNumber')} />
          </FormField>
          <FormField
            hasError={!!errors?.vehicleNumber}
            label="Vehicle number (optional)"
            hint={
              errors?.vehicleNumber?.message?.length
                ? errors?.vehicleNumber?.message
                : "For example: WB AA XXXX, MH 12 AA XXXX. Alternatively, you can provide other details, such as 'self.'"
            }
          >
            <Input {...register('vehicleNumber')} />
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
                    tax={tax}
                    onSelect={(tax) => {
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
                    bank={bank}
                    onSelect={(bank) => {
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
      </form>
      <Button
        form={FINALIZE_INVOICE_FORM_ID}
        className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-32 right-4')}
        variant="default"
      >
        Submit
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </>
  )
}
