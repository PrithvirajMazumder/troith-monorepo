/*
  Warnings:

  - You are about to alter the column `no` on the `Invoice` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "no" SET DATA TYPE INTEGER;
