'use client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  H4,
  Input,
  Separator
} from '@troith/shared'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CreateUomFormFields, CreateUomValidationSchema } from '@troithWeb/app/tool/uoms/components/CreateUomForm/validations'
import { Check, Loader } from 'lucide-react'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { UomMutations } from '@troithWeb/app/tool/uoms/queries/uomMutations'
import { useCompanyStore } from '@troithWeb/app/tool/stores/CompanySore'
import { useToast } from '@troith/shared/hooks/use-toast'

type Props = {
  onSubmit?: () => void
}

export const CreateUomForm = ({ onSubmit }: Props) => {
  const CREATE_UOM_FORM_ID = 'CREATE_UOM_FORM_ID'
  const { selectedCompany } = useCompanyStore()
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)

  const [create, { loading: isSubmitting }] = useMutation(UomMutations.create)
  const {
    handleSubmit,
    trigger,
    register,
    formState: { errors }
  } = useForm<CreateUomFormFields>({
    resolver: yupResolver(CreateUomValidationSchema)
  })
  const { toast } = useToast()

  const onContinue = async (uom: CreateUomFormFields) => {
    try {
      await create({
        variables: {
          companyId: selectedCompany?.id ?? '',
          name: uom.name,
          abbreviation: uom.abbreviation
        }
      })
      onSubmit && onSubmit()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong!',
        description: "Seems like this uom can't be created right now."
      })
    }
  }

  return (
    <>
      <Dialog open={isConfirmationPopupOpen} onOpenChange={setIsConfirmationPopupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm submission</DialogTitle>
            <DialogDescription>Are you sure you want to create this uom?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isSubmitting} variant="ghost">
              No
            </Button>
            <Button disabled={isSubmitting} form={CREATE_UOM_FORM_ID}>
              {isSubmitting && <Loader className="mr-2 animate-spin w-4 h-4" />}
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <H4>Create UOM Form</H4>
      <Separator />
      <form className="flex flex-col w-full gap-4" id={CREATE_UOM_FORM_ID} onSubmit={handleSubmit(onContinue)}>
        <FormField
          hasError={!!errors?.name?.message}
          hint={errors?.name?.message ?? 'This will help you to identify find this uom in the future'}
          label="Name"
        >
          <Input
            {...register('name', {
              onChange: () => trigger('name')
            })}
          />
        </FormField>
        <FormField
          hasError={!!errors?.abbreviation?.message}
          hint={errors?.abbreviation?.message ?? 'This is the short form of the actual name of the uom, for example ("kg" for "kilogram")'}
          label="Abbreviation"
        >
          <Input
            {...register('abbreviation', {
              onChange: () => trigger('abbreviation')
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
        className="w-full mt-4"
      >
        Submit
        <Check className="h-4 w-4 ml-2" />
      </Button>
    </>
  )
}
