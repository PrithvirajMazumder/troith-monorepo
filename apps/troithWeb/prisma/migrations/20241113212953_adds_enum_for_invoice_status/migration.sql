/*
  Warnings:

  - Changed the type of `status` on the `Invoice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'PAID');

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "status",
ADD COLUMN     "status" "InvoiceStatus" NOT NULL;
