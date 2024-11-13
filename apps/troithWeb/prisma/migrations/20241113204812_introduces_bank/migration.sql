-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "accountNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "ifsc" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "holderName" TEXT NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bank" ADD CONSTRAINT "Bank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
