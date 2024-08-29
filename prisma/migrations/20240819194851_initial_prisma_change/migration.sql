-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('CurrentAddress', 'PermanentAddress');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('Constable', 'TrafficPolice', 'SubInspector', 'Inspector', 'DSP', 'SP', 'DCP', 'IGP', 'ADGP', 'DGP');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('Traffic', 'Crime', 'CyberCrime', 'Narcotics', 'WemenSafety', 'SpecialInvestigation');

-- CreateEnum
CREATE TYPE "DetectiveSpecialization" AS ENUM ('CyberCrime', 'Narcotics', 'WemenSafety', 'SpecialInvestigation');

-- CreateEnum
CREATE TYPE "CaseType" AS ENUM ('Criminal', 'Civil', 'Traffic', 'CyberCrime', 'Narcotics', 'WemenSafety', 'SpecialInvestigation');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('Pending', 'Open', 'InProgress', 'Closed');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Citizen', 'PoliceOfficer', 'Detective', 'Administrator');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "phoneNumber" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3),
    "gender" "Gender" NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Citizen',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
    "type" "AddressType" NOT NULL DEFAULT 'CurrentAddress',
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "street" TEXT,
    "landmark" TEXT,
    "houseNumber" TEXT,

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
    "assignedCaseId" TEXT,
    "assignedStationId" TEXT,
    "rank" "Rank",
    "department" "Department"[],

    CONSTRAINT "PoliceOfficer_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Detective" (
    "userId" TEXT NOT NULL,
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
    "caseType" "CaseType" NOT NULL,
    "caseStatus" "CaseStatus" NOT NULL DEFAULT 'Pending',
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
    "policeOfficerId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AddressToDetective" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

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
CREATE UNIQUE INDEX "_AddressToDetective_AB_unique" ON "_AddressToDetective"("A", "B");

-- CreateIndex
CREATE INDEX "_AddressToDetective_B_index" ON "_AddressToDetective"("B");

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
ALTER TABLE "TransferHistory" ADD CONSTRAINT "TransferHistory_toStationId_fkey" FOREIGN KEY ("toStationId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferHistory" ADD CONSTRAINT "TransferHistory_fromStationId_fkey" FOREIGN KEY ("fromStationId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseHistory" ADD CONSTRAINT "CaseHistory_policeOfficerId_fkey" FOREIGN KEY ("policeOfficerId") REFERENCES "PoliceOfficer"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseHistory" ADD CONSTRAINT "CaseHistory_detectiveId_fkey" FOREIGN KEY ("detectiveId") REFERENCES "Detective"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseHistory" ADD CONSTRAINT "CaseHistory_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "CaseAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddressToDetective" ADD CONSTRAINT "_AddressToDetective_A_fkey" FOREIGN KEY ("A") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddressToDetective" ADD CONSTRAINT "_AddressToDetective_B_fkey" FOREIGN KEY ("B") REFERENCES "Detective"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
