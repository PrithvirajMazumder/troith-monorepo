/*
  Warnings:

  - Added the required column `userId` to the `Tax` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE invoice_no_seq;
ALTER TABLE "Invoice" ALTER COLUMN "no" SET DEFAULT nextval('invoice_no_seq');
ALTER SEQUENCE invoice_no_seq OWNED BY "Invoice"."no";

-- AlterTable
ALTER TABLE "Tax" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Tax" ADD CONSTRAINT "Tax_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
