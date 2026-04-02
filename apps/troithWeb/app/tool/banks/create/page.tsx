'use client'
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormField, Input } from '@troith/shared'
import { ChevronRight, Loader } from 'lucide-react'
import { cn } from '@troith/shared/lib/util'
import * as React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useToast } from '@troith/shared/hooks/use-toast'
import { useRouter } from 'next-nprogress-bar'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { object, string, number, type InferType } from 'yup'
import { useSession } from 'next-auth/react'
import { banksKeys } from '@troithWeb/app/tool/queryKeys/banks'

const CreateBankSchema = object().shape({
  name: string().required('Bank name is required'),
  holderName: string().required('Account holder name is required'),
  accountNumber: string().required('Account number is required').matches(/^\d+$/, 'Account number must be numeric'),
  ifsc: string()
    .required('IFSC code is required')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid IFSC code'),
  branch: string().required('Branch name is required')
})

type CreateBankFormFields = InferType<typeof CreateBankSchema>

const createBank = async (data: CreateBankFormFields & { userId: string }) => {
  const res = await fetch('/api/banks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, accountNumber: data.accountNumber })
  })
  if (!res.ok) throw new Error('Failed to create bank')
  return res.json()
}

export default function CreateBankPage() {
  const CREATE_BANK_FORM_ID = 'CREATE_BANK_FORM_ID'
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const createBankMutation = useMutation({
    mutationFn: createBank,
    onSuccess: () => {
      void queryClient?.invalidateQueries({
        queryKey: banksKeys.lists(session?.user?.id ?? '')
      })
      router.replace('/tool/banks')
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong!',
        description: "Seems like this bank can't be created right now."
      })
      setIsSubmitting(false)
    }
  })

  const {
    handleSubmit,
    trigger,
    register,
    formState: { errors }
  } = useForm<CreateBankFormFields>({
    resolver: yupResolver(CreateBankSchema)
  })

  const onSubmit = async (bank: CreateBankFormFields) => {
    setIsSubmitting(true)
    createBankMutation.mutate({
      ...bank,
      userId: session?.user?.id ?? ''
    })
  }

  return (
    <>
      <Dialog open={isConfirmationPopupOpen} onOpenChange={setIsConfirmationPopupOpen}>
        <DialogContent autoFocus={false}>
          <DialogHeader>
            <DialogTitle>Confirm submission</DialogTitle>
            <DialogDescription>Are you sure you want to create this bank?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isSubmitting} variant="ghost">
              No
            </Button>
            <Button disabled={isSubmitting} form={CREATE_BANK_FORM_ID}>
              {isSubmitting && <Loader className="mr-2 animate-spin w-4 h-4" />}
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <form id={CREATE_BANK_FORM_ID} onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-1 w-full gap-3">
        <div className="flex items-start gap-4">
          <FormField label="Bank Name" hasError={!!errors?.name?.message} hint={errors?.name?.message ?? 'Enter the bank name'} className="w-full">
            <Input
              {...register('name', {
                onChange: () => trigger('name')
              })}
            />
          </FormField>
          <FormField
            label="Account Holder Name"
            hasError={!!errors?.holderName?.message}
            hint={errors?.holderName?.message ?? 'Enter the account holder name'}
            className="w-full"
          >
            <Input
              {...register('holderName', {
                onChange: () => trigger('holderName')
              })}
            />
          </FormField>
        </div>
        <div className="flex items-start gap-4">
          <FormField
            label="Account Number"
            hasError={!!errors?.accountNumber?.message}
            hint={errors?.accountNumber?.message ?? 'Enter the account number'}
          >
            <Input
              type="text"
              {...register('accountNumber', {
                onChange: () => trigger('accountNumber')
              })}
            />
          </FormField>
          <FormField label="IFSC Code" hasError={!!errors?.ifsc?.message} hint={errors?.ifsc?.message ?? 'Enter the IFSC code (e.g., ABCD0123456)'}>
            <Input
              {...register('ifsc', {
                onChange: () => trigger('ifsc')
              })}
            />
          </FormField>
        </div>
        <FormField label="Branch" hasError={!!errors?.branch?.message} hint={errors?.branch?.message ?? 'Enter the branch name'}>
          <Input
            {...register('branch', {
              onChange: () => trigger('branch')
            })}
          />
        </FormField>
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
