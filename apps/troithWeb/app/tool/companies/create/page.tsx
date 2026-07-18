'use client'
import { Button, FormField, H4, Input, Label, Separator } from '@troith/shared'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CompanyFormFields, CompanyFormValidationSchema } from '@troithWeb/app/tool/companies/create/validations'
import { useCompanyForm } from '@troithWeb/app/tool/companies/create/hooks/useCompanyForm'
import { CompanyBusinessCard } from '@troithWeb/app/tool/companies/create/components/companyBusinessCard'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { cn } from '@troith/shared/lib/util'
import { ChevronRight, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'

export default function CreateCompanyPage() {
  const { submitCompany, isPending } = useCompanyForm()
  const [previewContainer, setPreviewContainer] = useState<HTMLElement | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CompanyFormFields>({
    resolver: yupResolver(CompanyFormValidationSchema),
    defaultValues: {
      name: '',
      legalName: '',
      tagLine: '',
      phone: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: undefined,
      gstin: ''
    }
  })

  const watchedValues = watch()

  useEffect(() => {
    const el = document.getElementById('company-preview-panel')
    if (el) {
      const viewport = el.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement
      setPreviewContainer(viewport ?? el)
    }
  }, [])

  return (
    <>
      <motion.div {...animateBasicMotionOpacity()}>
        <div className="mb-6">
          <H4>Create Company</H4>
          <p className="text-muted-foreground text-sm">Fill in the details below to create a new company.</p>
          <Separator className="mt-3" />
        </div>

        <form
          id="CREATE_COMPANY_FORM"
          onSubmit={handleSubmit((data) => submitCompany(data))}
          className="flex flex-col gap-3 px-1 w-full max-w-2xl"
        >
          {/* Identity Section */}
          <Label className="text-xs uppercase tracking-widest text-muted-foreground mt-2">Identity</Label>
          <div className="flex w-full items-start gap-4">
            <FormField
              hasError={!!errors?.name}
              label="Company name"
              hint={errors?.name?.message || 'Display name for internal use.'}
            >
              <Input {...register('name')} />
            </FormField>
            <FormField
              hasError={!!errors?.legalName}
              label="Legal name"
              hint={errors?.legalName?.message || 'Official registered name, shown on invoices.'}
            >
              <Input {...register('legalName')} />
            </FormField>
          </div>
          <FormField
            hasError={!!errors?.tagLine}
            label="Tag line (optional)"
            hint={errors?.tagLine?.message || 'e.g., "Specialist in: Water Treatment Engineering"'}
          >
            <Input {...register('tagLine')} />
          </FormField>

          <Separator decorative className="my-4" />

          {/* Contact Section */}
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">Contact</Label>
          <div className="flex w-full items-start gap-4">
            <FormField hasError={!!errors?.phone} label="Phone" hint={errors?.phone?.message || 'Primary contact number.'}>
              <Input {...register('phone')} />
            </FormField>
            <FormField hasError={!!errors?.email} label="Email" hint={errors?.email?.message || 'Business email address.'}>
              <Input type="email" {...register('email')} />
            </FormField>
          </div>

          <Separator decorative className="my-4" />

          {/* Address Section */}
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">Address</Label>
          <FormField
            hasError={!!errors?.addressLine1}
            label="Address line 1"
            hint={errors?.addressLine1?.message || 'Street address.'}
          >
            <Input {...register('addressLine1')} />
          </FormField>
          <FormField
            hasError={!!errors?.addressLine2}
            label="Address line 2 (optional)"
            hint={errors?.addressLine2?.message || 'Apartment, suite, floor, etc.'}
          >
            <Input {...register('addressLine2')} />
          </FormField>
          <div className="flex w-full items-start gap-4">
            <FormField hasError={!!errors?.city} label="City" hint={errors?.city?.message || ''}>
              <Input {...register('city')} />
            </FormField>
            <FormField hasError={!!errors?.state} label="State" hint={errors?.state?.message || ''}>
              <Input {...register('state')} />
            </FormField>
            <FormField hasError={!!errors?.zipCode} label="Zip code" hint={errors?.zipCode?.message || ''}>
              <Input type="number" {...register('zipCode')} />
            </FormField>
          </div>

          <Separator decorative className="my-4" />

          {/* Tax Section */}
          <Label className="text-xs uppercase tracking-widest text-muted-foreground">Tax</Label>
          <FormField
            hasError={!!errors?.gstin}
            label="GSTIN"
            hint={errors?.gstin?.message || '15-character Goods & Services Tax Identification Number.'}
            className="w-[calc(50%-0.5rem)]"
          >
            <Input {...register('gstin')} className="uppercase font-mono tracking-wider" />
          </FormField>
        </form>

        <Button
          form="CREATE_COMPANY_FORM"
          type="submit"
          disabled={isPending}
          className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-32 right-4')}
        >
          {isPending && <Loader className="mr-2 animate-spin w-4 h-4" />}
          Create Company
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </motion.div>

      {/* Portal the business card preview into the right panel */}
      {previewContainer &&
        createPortal(
          <CompanyBusinessCard
            name={watchedValues.name ?? ''}
            legalName={watchedValues.legalName ?? ''}
            tagLine={watchedValues.tagLine ?? undefined}
            phone={watchedValues.phone ?? ''}
            email={watchedValues.email ?? ''}
            addressLine1={watchedValues.addressLine1 ?? ''}
            addressLine2={watchedValues.addressLine2 ?? undefined}
            city={watchedValues.city ?? ''}
            state={watchedValues.state ?? ''}
            zipCode={String(watchedValues.zipCode ?? '')}
            gstin={watchedValues.gstin ?? ''}
          />,
          previewContainer
        )}
    </>
  )
}
