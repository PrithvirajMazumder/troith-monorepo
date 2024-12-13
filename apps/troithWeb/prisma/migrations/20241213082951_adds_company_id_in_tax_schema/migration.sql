/*
  Warnings:

  - You are about to drop the column `userId` on the `Tax` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `Tax` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tax" DROP CONSTRAINT "Tax_userId_fkey";

-- AlterTable
ALTER TABLE "Tax" DROP COLUMN "userId",
ADD COLUMN     "companyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Tax" ADD CONSTRAINT "Tax_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
