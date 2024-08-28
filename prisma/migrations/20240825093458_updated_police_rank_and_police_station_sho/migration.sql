/*
  Warnings:

  - The values [SubInspector,DCP,IGP,ADGP] on the enum `Rank` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[SHOId]` on the table `PoliceStation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `district` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `policeOfficerUserId` to the `PoliceStation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Rank_new" AS ENUM ('Board', 'Constable', 'TrafficPolice', 'ASI', 'SI', 'Inspector', 'DSP', 'SP', 'DIG', 'IG', 'ADG', 'DGP');
ALTER TABLE "PoliceOfficer" ALTER COLUMN "rank" TYPE "Rank_new" USING ("rank"::text::"Rank_new");
ALTER TYPE "Rank" RENAME TO "Rank_old";
ALTER TYPE "Rank_new" RENAME TO "Rank";
DROP TYPE "Rank_old";
COMMIT;

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "district" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PoliceStation" ADD COLUMN     "SHOId" TEXT,
ADD COLUMN     "policeOfficerUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PoliceStation_SHOId_key" ON "PoliceStation"("SHOId");

-- AddForeignKey
ALTER TABLE "PoliceStation" ADD CONSTRAINT "PoliceStation_SHOId_fkey" FOREIGN KEY ("SHOId") REFERENCES "PoliceOfficer"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
