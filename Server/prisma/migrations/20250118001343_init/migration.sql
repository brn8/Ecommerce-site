/*
  Warnings:

  - You are about to drop the column `orders` on the `Purchases` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Purchases` table. All the data in the column will be lost.
  - Added the required column `amountPaid` to the `Purchases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Purchases" DROP COLUMN "orders",
DROP COLUMN "totalPrice",
ADD COLUMN     "amountPaid" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "LineItems" (
    "id" SERIAL NOT NULL,
    "purchaseId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "productId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "productDesc" TEXT NOT NULL,
    "productImg" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "LineItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LineItems" ADD CONSTRAINT "LineItems_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineItems" ADD CONSTRAINT "LineItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
