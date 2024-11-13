-- CreateTable
CREATE TABLE "Uom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Uom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Uom" ADD CONSTRAINT "Uom_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
