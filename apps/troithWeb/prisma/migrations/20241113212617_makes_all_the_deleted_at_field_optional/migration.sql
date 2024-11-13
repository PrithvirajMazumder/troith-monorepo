-- AlterTable
ALTER TABLE "Bank" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Party" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tax" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "deletedAt" DROP NOT NULL;
