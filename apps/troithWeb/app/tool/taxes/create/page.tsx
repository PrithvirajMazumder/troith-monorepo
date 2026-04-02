'use client'
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormField, Input } from '@troith/shared'
import { ChevronRight, Loader } from 'lucide-react'
import { cn } from '@troith/shared/lib/util'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import * as React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useToast } from '@troith/shared/hooks/use-toast'
import { useRouter } from 'next-nprogress-bar'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { taxesKeys } from '@troithWeb/app/tool/queryKeys/taxes'
import { object, number, string, type InferType } from 'yup'

const CreateTaxSchema = object().shape({
  cgst: number().required('CGST is required').min(0, 'CGST must be at least 0').max(100, 'CGST cannot exceed 100'),
  sgst: number().required('SGST is required').min(0, 'SGST must be at least 0').max(100, 'SGST cannot exceed 100')
})

type CreateTaxFormFields = InferType<typeof CreateTaxSchema>

const createTax = async (data: CreateTaxFormFields & { companyId: string }) => {
  const res = await fetch('/api/taxes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to create tax')
  return res.json()
}

export default function CreateTaxPage() {
  const CREATE_TAX_FORM_ID = 'CREATE_TAX_FORM_ID'
  const queryClient = useQueryClient()
  const { selectedCompany } = useCompanyStore()
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const createTaxMutation = useMutation({
    mutationFn: createTax,
    onSuccess: () => {
      void queryClient?.invalidateQueries({
        queryKey: taxesKeys.lists(selectedCompany?.id ?? '')
      })
      router.replace('/tool/taxes')
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong!',
        description: "Seems like this tax can't be created right now."
      })
      setIsSubmitting(false)
    }
  })

  const {
    handleSubmit,
    trigger,
    register,
    formState: { errors }
  } = useForm<CreateTaxFormFields>({
    resolver: yupResolver(CreateTaxSchema)
  })

  const onSubmit = async (tax: CreateTaxFormFields) => {
    setIsSubmitting(true)
    createTaxMutation.mutate({
      ...tax,
      companyId: selectedCompany?.id ?? ''
    })
  }

  return (
    <>
      <Dialog open={isConfirmationPopupOpen} onOpenChange={setIsConfirmationPopupOpen}>
        <DialogContent autoFocus={false}>
          <DialogHeader>
            <DialogTitle>Confirm submission</DialogTitle>
            <DialogDescription>Are you sure you want to create this tax?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isSubmitting} variant="ghost">
              No
            </Button>
            <Button disabled={isSubmitting} form={CREATE_TAX_FORM_ID}>
              {isSubmitting && <Loader className="mr-2 animate-spin w-4 h-4" />}
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <form id={CREATE_TAX_FORM_ID} onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-1 w-full gap-3">
        <div className="flex items-start gap-4">
          <FormField label="CGST (%)" hasError={!!errors?.cgst?.message} hint={errors?.cgst?.message ?? 'Central Goods and Services Tax percentage'}>
            <Input
              type="number"
              step="0.01"
              {...register('cgst', {
                onChange: () => trigger('cgst'),
                valueAsNumber: true
              })}
            />
          </FormField>
          <FormField label="SGST (%)" hasError={!!errors?.sgst?.message} hint={errors?.sgst?.message ?? 'State Goods and Services Tax percentage'}>
            <Input
              type="number"
              step="0.01"
              {...register('sgst', {
                onChange: () => trigger('sgst'),
                valueAsNumber: true
              })}
            />
          </FormField>
        </div>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Total IGST:</strong> {errors?.cgst || errors?.sgst ? '—' : '—'}%
          </p>
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
