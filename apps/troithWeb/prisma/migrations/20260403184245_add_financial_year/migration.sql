-- DropIndex
DROP INDEX "Invoice_no_key";

-- Step 1: Add financialYear as nullable
ALTER TABLE "Invoice" ADD COLUMN "financialYear" TEXT;

-- Step 2: Populate financialYear from date
-- April (month 4) onwards = current year to next year, Jan-Mar = previous year to current year
UPDATE "Invoice"
SET "financialYear" = CASE
  WHEN EXTRACT(MONTH FROM "date") >= 4 THEN
    LPAD(CAST(EXTRACT(YEAR FROM "date") % 100 AS TEXT), 2, '0') || '-' || LPAD(CAST((EXTRACT(YEAR FROM "date") + 1) % 100 AS TEXT), 2, '0')
  ELSE
    LPAD(CAST((EXTRACT(YEAR FROM "date") - 1) % 100 AS TEXT), 2, '0') || '-' || LPAD(CAST(EXTRACT(YEAR FROM "date") % 100 AS TEXT), 2, '0')
END;

-- Step 3: Make it non-nullable
ALTER TABLE "Invoice" ALTER COLUMN "financialYear" SET NOT NULL;

-- Step 4: Drop autoincrement default and sequence
ALTER TABLE "Invoice" ALTER COLUMN "no" DROP DEFAULT;
DROP SEQUENCE IF EXISTS "invoice_no_seq";
DROP SEQUENCE IF EXISTS "Invoice_no_seq";

-- Step 5: Add compound unique
CREATE UNIQUE INDEX "Invoice_companyId_financialYear_no_key" ON "Invoice"("companyId", "financialYear", "no");
