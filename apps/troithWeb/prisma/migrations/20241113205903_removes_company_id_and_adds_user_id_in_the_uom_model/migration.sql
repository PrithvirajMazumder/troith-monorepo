/*
  Warnings:

  - You are about to drop the column `companyId` on the `Uom` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Uom` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Uom" DROP CONSTRAINT "Uom_companyId_fkey";

-- AlterTable
ALTER TABLE "Uom" DROP COLUMN "companyId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Uom" ADD CONSTRAINT "Uom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
