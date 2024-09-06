/*
  Warnings:

  - You are about to drop the column `cloudId` on the `Image` table. All the data in the column will be lost.
  - Added the required column `type` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BoardType" AS ENUM ('State', 'Central');

-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "type" "BoardType" NOT NULL;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "cloudId",
ADD COLUMN     "public_id" TEXT NOT NULL,
ALTER COLUMN "url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PoliceOfficer" ADD COLUMN     "recruiterId" TEXT;

-- AddForeignKey
ALTER TABLE "PoliceOfficer" ADD CONSTRAINT "PoliceOfficer_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Board"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
