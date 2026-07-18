-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InvoiceStatus" ADD VALUE 'PARTIALLY_PAID';
ALTER TYPE "InvoiceStatus" ADD VALUE 'GST_SUBMITTED';

-- AlterTable
ALTER TABLE "Bank" ALTER COLUMN "accountNumber" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "tagLine" TEXT;

-- AlterTable
ALTER TABLE "Uom" ALTER COLUMN "userId" DROP NOT NULL;
