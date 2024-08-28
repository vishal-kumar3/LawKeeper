/*
  Warnings:

  - You are about to drop the column `policeOfficerUserId` on the `PoliceStation` table. All the data in the column will be lost.
  - You are about to drop the column `profilePhoto` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PoliceStation" DROP COLUMN "policeOfficerUserId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "profilePhoto";

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "stationId" TEXT,
    "url" TEXT NOT NULL,
    "cloudId" TEXT NOT NULL,
    "alt" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_userId_key" ON "Image"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_stationId_key" ON "Image"("stationId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "PoliceStation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
