-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PROCESSING', 'SHIPPED', 'DELIVERED');

-- CreateTable
CREATE TABLE "Purchases" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "orders" INTEGER[],
    "address" TEXT NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PROCESSING',

    CONSTRAINT "Purchases_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
