/*
  Warnings:

  - You are about to drop the column `quanitity` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "quanitity",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
