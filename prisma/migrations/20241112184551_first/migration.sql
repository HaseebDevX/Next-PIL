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
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING_INFORMATION', 'UNDER_REVIEW', 'PENDING_DOCUMENTS', 'INVESTIGATION', 'PRE_SUIT', 'PRE_LITIGATION', 'LITIGATION', 'RESOLVED_AND_CLOSED');

-- CreateEnum
CREATE TYPE "Relationship" AS ENUM ('Self', 'Parent', 'Child', 'Sibiling', 'Friend', 'Representative', 'Other');

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

-- CreateEnum
CREATE TYPE "MedCare" AS ENUM ('Medicare', 'Medicaid', 'Unemployment', 'Social_Security_Benefits');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'NUMBER', 'DATE', 'YESNO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "middleName" TEXT,
    "lastname" TEXT NOT NULL,
    "gender" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "isUnder18" BOOLEAN NOT NULL DEFAULT false,
    "fatherFirstName" TEXT,
    "fatherLastName" TEXT,
    "motherFirstName" TEXT,
    "motherLastName" TEXT,
    "mailingAddress1" TEXT,
    "mailingAddress2" TEXT,
    "mailingCity" TEXT,
    "mailingState" TEXT,
    "mailingZipCode" TEXT,
    "isPOBoxOrDifferentAddress" BOOLEAN NOT NULL DEFAULT false,
    "physicalAddress1" TEXT,
    "physicalAddress2" TEXT,
    "physicalCity" TEXT,
    "physicalState" TEXT,
    "physicalZipCode" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phone2" TEXT,
    "fax" TEXT,
    "consentForElectronicComm" BOOLEAN NOT NULL DEFAULT true,
    "maritalStatus" TEXT,
    "spouseFirstName" TEXT,
    "spouseLastName" TEXT,
    "spousePhone" TEXT,
    "employmentStatus" TEXT,
    "employerName" TEXT,
    "employerTitle" TEXT,
    "employmentType" TEXT,
    "pay" TEXT,
    "schoolName" TEXT,
    "expectedGraduationYear" TEXT,
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
    "id" TEXT NOT NULL,
    "Claim Type" "ClaimType",
    "Status" "ClaimStatus" DEFAULT 'PENDING_INFORMATION',
    "Were you injured?" BOOLEAN,
    "Relationship" "Relationship",
    "Other Relationship" TEXT,
    "Do you have health insurance?" BOOLEAN,
    "Health Insurance Number" TEXT,
    "Do you currently receive?" "MedCare",
    "Assigned Claim Specialist" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "clientRoleId" TEXT NOT NULL,
    "injuredPartyRoleId" TEXT NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questionnaire" (
    "id" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,

    CONSTRAINT "Questionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionAnswer" (
    "id" TEXT NOT NULL,
    "Question ID" TEXT NOT NULL,
    "Answer" TEXT,
    "questionnaireId" TEXT,

    CONSTRAINT "QuestionAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "Claim Type" "ClaimType",
    "Question" TEXT NOT NULL,
    "Question type" "QuestionType" NOT NULL,
    "Choices" TEXT,
    "Active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Defendant" (
    "id" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,

    CONSTRAINT "Defendant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefendantDetails" (
    "id" TEXT NOT NULL,
    "Defendant Role" "DefendantRole",
    "Defendant Policy Number" TEXT,
    "Defendant Location" TEXT,
    "Vehicle Make" TEXT,
    "Vehicle Model" TEXT,
    "Vehicle Year" TEXT,
    "Vehicle Color" TEXT,
    "Vehicle Plate Number" TEXT,
    "Vehicle Registered State" TEXT,
    "defendantId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "DefendantDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthInsuranceProvider" (
    "id" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "HealthInsuranceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreatmentAndInjury" (
    "id" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,
    "injuryId" TEXT NOT NULL,

    CONSTRAINT "TreatmentAndInjury_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Injury" (
    "id" TEXT NOT NULL,
    "Injury Location" "InjuryPoint" NOT NULL,
    "Injury" "InjuryType" NOT NULL,
    "Injury Location Side" "InjurySide" NOT NULL,
    "treatmentId" TEXT NOT NULL,

    CONSTRAINT "Injury_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treatment" (
    "id" TEXT NOT NULL,
    "Doctor Name" TEXT,
    "Date of Admission" TIMESTAMP(3),
    "Date of Discharge" TIMESTAMP(3),
    "Next Scheduled Date" TIMESTAMP(3),
    "roleId" TEXT NOT NULL,

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "Date of Accident" TIMESTAMP(3) NOT NULL,
    "Time of Accident" TIMESTAMP(3) NOT NULL,
    "Accident Time of Day" TEXT,
    "Incident Location" TEXT,
    "Were you at work at the time of the accident?" BOOLEAN NOT NULL,
    "Description of Accident" TEXT,
    "Was a Police Report Filed" BOOLEAN NOT NULL,
    "Police Station/Precinct" TEXT,
    "Officer Name and Description" TEXT,
    "Was an Accident Report or Complaint Report Filed" BOOLEAN NOT NULL,
    "Accident/Complaint Report Number" TEXT,
    "Picture Taken?" BOOLEAN NOT NULL,
    "Upload (if yes)" TEXT,
    "Missed time from work or school?" BOOLEAN NOT NULL,
    "Approximate Loss of Earning" TEXT,
    "Approximate Missed Time from School? (If in school)" TEXT,
    "Do you currently have representation regarding this claim?" BOOLEAN NOT NULL,
    "roleId" TEXT NOT NULL,
    "Reason for wanting to remove your current representation from your claim?" TEXT,
    "claimId" TEXT NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Witness" (
    "id" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,

    CONSTRAINT "Witness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WitnessDetails" (
    "id" TEXT NOT NULL,
    "witnessId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "WitnessDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "roletypeId" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleType" (
    "id" TEXT NOT NULL,
    "roleType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "enable" BOOLEAN,

    CONSTRAINT "RoleType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "First Name" TEXT,
    "Last Name" TEXT,
    "Email Address" TEXT,
    "Phone" TEXT,
    "Secondary Phone" TEXT,
    "Fax Number" TEXT,
    "Mailing Address Street" TEXT,
    "Mailing Address Building" TEXT,
    "Mailing City" TEXT,
    "Mailing State" TEXT,
    "Mailing Zip Code" TEXT,
    "Billing Address Street" TEXT,
    "Billing Address Building" TEXT,
    "Billing Address City" TEXT,
    "Billing Address State" TEXT,
    "Billing Zip Code" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Claim_injuredPartyRoleId_key" ON "Claim"("injuredPartyRoleId");

-- CreateIndex
CREATE UNIQUE INDEX "Questionnaire_claimId_key" ON "Questionnaire"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "Defendant_claimId_key" ON "Defendant"("claimId");

-- CreateIndex
CREATE INDEX "Defendant_claimId_idx" ON "Defendant"("claimId");

-- CreateIndex
CREATE INDEX "DefendantDetails_defendantId_idx" ON "DefendantDetails"("defendantId");

-- CreateIndex
CREATE UNIQUE INDEX "HealthInsuranceProvider_claimId_key" ON "HealthInsuranceProvider"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "TreatmentAndInjury_claimId_key" ON "TreatmentAndInjury"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "TreatmentAndInjury_injuryId_key" ON "TreatmentAndInjury"("injuryId");

-- CreateIndex
CREATE UNIQUE INDEX "Incident_roleId_key" ON "Incident"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Incident_claimId_key" ON "Incident"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "Witness_claimId_key" ON "Witness"("claimId");

-- CreateIndex
CREATE INDEX "Witness_claimId_idx" ON "Witness"("claimId");

-- CreateIndex
CREATE INDEX "WitnessDetails_witnessId_idx" ON "WitnessDetails"("witnessId");

-- AddForeignKey
ALTER TABLE "TwoFactorConfirmation" ADD CONSTRAINT "TwoFactorConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_clientRoleId_fkey" FOREIGN KEY ("clientRoleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_injuredPartyRoleId_fkey" FOREIGN KEY ("injuredPartyRoleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questionnaire" ADD CONSTRAINT "Questionnaire_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_Question ID_fkey" FOREIGN KEY ("Question ID") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Defendant" ADD CONSTRAINT "Defendant_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefendantDetails" ADD CONSTRAINT "DefendantDetails_defendantId_fkey" FOREIGN KEY ("defendantId") REFERENCES "Defendant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefendantDetails" ADD CONSTRAINT "DefendantDetails_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthInsuranceProvider" ADD CONSTRAINT "HealthInsuranceProvider_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthInsuranceProvider" ADD CONSTRAINT "HealthInsuranceProvider_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentAndInjury" ADD CONSTRAINT "TreatmentAndInjury_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreatmentAndInjury" ADD CONSTRAINT "TreatmentAndInjury_injuryId_fkey" FOREIGN KEY ("injuryId") REFERENCES "Injury"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Injury" ADD CONSTRAINT "Injury_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Witness" ADD CONSTRAINT "Witness_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WitnessDetails" ADD CONSTRAINT "WitnessDetails_witnessId_fkey" FOREIGN KEY ("witnessId") REFERENCES "Witness"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WitnessDetails" ADD CONSTRAINT "WitnessDetails_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_roletypeId_fkey" FOREIGN KEY ("roletypeId") REFERENCES "RoleType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
