/*
  Warnings:

  - Added the required column `deletedAt` to the `Bank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `Party` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `Tax` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `Uom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deletedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bank" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Party" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Tax" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Uom" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL;
