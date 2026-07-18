# Invoice Improvements + Company Form Design

**Date**: 2026-04-03
**Status**: Approved

## Overview

Two related improvements:
1. Convert invoice NET TOTAL to words (e.g., "Four Hundred Fifty Three Rupees Only") instead of hardcoded "ruppes"
2. Replace hardcoded company details (phone, email, tagline) in invoice PDFs with actual company data, adding a company create/edit form with live business card preview

## Part 1: Amount to Words Utility

### Location
`apps/troithWeb/utils/numberToWords.ts`

### Behavior
- Converts any numeric amount to Indian English words with Rupees/Paise
- `453` → `"Four Hundred Fifty Three Rupees Only"`
- `1250.50` → `"One Thousand Two Hundred Fifty Rupees and Fifty Paise Only"`
- `0` → `"Zero Rupees Only"`
- Handles amounts up to 99,99,99,999 (Indian numbering: crores, lakhs, thousands, hundreds)
- Decimal part (paise) limited to 2 digits
- Exported function: `numberToWords(amount: number): string`

### Integration
- `generateCompleteInvoice.ts` line 254: Replace `{ text: 'ruppes', colSpan: 2 }` with `{ text: numberToWords(netTotal), colSpan: 2 }`
- `generateHalfPdf.ts` line 408: Replace `{ text: 'ruppes', colSpan: 2 }` with dynamic text (default empty, updated via `putFinalInvoiceInfo`)

## Part 2: Company Schema Change

### New Field
```prisma
model Company {
  ...existing fields...
  tagLine String?   // e.g., "Specialist in: Water Treatment Engineering"
}
```

### Migration
- Add `tagLine` as optional `String?` to Company model
- Run `npx prisma migrate dev --name add_company_tagline`

## Part 3: Dynamic Company Details in Invoice PDFs

### Changes in `generateCompleteInvoice.ts`
- Line 66: `'Specialist in: Water Treatment Engineering'` → `company?.tagLine ?? ''` (hide the text node entirely if tagLine is null)
- Line 110: `'Phone: 1234567890'` → `'Phone: ${company?.phone}'`
- Line 113: `'Email: p@p.com'` → `'Email: ${company?.email}'`

### Changes in `generateHalfPdf.ts`
- Line 248: `'Specialist in: Water Treatment Engineering'` → `company?.tagLine ?? ''`
- Line 278: `'Phone: 1234567890'` → `'Phone: ${company?.phone}'`
- Line 281: `'Email: p@p.com'` → `'Email: ${company?.email}'`

### Data Flow
The `company` object passed to both generators already includes `phone`, `email`, and `gstin` from the database. After adding `tagLine` to the schema, it will also be available. No additional API changes needed — just ensure the company query includes the new field.

## Part 4: Company Create/Edit Form with Live Business Card Preview

### Routing
- `/tool/companies/create` — New company form
- `/tool/companies/[id]/edit` — Edit existing company

### Layout
Same resizable panel pattern as invoice creation (`create/layout.tsx`):
- **Left panel (70%, min 70%, max 80%)**: Single-page form
- **ResizableHandle** with handle
- **Right panel (30%, min 20%, max 30%)**: Live business card preview, `bg-gray-50 dark:bg-zinc-900` background

### Form Sections
All on one page, separated by section headers (muted text + separator):

**Identity**
- Company name (`name`) — required, text input
- Legal name (`legalName`) — required, text input
- Tag line (`tagLine`) — optional, text input, placeholder: "e.g., Specialist in: Water Treatment Engineering"

**Contact**
- Phone (`phone`) — required, text input
- Email (`email`) — required, email input

**Address**
- Address line 1 (`addressLine1`) — required, text input
- Address line 2 (`addressLine2`) — optional, text input
- City (`city`) — required, text input
- State (`state`) — required, text input
- Zip code (`zipCode`) — required, number input

**Tax**
- GSTIN (`gstin`) — required, text input

### Validation
react-hook-form + Yup schema:
- `name`: required string
- `legalName`: required string
- `tagLine`: optional string
- `phone`: required string, min 10 chars
- `email`: required string, valid email format
- `addressLine1`: required string
- `addressLine2`: optional string
- `city`: required string
- `state`: required string
- `zipCode`: required number, positive
- `gstin`: required string, 15 chars (Indian GSTIN format)

### Business Card Preview Component

**Aesthetic**: Editorial/refined with material contrast. Typography-first, floating card feel.

**Front of card:**
```
┌─────────────────────────────────────┐
│                                     │
│   ESCON ENGINEERING                 │  ← Legal name, bold, large
│   Specialist in: Water Treatment    │  ← Tag line, italic, muted
│                                     │
│   ──────────────────────────────    │  ← Thin geometric divider
│                                     │
│   📞  1234567890                    │  ← Phone with icon
│   ✉   hello@escon.com              │  ← Email with icon
│                                     │
│   SN ROY ROAD, KOLKATA             │  ← Address, smaller muted text
│   West Bengal: 700038              │
│                                     │
│   GSTIN: 22AAAAA0000A1Z5           │  ← Monospace style
│                                     │
└─────────────────────────────────────┘
```

**Visual details:**
- Subtle paper/linen texture via CSS noise or gradient
- Company name uppercase, tracking-wide
- Tag line in italic, muted color
- Thin 1px divider with slight gradient fade at edges
- Contact details with small lucide-react icons (Phone, Mail)
- Address in smaller muted text
- GSTIN in monospace font, slightly smaller
- Card has `shadow-lg` with slight perspective transform for "desk" feel
- Smooth transitions when field values change (framer-motion)
- Card scales responsively within the right panel
- Dark mode: card shifts to a dark paper tone

**No card flip** — keeping it simple. All info on one face since there's no natural front/back split.

### State Management
React Hook Form `watch()` for live preview — no separate context store needed since it's all on one page.

### API
- **POST** `/api/companies` — already exists, accepts `Prisma.CompanyCreateInput`
- **PUT** `/api/companies/[id]` — needs to be created for editing
- Company repository already has `create` method; needs `update` method added

### Company Repository Changes
Add to `company.repository.ts`:
```typescript
update: async (id: string, data: Prisma.CompanyUpdateInput) => {
  return prisma.company.update({ where: { id }, data })
}
```

### Navigation
- Add a "Create Company" button on the companies list page (top right, similar to invoice list)
- Add an "Edit" action when viewing a company detail
- After successful create/edit, redirect to `/tool/companies` with the new company selected

## Files to Create
- `apps/troithWeb/utils/numberToWords.ts` — amount to words utility
- `apps/troithWeb/app/tool/companies/create/page.tsx` — create form page
- `apps/troithWeb/app/tool/companies/create/layout.tsx` — resizable panel layout
- `apps/troithWeb/app/tool/companies/create/components/companyBusinessCard.tsx` — live preview card
- `apps/troithWeb/app/tool/companies/create/validations/index.ts` — Yup schema
- `apps/troithWeb/app/tool/companies/create/hooks/useCompanyForm.ts` — form logic hook
- `apps/troithWeb/app/tool/companies/[id]/edit/page.tsx` — edit form (reuses create components)
- `apps/troithWeb/app/api/companies/[id]/route.ts` — PUT endpoint for update

## Files to Modify
- `apps/troithWeb/prisma/schema/company.prisma` — add tagLine field
- `apps/troithWeb/app/tool/invoices/utils/generateCompleteInvoice.ts` — dynamic company details + amount to words
- `apps/troithWeb/app/tool/invoices/create/utils/generateHalfPdf.ts` — dynamic company details + amount to words
- `apps/troithWeb/repositories/company.repository.ts` — add update method
- `apps/troithWeb/app/tool/companies/(list)/page.tsx` — add create button
