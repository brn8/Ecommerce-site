/*
  Warnings:

  - You are about to drop the column `addressId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_paymentId_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "addressId",
DROP COLUMN "lastName",
DROP COLUMN "password",
DROP COLUMN "paymentId",
DROP COLUMN "username";
