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
import { FinaliseInvoiceFormFields, FinaliseInvoiceFormValidationSchema } from '@troithWeb/app/tool/invoices/create/misc/schemas'
import { yupResolver } from '@hookform/resolvers/yup'
import { Tax } from '@troithWeb/__generated__/graphql'
import { cn } from '@troith/shared/lib/util'

export default function AddMisc() {
  const { data: taxationData } = useSuspenseQuery(TaxQueries.all)
  const { data: bankData } = useSuspenseQuery(BankQueries.all)
  const [isTaxationDialogOpen, setIsTaxationDialogOpen] = useState(false)
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false)
  const {
    register,
    formState: { errors },
    watch,
    setValue
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
      <form className="flex flex-col gap-3 px-1 w-full">
        <FormField label="Invoice number" hint="Must be a number. Default increment available for new values; do not use for past invoices.">
          <Input />
        </FormField>
        <Separator decorative className="my-4" />
        <Label>Taxation</Label>
        <Dialog open={isTaxationDialogOpen} onOpenChange={setIsTaxationDialogOpen}>
          <DialogTrigger asChild>
            <Button className={cn('border-dashed shadow-sm', { 'justify-start': Boolean(taxId?.length) })} variant="outline">
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
              {taxationData?.taxes?.map((tax, index) => {
                return (
                  <TaxCard
                    tax={tax}
                    onSelect={(tax) => {
                      setValue('taxation', tax.id ?? '')
                      setIsTaxationDialogOpen(false)
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
        <Label>Bank</Label>
        <Dialog open={isBankDialogOpen} onOpenChange={setIsBankDialogOpen}>
          <DialogTrigger asChild>
            <Button className="border-dashed shadow-sm" variant="outline">
              Click to select a Bank
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
                    }}
                    key={bank.id}
                  />
                )
              })}
            </DialogBody>
          </DialogContent>
        </Dialog>
      </form>
    </>
  )
}
