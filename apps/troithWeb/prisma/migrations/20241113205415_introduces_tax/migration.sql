-- CreateTable
CREATE TABLE "Tax" (
    "id" TEXT NOT NULL,
    "sgst" INTEGER NOT NULL,
    "cgst" INTEGER NOT NULL,

    CONSTRAINT "Tax_pkey" PRIMARY KEY ("id")
);
