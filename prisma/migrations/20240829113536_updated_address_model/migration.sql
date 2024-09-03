/*
  Warnings:

  - You are about to drop the column `houseNumber` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Address` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Zone" AS ENUM ('North', 'South', 'East', 'West', 'Central');

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_userId_fkey";

-- DropIndex
DROP INDEX "Address_userId_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "houseNumber",
DROP COLUMN "userId",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "zone" "Zone",
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "type" DROP DEFAULT,
ALTER COLUMN "country" SET DEFAULT 'India';

-- AlterTable
ALTER TABLE "PoliceStation" ADD COLUMN     "stationMail" TEXT,
ADD COLUMN     "stationPhone" TEXT;

-- CreateTable
CREATE TABLE "_AddressToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AddressToUser_AB_unique" ON "_AddressToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AddressToUser_B_index" ON "_AddressToUser"("B");

-- AddForeignKey
ALTER TABLE "_AddressToUser" ADD CONSTRAINT "_AddressToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddressToUser" ADD CONSTRAINT "_AddressToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
