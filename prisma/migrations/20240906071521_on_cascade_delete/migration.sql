/*
  Warnings:

  - The values [InProgress] on the enum `CaseStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `_AddressToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CaseStatus_new" AS ENUM ('Pending', 'Open', 'Closed');
ALTER TABLE "CaseAssignment" ALTER COLUMN "caseStatus" DROP DEFAULT;
ALTER TABLE "CaseAssignment" ALTER COLUMN "caseStatus" TYPE "CaseStatus_new" USING ("caseStatus"::text::"CaseStatus_new");
ALTER TYPE "CaseStatus" RENAME TO "CaseStatus_old";
ALTER TYPE "CaseStatus_new" RENAME TO "CaseStatus";
DROP TYPE "CaseStatus_old";
ALTER TABLE "CaseAssignment" ALTER COLUMN "caseStatus" SET DEFAULT 'Pending';
COMMIT;

-- DropForeignKey
ALTER TABLE "Administrator" DROP CONSTRAINT "Administrator_userId_fkey";

-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_userId_fkey";

-- DropForeignKey
ALTER TABLE "Citizen" DROP CONSTRAINT "Citizen_userId_fkey";

-- DropForeignKey
ALTER TABLE "Detective" DROP CONSTRAINT "Detective_userId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_stationId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_userId_fkey";

-- DropForeignKey
ALTER TABLE "PoliceOfficer" DROP CONSTRAINT "PoliceOfficer_userId_fkey";

-- DropForeignKey
ALTER TABLE "TransferHistory" DROP CONSTRAINT "TransferHistory_officerId_fkey";

-- DropForeignKey
ALTER TABLE "UserDocuments" DROP CONSTRAINT "UserDocuments_userId_fkey";

-- DropForeignKey
ALTER TABLE "_AddressToUser" DROP CONSTRAINT "_AddressToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_AddressToUser" DROP CONSTRAINT "_AddressToUser_B_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "state" SET DEFAULT '',
ALTER COLUMN "city" SET DEFAULT '',
ALTER COLUMN "postalCode" SET DEFAULT '',
ALTER COLUMN "district" SET DEFAULT '';

-- DropTable
DROP TABLE "_AddressToUser";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "PoliceStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDocuments" ADD CONSTRAINT "UserDocuments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citizen" ADD CONSTRAINT "Citizen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoliceOfficer" ADD CONSTRAINT "PoliceOfficer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detective" ADD CONSTRAINT "Detective_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrator" ADD CONSTRAINT "Administrator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferHistory" ADD CONSTRAINT "TransferHistory_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "PoliceOfficer"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
