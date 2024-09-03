/*
  Warnings:

  - The values [Board] on the enum `Rank` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Rank_new" AS ENUM ('Constable', 'TrafficPolice', 'ASI', 'SI', 'Inspector', 'DSP', 'SP', 'DIG', 'IG', 'ADG', 'DGP');
ALTER TABLE "PoliceOfficer" ALTER COLUMN "rank" TYPE "Rank_new" USING ("rank"::text::"Rank_new");
ALTER TYPE "Rank" RENAME TO "Rank_old";
ALTER TYPE "Rank_new" RENAME TO "Rank";
DROP TYPE "Rank_old";
COMMIT;

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'Board';

-- CreateTable
CREATE TABLE "Board" (
    "userId" TEXT NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Board_userId_key" ON "Board"("userId");

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
