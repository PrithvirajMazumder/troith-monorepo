# Financial Year Invoice Numbering & FY Selector

**Date**: 2026-04-03
**Status**: Draft

## Overview

Indian billing cycles follow the financial year (April 1 - March 31). Invoice numbers must reset at the start of each FY, be sequential and unique within a FY per company, and comply with GST Rule 46 (max 16 alphanumeric characters including hyphens/slashes).

**Display format**: `INV/{FY}/{ZERO-PADDED-SEQ}` e.g. `INV/25-26/00001`

## 1. Data Model Changes

### Invoice Schema

- `no` remains `Int`, but remove `@unique` and `@default(autoincrement())`
- Add `financialYear String` (e.g., `"25-26"`)
- Add compound unique: `@@unique([companyId, financialYear, no])`

### Utility Functions

**`formatInvoiceNo(no: number, financialYear: string): string`**
- Returns `INV/${financialYear}/${String(no).padStart(5, '0')}`
- Used in UI components, PDF generation, and API responses

**`getFinancialYear(date: Date): string`**
- If month >= April (index 3): FY = `{lastTwoDigitsOfYear}-{lastTwoDigitsOfYear+1}` (e.g., April 2025 -> `"25-26"`)
- If month < April: FY = `{lastTwoDigitsOfYear-1}-{lastTwoDigitsOfYear}` (e.g., Feb 2026 -> `"25-26"`)

### Migration

- Populate `financialYear` on existing invoices based on their `date` field using `getFinancialYear(date)` logic
- Re-sequence `no` per company per FY: group existing invoices by `(companyId, financialYear)`, order by original `no`, renumber starting from 1
- Drop the global `@unique` on `no`, add compound unique `@@unique([companyId, financialYear, no])`

## 2. Backend Logic

### Repository: `findNextInvoiceNo(companyId, financialYear)`

- Query max `no` where `companyId` AND `financialYear` match
- Return `max + 1`, or `1` if no invoices exist for that company+FY

### API Changes

**`GET /api/invoices/nextInvoiceNo`**
- Accepts `companyId` and `date` as query params
- Derives `financialYear` from `date`
- Returns `{ no: number, formatted: string, financialYear: string }`

**`POST /api/invoices`**
- On creation, derives `financialYear` from the invoice `date`
- Auto-assigns next sequence number for that company+FY
- Compound unique constraint prevents duplicates at DB level

**`GET /api/invoices/company/[slug]`**
- Accepts optional `financialYear` query param to filter by FY
- Defaults to current FY if not specified

**`GET /api/invoices/company/[slug]/financial-years`** (new)
- Returns distinct `financialYear` values for the company, ordered descending
- Used to populate the FY tab bar

### Duplicate Prevention

- Compound unique `(companyId, financialYear, no)` at DB level
- Client-side validation checks uniqueness within the same company+FY

## 3. Invoice List UI — Financial Year Tabs

### Tab Bar

- Horizontal scrollable row of tabs placed above the existing search/filter row
- Format: `FY 2024-25`, `FY 2025-26`, etc.
- Current FY is selected by default and visually emphasized
- Only FYs with invoices for the selected company are shown
- Tabs populated from `GET /api/invoices/company/[slug]/financial-years`
- Selecting a tab re-fetches the invoice list filtered by that FY
- Scrolls horizontally if many FYs accumulate

### Invoice Card Update

- Display formatted invoice number (`INV/25-26/00001`) instead of raw `No: 5`
- Uses `formatInvoiceNo(invoice.no, invoice.financialYear)`

### Search Behavior

- Search stays scoped to the selected FY tab
- Searching works with both raw sequence (`123`) and formatted string (`INV/25-26/00123`)

## 4. Invoice Creation Flow

### Finalize Invoice Page

- Invoice number displayed in formatted form: `INV/25-26/00001`
- Sequence number derived from the selected invoice **date** (not current date)
- When user changes invoice date across an FY boundary (e.g., March to April), the suggested invoice number updates automatically for the new FY
- User can manually override the sequence number; validation checks uniqueness within company+FY

### PDF Generation

- `generateHalfPdf.ts` and `generateCompleteInvoice.ts` updated to use `formatInvoiceNo()` instead of raw `no`
