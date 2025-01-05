-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_paymentId_fkey";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "addressId" DROP NOT NULL,
ALTER COLUMN "paymentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
