/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('CurrentAddress', 'PermanentAddress');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('Traffic', 'Crime', 'CyberCrime', 'Narcotics', 'WemenSafety', 'SpecialInvestigation');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Citizen', 'PoliceOfficer', 'Detective', 'Administrator');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "email" TEXT,
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" INTEGER NOT NULL,
ADD COLUMN     "profilePhoto" TEXT,
ADD COLUMN     "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Citizen';

-- CreateTable
CREATE TABLE "UserDocuments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "voterIdNumber" TEXT,
    "voterIdPhoto" TEXT,
    "aadharCardNumber" TEXT,
    "aadharCardPhoto" TEXT,
    "panCardNumber" TEXT,
    "panCardPhoto" TEXT,
    "passportNumber" TEXT,
    "passportPhoto" TEXT,
    "drivingLicenceNumber" TEXT,
    "drivingLicencePhoto" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AddressType" NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "street" TEXT,
    "houseNumber" TEXT,
    "landmark" TEXT,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Citizen" (
    "userId" TEXT NOT NULL,
    "notificationPreferences" TEXT,

    CONSTRAINT "Citizen_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "PoliceOfficer" (
    "userId" TEXT NOT NULL,
    "badgeNumber" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "assignedStationId" TEXT,
    "department" "Department" NOT NULL,
    "assignedCaseId" TEXT,
    "accessLevel" TEXT NOT NULL,

    CONSTRAINT "PoliceOfficer_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Detective" (
    "userId" TEXT NOT NULL,
    "investigationArea" TEXT,
    "specialization" TEXT NOT NULL,

    CONSTRAINT "Detective_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Administrator" (
    "userId" TEXT NOT NULL,

    CONSTRAINT "Administrator_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "PoliceStation" (
    "id" TEXT NOT NULL,
    "stationName" TEXT NOT NULL,
    "locationId" TEXT,
    "departments" TEXT[],

    CONSTRAINT "PoliceStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicenseApplication" (
    "id" TEXT NOT NULL,
    "citizenId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "LicenseApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "citizenId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "filedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionTakenAt" TIMESTAMP(3),

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseAssignment" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "detectiveId" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferHistory" (
    "id" TEXT NOT NULL,
    "officerId" TEXT NOT NULL,
    "fromStationId" TEXT NOT NULL,
    "toStationId" TEXT NOT NULL,
    "transferredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransferHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseHistory" (
    "id" TEXT NOT NULL,
    "detectiveId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDocuments_userId_key" ON "UserDocuments"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Citizen_userId_key" ON "Citizen"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PoliceOfficer_userId_key" ON "PoliceOfficer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PoliceOfficer_badgeNumber_key" ON "PoliceOfficer"("badgeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Detective_userId_key" ON "Detective"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Administrator_userId_key" ON "Administrator"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PoliceStation_locationId_key" ON "PoliceStation"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "UserDocuments" ADD CONSTRAINT "UserDocuments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citizen" ADD CONSTRAINT "Citizen_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoliceOfficer" ADD CONSTRAINT "PoliceOfficer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoliceOfficer" ADD CONSTRAINT "PoliceOfficer_assignedStationId_fkey" FOREIGN KEY ("assignedStationId") REFERENCES "PoliceStation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoliceOfficer" ADD CONSTRAINT "PoliceOfficer_assignedCaseId_fkey" FOREIGN KEY ("assignedCaseId") REFERENCES "CaseAssignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detective" ADD CONSTRAINT "Detective_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrator" ADD CONSTRAINT "Administrator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoliceStation" ADD CONSTRAINT "PoliceStation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicenseApplication" ADD CONSTRAINT "LicenseApplication_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "Citizen"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "Citizen"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAssignment" ADD CONSTRAINT "CaseAssignment_detectiveId_fkey" FOREIGN KEY ("detectiveId") REFERENCES "Detective"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferHistory" ADD CONSTRAINT "TransferHistory_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "PoliceOfficer"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseHistory" ADD CONSTRAINT "CaseHistory_detectiveId_fkey" FOREIGN KEY ("detectiveId") REFERENCES "Detective"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
