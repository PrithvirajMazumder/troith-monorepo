# Invoice Improvements + Company Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add amount-to-words in invoice PDFs, replace hardcoded company details with dynamic data, add a `tagLine` field to Company, and build a company create/edit form with live business card preview.

**Architecture:** Utility-first approach — build the `numberToWords` utility and schema migration first, then wire into existing PDF generators, then build the company form as a new route reusing existing layout patterns (resizable panels, react-hook-form + Yup, framer-motion animations).

**Tech Stack:** Next.js 14 App Router, Prisma, react-hook-form, Yup, pdfMake, TanStack React Query, Framer Motion, shadcn/ui, Tailwind CSS

---

## File Map

### New Files
| File | Responsibility |
|------|---------------|
| `apps/troithWeb/utils/numberToWords.ts` | Convert numeric amounts to Indian English words with Rupees/Paise |
| `apps/troithWeb/app/tool/companies/create/layout.tsx` | Resizable panel layout (form left, business card preview right) |
| `apps/troithWeb/app/tool/companies/create/page.tsx` | Company create form with all field sections |
| `apps/troithWeb/app/tool/companies/create/validations/index.ts` | Yup validation schema for company form |
| `apps/troithWeb/app/tool/companies/create/hooks/useCompanyForm.ts` | Form submission logic with TanStack mutation |
| `apps/troithWeb/app/tool/companies/create/components/companyBusinessCard.tsx` | Live business card preview component |
| `apps/troithWeb/app/tool/companies/[id]/edit/page.tsx` | Edit form (loads existing company, reuses create components) |
| `apps/troithWeb/app/tool/companies/[id]/edit/layout.tsx` | Edit layout (reuses create layout pattern) |
| `apps/troithWeb/app/api/company/[id]/route.ts` | GET single company + PUT update endpoint |

### Modified Files
| File | Change |
|------|--------|
| `apps/troithWeb/prisma/schema/company.prisma` | Add `tagLine String?` field |
| `apps/troithWeb/repositories/company.repository.ts` | Add `update` method |
| `apps/troithWeb/app/tool/invoices/utils/generateCompleteInvoice.ts` | Dynamic company details + amount to words |
| `apps/troithWeb/app/tool/invoices/create/utils/generateHalfPdf.ts` | Dynamic company details + amount to words |
| `apps/troithWeb/app/tool/companies/(list)/page.tsx` | Add "Create Company" button |

---

## Task 1: Number-to-Words Utility

**Files:**
- Create: `apps/troithWeb/utils/numberToWords.ts`

- [ ] **Step 1: Create the numberToWords utility**

```typescript
// apps/troithWeb/utils/numberToWords.ts

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

function convertChunk(n: number): string {
  if (n === 0) return ''
  if (n < 20) return ones[n]
  if (n < 100) return `${tens[Math.floor(n / 10)]} ${ones[n % 10]}`.trim()
  return `${ones[Math.floor(n / 100)]} Hundred ${convertChunk(n % 100)}`.trim()
}

function convertToWords(n: number): string {
  if (n === 0) return 'Zero'

  let result = ''
  if (n >= 10000000) {
    result += `${convertChunk(Math.floor(n / 10000000))} Crore `
    n %= 10000000
  }
  if (n >= 100000) {
    result += `${convertChunk(Math.floor(n / 100000))} Lakh `
    n %= 100000
  }
  if (n >= 1000) {
    result += `${convertChunk(Math.floor(n / 1000))} Thousand `
    n %= 1000
  }
  result += convertChunk(n)
  return result.trim()
}

export function numberToWords(amount: number): string {
  const rupees = Math.floor(Math.abs(amount))
  const paiseRaw = Math.round((Math.abs(amount) - rupees) * 100)

  let result = `${convertToWords(rupees)} Rupees`
  if (paiseRaw > 0) {
    result += ` and ${convertToWords(paiseRaw)} Paise`
  }
  result += ' Only'
  return result
}
```

- [ ] **Step 2: Verify the utility compiles**

Run: `cd /Users/prithvi/projects/troith/troith-monorepo && npx tsc --noEmit apps/troithWeb/utils/numberToWords.ts 2>&1 || echo "checking via build" && npx nx build troithWeb --skip-nx-cache 2>&1 | tail -20`

- [ ] **Step 3: Commit**

```
feat: add numberToWords utility for converting amounts to Indian English words
```

---

## Task 2: Add tagLine Field to Company Schema + Migration

**Files:**
- Modify: `apps/troithWeb/prisma/schema/company.prisma`

- [ ] **Step 1: Add tagLine field to Company model**

In `apps/troithWeb/prisma/schema/company.prisma`, add `tagLine` after `email`:

```prisma
model Company {
  id           String    @id @default(cuid())
  userId       String
  name         String
  legalName    String
  gstin        String
  image        String?
  phone        String
  email        String
  tagLine      String?
  addressLine1 String
  addressLine2 String?
  state        String
  city         String
  zipCode      Int
  createdAt    DateTime  @default(now())
  deletedAt    DateTime?

  user    User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  Item    Item[]
  Party   Party[]
  Invoice Invoice[]
  Tax     Tax[]
}
```

- [ ] **Step 2: Run Prisma migration**

Run: `cd /Users/prithvi/projects/troith/troith-monorepo/apps/troithWeb && npx prisma migrate dev --name add_company_tagline`

- [ ] **Step 3: Verify Prisma client is regenerated**

Run: `cd /Users/prithvi/projects/troith/troith-monorepo/apps/troithWeb && npx prisma generate`

- [ ] **Step 4: Commit**

```
feat: add tagLine field to Company schema
```

---

## Task 3: Wire Dynamic Company Details into Invoice PDFs

**Files:**
- Modify: `apps/troithWeb/app/tool/invoices/utils/generateCompleteInvoice.ts`
- Modify: `apps/troithWeb/app/tool/invoices/create/utils/generateHalfPdf.ts`

- [ ] **Step 1: Update generateCompleteInvoice.ts**

Add the import at the top of `generateCompleteInvoice.ts`:

```typescript
import { numberToWords } from '@troithWeb/utils/numberToWords'
```

Replace line 66 (the hardcoded specialist text):

```typescript
// Old:
{
  text: 'Specialist in: Water Treatment Engineering',
  style: {
    italics: true
  }
}
// New:
...(invoice?.company?.tagLine
  ? [{ text: invoice.company.tagLine, style: { italics: true } }]
  : [])
```

Note: The `stack` property accepts an array, so we spread a conditional array. If tagLine is null/empty, nothing is added.

Replace line 110 (hardcoded phone):

```typescript
// Old:
[{ text: 'Phone: 1234567890', colSpan: 2 }, '', '', '']
// New:
[{ text: `Phone: ${invoice?.company?.phone ?? ''}`, colSpan: 2 }, '', '', '']
```

Replace lines 112-116 (hardcoded email):

```typescript
// Old:
{
  text: 'Email: p@p.com',
  colSpan: 2
}
// New:
{
  text: `Email: ${invoice?.company?.email ?? ''}`,
  colSpan: 2
}
```

Replace line 254 (hardcoded "ruppes"):

```typescript
// Old:
['', '', { text: 'ruppes', colSpan: 2 }, '']
// New:
['', '', { text: numberToWords(netTotal), colSpan: 2, style: { fontSize: InvoiceFontSizes.SmallFontSize } }, '']
```

- [ ] **Step 2: Update generateHalfPdf.ts**

Add the import at the top of `generateHalfPdf.ts`:

```typescript
import { numberToWords } from '@troithWeb/utils/numberToWords'
```

Replace line 248 (hardcoded specialist text in `getBaseInvoicePdf`):

```typescript
// Old:
{
  text: 'Specialist in: Water Treatment Engineering',
  style: {
    italics: true
  }
}
// New:
...(company?.tagLine
  ? [{ text: company.tagLine, style: { italics: true } }]
  : [])
```

Replace line 278 (hardcoded phone):

```typescript
// Old:
[{ text: 'Phone: 1234567890', colSpan: 2 }, '', '', '']
// New:
[{ text: `Phone: ${company?.phone ?? ''}`, colSpan: 2 }, '', '', '']
```

Replace lines 280-285 (hardcoded email):

```typescript
// Old:
{
  text: 'Email: p@p.com',
  colSpan: 2
}
// New:
{
  text: `Email: ${company?.email ?? ''}`,
  colSpan: 2
}
```

Replace line 408 (hardcoded "ruppes"):

```typescript
// Old:
['', '', { text: 'ruppes', colSpan: 2 }, '']
// New:
['', '', { text: '', colSpan: 2 }, '']
```

In `putFinalInvoiceInfo` function (around line 127), add this after the existing `thirdSection` updates:

```typescript
thirdSection.body[6][2].text = numberToWords(netTotal)
thirdSection.body[6][2].style = { fontSize: InvoiceFontSizes.SmallFontSize }
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/prithvi/projects/troith/troith-monorepo && npx nx build troithWeb --skip-nx-cache 2>&1 | tail -20`

- [ ] **Step 4: Commit**

```
feat: replace hardcoded company details and rupees text with dynamic data in invoice PDFs
```

---

## Task 4: Company Repository Update + API Endpoint

**Files:**
- Modify: `apps/troithWeb/repositories/company.repository.ts`
- Create: `apps/troithWeb/app/api/company/[id]/route.ts`

- [ ] **Step 1: Add update method to company repository**

In `apps/troithWeb/repositories/company.repository.ts`, add inside the returned object (after the `findWithFilters` method):

```typescript
update: (id: string, data: Prisma.CompanyUpdateInput) => {
  return prisma.company.update({
    where: { id },
    data
  })
}
```

- [ ] **Step 2: Create the single-company API route**

Create `apps/troithWeb/app/api/company/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { CompanyRepository } from '@troithWeb/repositories/company.repository'
import { auth } from '@troithWeb/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const company = await CompanyRepository().findById(id)
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json({ error: 'Unable to fetch company' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await req.json()
    const updated = await CompanyRepository().update(id, data)

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating company:', error)
    return NextResponse.json({ error: 'Unable to update company' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Commit**

```
feat: add company update repository method and single-company API route
```

---

## Task 5: Company Form Validation Schema

**Files:**
- Create: `apps/troithWeb/app/tool/companies/create/validations/index.ts`

- [ ] **Step 1: Create the validation schema**

```typescript
// apps/troithWeb/app/tool/companies/create/validations/index.ts
import { InferType, number, object, string } from 'yup'

export const CompanyFormValidationSchema = object().shape({
  name: string().required('Company name is required.'),
  legalName: string().required('Legal name is required.'),
  tagLine: string().optional().nullable(),
  phone: string().required('Phone number is required.').min(10, 'Phone number must be at least 10 digits.'),
  email: string().required('Email is required.').email('Please enter a valid email address.'),
  addressLine1: string().required('Address line 1 is required.'),
  addressLine2: string().optional().nullable(),
  city: string().required('City is required.'),
  state: string().required('State is required.'),
  zipCode: number().typeError('Invalid zip code.').required('Zip code is required.').positive('Zip code must be positive.'),
  gstin: string().required('GSTIN is required.').length(15, 'GSTIN must be exactly 15 characters.')
})

export type CompanyFormFields = InferType<typeof CompanyFormValidationSchema>
```

- [ ] **Step 2: Commit**

```
feat: add company form Yup validation schema
```

---

## Task 6: Company Form Hook

**Files:**
- Create: `apps/troithWeb/app/tool/companies/create/hooks/useCompanyForm.ts`

- [ ] **Step 1: Create the form submission hook**

```typescript
// apps/troithWeb/app/tool/companies/create/hooks/useCompanyForm.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next-nprogress-bar'
import { useToast } from '@troith/shared/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { companiesKeys } from '@troithWeb/app/tool/queryKeys/companies'
import { CompanyFormFields } from '@troithWeb/app/tool/companies/create/validations'
import { Company } from '@prisma/client'

const createCompany = async (data: CompanyFormFields & { userId: string }): Promise<Company> => {
  const res = await fetch('/api/companies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, user: { connect: { id: data.userId } } })
  })
  if (!res.ok) throw new Error('Failed to create company')
  return res.json()
}

const updateCompany = async (id: string, data: CompanyFormFields): Promise<Company> => {
  const res = await fetch(`/api/company/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to update company')
  return res.json()
}

export const useCompanyForm = (companyId?: string) => {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const isEditing = !!companyId

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CompanyFormFields) => {
      if (isEditing) {
        return updateCompany(companyId, data)
      }
      return createCompany({ ...data, userId: session?.user?.id ?? '' })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: companiesKeys.all })
      toast({
        title: isEditing ? 'Company updated' : 'Company created',
        description: isEditing ? 'Your company has been updated successfully.' : 'Your company has been created successfully.'
      })
      router.push('/tool/companies')
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: isEditing ? 'Unable to update the company right now.' : 'Unable to create the company right now.'
      })
    }
  })

  return { submitCompany: mutate, isPending }
}
```

- [ ] **Step 2: Commit**

```
feat: add useCompanyForm hook for create/edit mutations
```

---

## Task 7: Business Card Preview Component

**Files:**
- Create: `apps/troithWeb/app/tool/companies/create/components/companyBusinessCard.tsx`

- [ ] **Step 1: Create the business card preview**

```tsx
// apps/troithWeb/app/tool/companies/create/components/companyBusinessCard.tsx
'use client'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin } from 'lucide-react'
import { cn } from '@troith/shared/lib/util'

interface CompanyBusinessCardProps {
  name: string
  legalName: string
  tagLine?: string
  phone: string
  email: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  gstin: string
}

export const CompanyBusinessCard = ({
  legalName,
  tagLine,
  phone,
  email,
  addressLine1,
  addressLine2,
  city,
  state,
  zipCode,
  gstin
}: CompanyBusinessCardProps) => {
  const hasAddress = addressLine1 || city || state

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <p className="text-xs text-muted-foreground uppercase tracking-widest">Live Preview</p>

      {/* Business Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'w-full max-w-[380px] aspect-[1.75/1] rounded-lg p-6 flex flex-col justify-between',
          'bg-gradient-to-br from-white via-stone-50 to-stone-100',
          'dark:from-zinc-800 dark:via-zinc-850 dark:to-zinc-900',
          'border border-stone-200 dark:border-zinc-700',
          'shadow-xl shadow-stone-200/50 dark:shadow-black/30',
          'relative overflow-hidden'
        )}
      >
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 3h1v1H1V3zm2-2h1v1H3V1z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
          }}
        />

        {/* Top: Company identity */}
        <div className="relative z-10">
          <motion.h2
            key={legalName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              'text-lg font-bold tracking-wide uppercase leading-tight',
              'text-stone-800 dark:text-stone-100',
              !legalName && 'text-stone-300 dark:text-zinc-600'
            )}
          >
            {legalName || 'Company Name'}
          </motion.h2>
          {tagLine && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] italic text-stone-500 dark:text-stone-400 mt-0.5"
            >
              {tagLine}
            </motion.p>
          )}
        </div>

        {/* Divider */}
        <div className="relative z-10 my-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-stone-300 dark:via-zinc-600 to-transparent" />
        </div>

        {/* Bottom: Contact details */}
        <div className="relative z-10 space-y-1.5">
          {/* Phone & Email row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-stone-400 dark:text-stone-500" />
                <span className="text-[11px] text-stone-600 dark:text-stone-300">{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-stone-400 dark:text-stone-500" />
                <span className="text-[11px] text-stone-600 dark:text-stone-300">{email}</span>
              </div>
            )}
          </div>

          {/* Address */}
          {hasAddress && (
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3 h-3 text-stone-400 dark:text-stone-500 mt-0.5 shrink-0" />
              <span className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                {[addressLine1, addressLine2, city, state && `${state} ${zipCode}`].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {/* GSTIN */}
          {gstin && (
            <p className="text-[10px] font-mono tracking-wider text-stone-400 dark:text-stone-500 mt-1">
              GSTIN: {gstin}
            </p>
          )}
        </div>
      </motion.div>

      {/* Invoice header preview */}
      <div className="w-full max-w-[380px]">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 text-center">As seen on invoice</p>
        <div className="border rounded-md p-4 bg-white dark:bg-zinc-900 text-xs space-y-0.5 font-mono">
          <p className="font-bold text-sm">{legalName || 'Company Name'}</p>
          {tagLine && <p className="italic text-muted-foreground">{tagLine}</p>}
          {hasAddress && (
            <p className="text-muted-foreground">
              Address: {[addressLine1, addressLine2, city].filter(Boolean).join(', ')}
            </p>
          )}
          {(state || zipCode) && (
            <p className="text-muted-foreground capitalize">{state}: {zipCode}</p>
          )}
          {phone && <p className="text-muted-foreground">Phone: {phone}</p>}
          {email && <p className="text-muted-foreground">Email: {email}</p>}
          {gstin && <p className="text-muted-foreground">GSTIN: {gstin}</p>}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```
feat: add CompanyBusinessCard live preview component
```

---

## Task 8: Company Create Page + Layout

**Files:**
- Create: `apps/troithWeb/app/tool/companies/create/layout.tsx`
- Create: `apps/troithWeb/app/tool/companies/create/page.tsx`

- [ ] **Step 1: Create the layout with resizable panels**

```tsx
// apps/troithWeb/app/tool/companies/create/layout.tsx
'use client'
import {
  H3,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  buttonVariants
} from '@troith/shared'
import { X } from 'lucide-react'
import { PropsWithChildren } from 'react'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'

export default function CreateCompanyLayout({ children }: PropsWithChildren) {
  return (
    <AnimatePresence>
      <motion.header {...animateBasicMotionOpacity()} className="border-b px-4 pb-4">
        <div className="flex items-center gap-2 h-16">
          <H3>Create Company</H3>
          <Link className={cn('ml-auto', buttonVariants({ variant: 'ghost', size: 'icon' }))} href="/tool/companies">
            <X className="w-4 h-4" />
          </Link>
        </div>
      </motion.header>
      <ResizablePanelGroup autoSaveId="CREATE_COMPANY_FORM_RESIZABLE" direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={70} minSize={70} maxSize={80}>
          <ScrollArea className="px-4 pt-4 pb-20 h-full w-full relative">{children}</ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="bg-gray-50 dark:bg-zinc-900" defaultSize={30} maxSize={30} minSize={20}>
          <ScrollArea className="pt-4 pb-20 h-full w-full relative" id="company-preview-panel" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Create the company form page**

```tsx
// apps/troithWeb/app/tool/companies/create/page.tsx
'use client'
import { Button, FormField, Input, Label, Separator } from '@troith/shared'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CompanyFormFields, CompanyFormValidationSchema } from '@troithWeb/app/tool/companies/create/validations'
import { useCompanyForm } from '@troithWeb/app/tool/companies/create/hooks/useCompanyForm'
import { CompanyBusinessCard } from '@troithWeb/app/tool/companies/create/components/companyBusinessCard'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { cn } from '@troith/shared/lib/util'
import { ChevronRight, Loader } from 'lucide-react'
import { H4 } from '@troith/shared'
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
            <FormField
              hasError={!!errors?.phone}
              label="Phone"
              hint={errors?.phone?.message || 'Primary contact number.'}
            >
              <Input {...register('phone')} />
            </FormField>
            <FormField
              hasError={!!errors?.email}
              label="Email"
              hint={errors?.email?.message || 'Business email address.'}
            >
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
```

- [ ] **Step 3: Verify it builds**

Run: `cd /Users/prithvi/projects/troith/troith-monorepo && npx nx build troithWeb --skip-nx-cache 2>&1 | tail -30`

- [ ] **Step 4: Commit**

```
feat: add company create page with resizable layout and live business card preview
```

---

## Task 9: Company Edit Page

**Files:**
- Create: `apps/troithWeb/app/tool/companies/[id]/edit/layout.tsx`
- Create: `apps/troithWeb/app/tool/companies/[id]/edit/page.tsx`

- [ ] **Step 1: Create the edit layout**

```tsx
// apps/troithWeb/app/tool/companies/[id]/edit/layout.tsx
'use client'
import {
  H3,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  buttonVariants
} from '@troith/shared'
import { X } from 'lucide-react'
import { PropsWithChildren } from 'react'
import Link from 'next/link'
import { cn } from '@troith/shared/lib/util'
import { AnimatePresence, motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'

export default function EditCompanyLayout({ children }: PropsWithChildren) {
  return (
    <AnimatePresence>
      <motion.header {...animateBasicMotionOpacity()} className="border-b px-4 pb-4">
        <div className="flex items-center gap-2 h-16">
          <H3>Edit Company</H3>
          <Link className={cn('ml-auto', buttonVariants({ variant: 'ghost', size: 'icon' }))} href="/tool/companies">
            <X className="w-4 h-4" />
          </Link>
        </div>
      </motion.header>
      <ResizablePanelGroup autoSaveId="EDIT_COMPANY_FORM_RESIZABLE" direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={70} minSize={70} maxSize={80}>
          <ScrollArea className="px-4 pt-4 pb-20 h-full w-full relative">{children}</ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="bg-gray-50 dark:bg-zinc-900" defaultSize={30} maxSize={30} minSize={20}>
          <ScrollArea className="pt-4 pb-20 h-full w-full relative" id="company-edit-preview-panel" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Create the edit form page**

```tsx
// apps/troithWeb/app/tool/companies/[id]/edit/page.tsx
'use client'
import { Button, FormField, Input, Label, Separator } from '@troith/shared'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CompanyFormFields, CompanyFormValidationSchema } from '@troithWeb/app/tool/companies/create/validations'
import { useCompanyForm } from '@troithWeb/app/tool/companies/create/hooks/useCompanyForm'
import { CompanyBusinessCard } from '@troithWeb/app/tool/companies/create/components/companyBusinessCard'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { cn } from '@troith/shared/lib/util'
import { ChevronRight, Loader } from 'lucide-react'
import { H4 } from '@troith/shared'
import { motion } from 'framer-motion'
import { animateBasicMotionOpacity } from '@troithWeb/app/tool/invoices/utils/animations'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { companiesKeys } from '@troithWeb/app/tool/queryKeys/companies'
import { Company } from '@prisma/client'

const fetchCompany = async (id: string): Promise<Company> => {
  const res = await fetch(`/api/company/${id}`)
  if (!res.ok) throw new Error('Failed to fetch company')
  return res.json()
}

export default function EditCompanyPage() {
  const { id } = useParams<{ id: string }>()
  const { submitCompany, isPending } = useCompanyForm(id)
  const [previewContainer, setPreviewContainer] = useState<HTMLElement | null>(null)

  const { data: company, isLoading } = useQuery({
    queryKey: companiesKeys.detail(id),
    queryFn: () => fetchCompany(id),
    enabled: !!id
  })

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<CompanyFormFields>({
    resolver: yupResolver(CompanyFormValidationSchema)
  })

  useEffect(() => {
    if (company) {
      reset({
        name: company.name,
        legalName: company.legalName,
        tagLine: company.tagLine ?? '',
        phone: company.phone,
        email: company.email,
        addressLine1: company.addressLine1,
        addressLine2: company.addressLine2 ?? '',
        city: company.city,
        state: company.state,
        zipCode: company.zipCode,
        gstin: company.gstin
      })
    }
  }, [company, reset])

  const watchedValues = watch()

  useEffect(() => {
    const el = document.getElementById('company-edit-preview-panel')
    if (el) {
      const viewport = el.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement
      setPreviewContainer(viewport ?? el)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <motion.div {...animateBasicMotionOpacity()}>
        <div className="mb-6">
          <H4>Edit Company</H4>
          <p className="text-muted-foreground text-sm">Update your company details below.</p>
          <Separator className="mt-3" />
        </div>

        <form
          id="EDIT_COMPANY_FORM"
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
            <FormField
              hasError={!!errors?.phone}
              label="Phone"
              hint={errors?.phone?.message || 'Primary contact number.'}
            >
              <Input {...register('phone')} />
            </FormField>
            <FormField
              hasError={!!errors?.email}
              label="Email"
              hint={errors?.email?.message || 'Business email address.'}
            >
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
          form="EDIT_COMPANY_FORM"
          type="submit"
          disabled={isPending}
          className={cn('shadow-md shadow-primary dark:shadow-none absolute bottom-32 right-4')}
        >
          {isPending && <Loader className="mr-2 animate-spin w-4 h-4" />}
          Update Company
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
```

- [ ] **Step 3: Commit**

```
feat: add company edit page with prefilled form and live business card preview
```

---

## Task 10: Add Create Company Button to Company List

**Files:**
- Modify: `apps/troithWeb/app/tool/companies/(list)/page.tsx`

- [ ] **Step 1: Add the create button**

In `apps/troithWeb/app/tool/companies/(list)/page.tsx`, add to imports:

```typescript
import { Button } from '@troith/shared'
import Link from 'next/link'
import { Plus } from 'lucide-react'
```

Wrap the `DataTable` return with a fragment and add a header with the button. Replace the return statement (lines 82-98):

```tsx
return (
  <div className="flex flex-col h-full w-full">
    <div className="flex items-center justify-end px-4 pt-4">
      <Button asChild size="sm">
        <Link href="/tool/companies/create">
          <Plus className="w-4 h-4 mr-2" />
          Create Company
        </Link>
      </Button>
    </div>
    <DataTable
      columns={columns}
      data={data?.data ?? []}
      total={data?.total ?? 0}
      page={page}
      limit={limit}
      isLoading={isLoading}
      searchValue={searchValue}
      onPageChange={handlePageChange}
      onSearchChange={handleSearchChange}
      onRowClick={(company) => router.push(`/tool/companies/${company.id}`)}
      activeRowId={activeCompanyId}
      searchPlaceholder="Search companies..."
    />
  </div>
)
```

- [ ] **Step 2: Commit**

```
feat: add Create Company button to company list page
```

---

## Task 11: Final Build Verification

- [ ] **Step 1: Run full build**

Run: `cd /Users/prithvi/projects/troith/troith-monorepo && npx nx build troithWeb --skip-nx-cache`

Expected: Build succeeds with no errors.

- [ ] **Step 2: Run lint**

Run: `cd /Users/prithvi/projects/troith/troith-monorepo && npx nx lint troithWeb`

Expected: No lint errors.

- [ ] **Step 3: Manual verification checklist**

Run the dev server and verify:
1. Navigate to `/tool/companies` — "Create Company" button is visible
2. Click it — form loads with business card preview on right panel
3. Type in fields — business card updates live
4. Submit with valid data — company is created, redirects to list
5. Open an existing invoice PDF — phone/email come from company data, tagLine replaces hardcoded specialist text
6. Invoice PDF shows amount in words instead of "ruppes" (e.g., "Four Hundred Fifty Three Rupees Only")
