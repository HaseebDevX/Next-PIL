-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('Client', 'Injured_Party', 'Witness', 'Defendant', 'Hospital', 'Treating_Facility', 'Passenger', 'Auto_Insurance_Company', 'Health_Insurance_Company');

-- CreateEnum
CREATE TYPE "WereYouInjured" AS ENUM ('Yes', 'Someone', 'No');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('Single', 'Married', 'Divorced', 'Separated');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('Employed', 'Self_Employed', 'Student', 'Unemployed');

-- CreateEnum
CREATE TYPE "ClaimType" AS ENUM ('Car_Accident', 'Workers_Compensation', 'Construction_Accident', 'Workplace_Accident', 'Motorcycle_Accident', 'Pedestrian_Accident', 'Trucking_Accident', 'Bicycle_Accident', 'Bus_Accident', 'Train_Accident', 'Burn_Injury', 'MTA_Accident', 'Ride_Share_Accident', 'Salon_Accident', 'Amusement_Park_Accident', 'Dog_Bite', 'Slip_And_Fall', 'Premise_Liability', 'Negligence_Security', 'Nursing_Home', 'Medical_Malpractice', 'Aviation_Accident', 'Birth_Injury', 'Wrongful_Death');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING_INFORMATION', 'UNDER_REVIEW', 'ACCEPTED', 'INVESTIGATION', 'REJECTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "InjuryPoint" AS ENUM ('Shoulder', 'Elbow', 'Leg', 'Knee', 'Hip_Pelvic', 'Arm', 'Wrist', 'Thigh', 'Ankle', 'Finger', 'Toe', 'Hand', 'Foot', 'Other');

-- CreateEnum
CREATE TYPE "InjurySide" AS ENUM ('Left', 'Right', 'Both');

-- CreateEnum
CREATE TYPE "InjuryType" AS ENUM ('Laceration', 'Contusion_Bruises', 'Broken', 'Fracture', 'Tear', 'Sprain');

-- CreateEnum
CREATE TYPE "driverOrPassenger" AS ENUM ('Driver', 'Passenger');

-- CreateEnum
CREATE TYPE "DefendantRole" AS ENUM ('Operator', 'Owner', 'Operator_Owner', 'Other');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "fax" TEXT,
    "injured" "WereYouInjured" NOT NULL,
    "claimType" "ClaimType" NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT NOT NULL,
    "isTwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "ip" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "request_email_change_by" TEXT,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwoFactorToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TwoFactorToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TwoFactorConfirmation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TwoFactorConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "type" "ClaimType",
    "status" "ClaimStatus",
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "claimId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    "roleTypeId" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleType" (
    "id" SERIAL NOT NULL,
    "roleName" "AccountRole" NOT NULL,

    CONSTRAINT "RoleType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone1" TEXT NOT NULL,
    "phone2" TEXT,
    "email" TEXT,
    "fax" TEXT,
    "mailingAddress" TEXT,
    "billingAddress" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClaimToAccount" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_email_token_key" ON "VerificationToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_email_token_key" ON "PasswordResetToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorToken_token_key" ON "TwoFactorToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorToken_email_token_key" ON "TwoFactorToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorConfirmation_userId_key" ON "TwoFactorConfirmation"("userId");

-- CreateIndex
CREATE INDEX "Role_claimId_idx" ON "Role"("claimId");

-- CreateIndex
CREATE INDEX "Role_accountId_idx" ON "Role"("accountId");

-- CreateIndex
CREATE INDEX "Role_roleTypeId_idx" ON "Role"("roleTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "_ClaimToAccount_AB_unique" ON "_ClaimToAccount"("A", "B");

-- CreateIndex
CREATE INDEX "_ClaimToAccount_B_index" ON "_ClaimToAccount"("B");

-- AddForeignKey
ALTER TABLE "TwoFactorConfirmation" ADD CONSTRAINT "TwoFactorConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_roleTypeId_fkey" FOREIGN KEY ("roleTypeId") REFERENCES "RoleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClaimToAccount" ADD CONSTRAINT "_ClaimToAccount_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClaimToAccount" ADD CONSTRAINT "_ClaimToAccount_B_fkey" FOREIGN KEY ("B") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;
