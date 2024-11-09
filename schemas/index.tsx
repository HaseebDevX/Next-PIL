import { UserRole, ClaimType, WereYouInjured } from '@prisma/client';
import * as zod from 'zod';

export const LoginSchema = zod.object({
  email: zod.string().email({
    message: 'Email is required',
  }),
  password: zod.string().min(1, { message: 'Password is required' }),
  code: zod.optional(zod.string()),
});

export const RegisterSchema = zod.object({
  email: zod.string().email({
    message: 'Email is required',
  }),
  password: zod.string().min(6, { message: 'Password is required' }),
  firstname: zod.string().min(1, { message: 'Name is required' }),
  lastname: zod.string().min(1, { message: 'Last name is required' }),
  phone: zod.string().min(1, { message: 'Phone is required' }),
  claimType: zod.enum(
    [
      ClaimType.Car_Accident,
      ClaimType.Workers_Compensation,
      ClaimType.Construction_Accident,
      ClaimType.Workplace_Accident,
      ClaimType.Motorcycle_Accident,
      ClaimType.Pedestrian_Accident,
      ClaimType.Trucking_Accident,
      ClaimType.Bicycle_Accident,
      ClaimType.Bus_Accident,
      ClaimType.Train_Accident,
      ClaimType.Burn_Injury,
      ClaimType.MTA_Accident,
      ClaimType.Ride_Share_Accident,
      ClaimType.Salon_Accident,
      ClaimType.Amusement_Park_Accident,
      ClaimType.Dog_Bite,
      ClaimType.Slip_And_Fall,
      ClaimType.Premise_Liability,
      ClaimType.Negligence_Security,
      ClaimType.Nursing_Home,
      ClaimType.Medical_Malpractice,
      ClaimType.Aviation_Accident,
      ClaimType.Birth_Injury,
      ClaimType.Wrongful_Death,
    ],
    { message: 'Claim Type is required' }
  ),
  injured: zod.enum([WereYouInjured.Yes, WereYouInjured.No, WereYouInjured.Someone], {
    message: 'Injured is required',
  }),
});
// export const ClaimSchema = zod.object({
//   WereYouInjured: zod.enum([WereYouInjured.Yes, WereYouInjured.No], { message: 'Injured is required' }),
//   dateOfIncident: zod.date().nullable(),
//   incidentLocation: zod.string(),
//   claimType: zod.string(),
//   scropOfEmployment: zod.date().nullable(),
//   descOfAccident: zod.date().nullable(),
// });

export const ResetPasswordSchema = zod.object({
  email: zod.string().email({
    message: 'Email is required',
  }),
});

export const NewPasswordSchema = zod.object({
  password: zod.string().min(6, { message: 'Minimum of 6 characters required' }),
});

export const SettingsSchema = zod
  .object({
    name: zod.optional(zod.string().min(1)),
    isTwoFactorEnabled: zod.optional(zod.boolean()),
    role: zod.enum([UserRole.ADMIN, UserRole.USER]),
    email: zod.optional(zod.string().email()),
    password: zod.optional(zod.string().min(6)),
    newPassword: zod.optional(zod.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: 'New Password is required!',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: 'Password is required!',
      path: ['password'],
    }
  );

const dateOfBirthSchema = zod.string().refine(
  (arg) => {
    const date = new Date(arg);
    return date;
  },
  {
    message: 'Invalid date format',
  }
);

export const UserProfileSchema = zod.object({
  id: zod.string().optional(),
  firstname: zod.string().min(1, { message: 'First Name is required.' }),
  middleName: zod.string().optional(),
  lastname: zod.string().min(1, { message: 'Last Name is required.' }),
  gender: zod.string().min(1, { message: 'Select Gender' }),
  dateOfBirth: zod.date().nullable(),
  isUnder18: zod.boolean(),
  fatherFirstName: zod.string().optional(),
  fatherLastName: zod.string().optional(),
  motherFirstName: zod.string().optional(),
  motherLastName: zod.string().optional(),
  mailingAddress1: zod.string().min(3, { message: 'Mailing Address should be valid.' }),
  mailingAddress2: zod.string().optional(),
  mailingCity: zod.string().min(1, { message: 'Mailing City should be valid.' }),
  mailingState: zod.string().min(1, { message: 'Mailing State should be valid' }),
  mailingZipCode: zod.string().min(1, { message: 'Mailing Zip Code should be valid' }),
  isPOBoxOrDifferentAddress: zod.boolean(),
  physicalAddress1: zod.string().optional(),
  physicalAddress2: zod.string().optional(),
  physicalCity: zod.string().optional(),
  physicalState: zod.string().optional(),
  physicalZipCode: zod.string().optional(),
  phone: zod.string().min(1, { message: 'Enter Phone Number' }),
  phone2: zod.string().optional(),
  email: zod.string().email(),
  consentForElectronicComm: zod.boolean(),
  maritalStatus: zod.string().min(1, { message: 'Select Marital Status' }),
  spouseFirstName: zod.string().optional(),
  spouseLastName: zod.string().optional(),
  spousePhone: zod.string().optional(),
  employmentStatus: zod.string().min(1, { message: 'Select employment status' }),
  employerName: zod.string().optional(),
  employerTitle: zod.string().optional(),
  employmentType: zod.string().optional(),
  pay: zod.string().optional(),
  schoolName: zod.string().optional(),
  expectedGraduationYear: zod.string().optional(),
});

// export const ClaimSchema = zod.object({
//   id: zod.number().int().optional(),
//   name: zod.string().min(3, { message: 'Claim name is required' }),
//   claimType: zod.enum(
//     [
//       ClaimType.Car_Accident,
//       ClaimType.Workers_Compensation,
//       ClaimType.Construction_Accident,
//       ClaimType.Workplace_Accident,
//       ClaimType.Motorcycle_Accident,
//       ClaimType.Pedestrian_Accident,
//       ClaimType.Trucking_Accident,
//       ClaimType.Bicycle_Accident,
//       ClaimType.Bus_Accident,
//       ClaimType.Train_Accident,
//       ClaimType.Burn_Injury,
//       ClaimType.MTA_Accident,
//       ClaimType.Ride_Share_Accident,
//       ClaimType.Salon_Accident,
//       ClaimType.Amusement_Park_Accident,
//       ClaimType.Dog_Bite,
//       ClaimType.Slip_And_Fall,
//       ClaimType.Premise_Liability,
//       ClaimType.Negligence_Security,
//       ClaimType.Nursing_Home,
//       ClaimType.Medical_Malpractice,
//       ClaimType.Aviation_Accident,
//       ClaimType.Birth_Injury,
//       ClaimType.Wrongful_Death,
//     ],
//     { message: 'Claim Type is required' }
//   ),
//   claimStatus: zod
//     .enum([
//       ClaimStatus.PENDING_INFORMATION,
//       ClaimStatus.UNDER_REVIEW,
//       ClaimStatus.ACCEPTED,
//       ClaimStatus.INVESTIGATION,
//       ClaimStatus.REJECTED,
//       ClaimStatus.CLOSED,
//     ])
//     .optional()
//     .nullable(),
//   assignedClaimSpecialist: zod.string().optional().nullable(),
//   claimSpecialistPhone: zod.string().optional().nullable(),
//   claimSpecialistEmail: zod.string().email().optional().nullable(),
//   assignedClaimLink: zod.string().optional().nullable(),
//   userId: zod.string({
//     required_error: 'User cannot create account.',
//   }),
// });

// id                        String   @id @default(uuid())
// date                      DateTime @map("Date of Accident")
// time                      DateTime @map("Time of Accident")
// timeOfDay                 String   @map("Accident Time of Day") // "AM" or "PM"
// location                  String?  @map("Incident Location")
// workRelated               Boolean  @map("Were you at work at the time of the accident?") radio
// description               String?  @map("Description of Accident")
// policeReportCompleted     Boolean  @map("Was a Police Report Filed")
// policeStation             String?  @map("Police Station/Precinct")
// policeOfficer             String?  @map("Officer Name and Description")
// reportCompleted           Boolean  @map("Was an Accident Report or Complaint Report Filed")
// reportNumber              String?  @map("Accident/Complaint Report Number")
// supportingDocument        Boolean  @map("Picture Taken?")
// supportingDocumentUpload  String?  @map("Upload (if yes)")//TODO:ignored
// lostEarning               Boolean  @map("Missed time from work or school?")
// amountLoss                String?  @map("Approximate Loss of Earning")
// timeLoss                  String?  @map("Approximate Missed Time from School? (If in school)")
// priorRepresentation       Boolean  @map("Do you currently have representation regarding this claim?")
// namePriorRepresentation   String?  @map("Name of Attorney (If Yes)") // Reference to Role ID for "Plaintiff Law Firm"
// priorRepresentationReason String?  @map("Reason for wanting to remove your current representation from your claim?")
// Claim                     Claim    @relation(fields: [claimId], references: [id])
// claimId                   String   @unique

export const IncidentSchema = zod.object({
  injured: zod.boolean(),
  id: zod.string().optional(),
  date: zod.date({ required_error: 'Date of incident is required' }),
  time: zod.string(),
  timeOfDay: zod.string(),
  location: zod.string(),
  workRelated: zod.boolean({ message: 'Work realted required' }),
  description: zod.string(),
  policeReportCompleted: zod.boolean({ message: 'Police report required' }),
  policeStation: zod.string(),
  policeOfficer: zod.string(),
  reportCompleted: zod.boolean({ message: 'Report completed is required' }),
  reportNumber: zod.string(),
  supportingDocument: zod.boolean({ message: 'Supporting document required' }),
  supportingDocumentUpload: zod.string(),
  lostEarning: zod.boolean({ message: 'Lost earning is required' }),
  amountLoss: zod.string(),
  timeLoss: zod.string(),
  priorRepresentation: zod.boolean({ message: 'Prior representation is required' }),
  namePriorRepresentation: zod.string(),
  priorRepresentationReason: zod.string(),
  claimType: zod.enum(
    [
      ClaimType.Car_Accident,
      ClaimType.Workers_Compensation,
      ClaimType.Construction_Accident,
      ClaimType.Workplace_Accident,
      ClaimType.Motorcycle_Accident,
      ClaimType.Pedestrian_Accident,
      ClaimType.Trucking_Accident,
      ClaimType.Bicycle_Accident,
      ClaimType.Bus_Accident,
      ClaimType.Train_Accident,
      ClaimType.Burn_Injury,
      ClaimType.MTA_Accident,
      ClaimType.Ride_Share_Accident,
      ClaimType.Salon_Accident,
      ClaimType.Amusement_Park_Accident,
      ClaimType.Dog_Bite,
      ClaimType.Slip_And_Fall,
      ClaimType.Premise_Liability,
      ClaimType.Negligence_Security,
      ClaimType.Nursing_Home,
      ClaimType.Medical_Malpractice,
      ClaimType.Aviation_Accident,
      ClaimType.Birth_Injury,
      ClaimType.Wrongful_Death,
    ],
    { message: 'Claim Type is required' }
  ),
});
// export const IncidentSchema = zod
//   .object({
//     id: zod.number().int().optional(),
//     claimType: zod.string(),
//     injured: zod.boolean(),
//     nameOfInjuredParty: zod.string().nullable().optional(),
//     relationshipToInjuredParty: zod.string().nullable().optional(),

//     dateOfIncident: zod.date().nullable().optional(),
//     incidentLocation: zod
//       .string({
//         required_error: 'Incident Location is required',
//       })
//       .min(3, { message: 'Incident Location must be valid.' }),
//     inScopeOfEmployment: zod.date().nullable().optional(),
//     descriptionOfAccident: zod
//       .string({
//         message: 'Description of Accident* is required',
//       })
//       .min(10, { message: 'Description of Accident must be 10 characters' }),

//     policeReportFiled: zod.boolean({ message: 'Police report required' }),
//     precinct: zod.string().nullable().optional(),
//     officerNameAndDescription: zod.string().nullable().optional(),
//     accidentReportNumber: zod.string().nullable().optional(),

//     pictureTaken: zod.boolean({
//       message: 'Picture Taken?* is required',
//     }),
//     pictureUpload: zod.string().optional().nullable(),

//     missedTimeFromWorkOrSchool: zod.string({
//       message: 'Missed time from work or school? is required',
//     }),
//     approximateLossOfEarnings: zod.string().optional(),
//     approximateMissedTimeFromSchool: zod.string().optional(),

//     haveRepresentation: zod.boolean({
//       message: 'Do you currently have representation regarding this claim? is required',
//     }),
//     attorneyName: zod.string().optional(),
//     reasonForRemovingRepresentation: zod.string().optional(),

//     createdAt: zod.date().optional().nullable(),
//     updatedAt: zod.date().optional().nullable(),
//     claimId: zod.number({
//       message: 'Something wrong contact us at justoprint@gmail.com',
//     }),
//   })
//   .superRefine((data, ctx) => {
//     if (data.injured === false) {
//       if (!data.nameOfInjuredParty) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Name of Injured Party is required when the above is not checked',
//           path: ['nameOfInjuredParty'],
//         });
//       }
//       if (!data.relationshipToInjuredParty) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Relationship to Injured Party is required when the above is not checked',
//           path: ['relationshipToInjuredParty'],
//         });
//       }
//     }
//     if (data.policeReportFiled === true) {
//       if (!data.precinct) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Field must be valid when police report is selected',
//           path: ['precinct'],
//         });
//       }
//       if (!data.officerNameAndDescription) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Field must be valid when police report is selected',
//           path: ['officerNameAndDescription'],
//         });
//       }
//     }
//     if (data.policeReportFiled === false) {
//       if (!data.accidentReportNumber) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Field must be valid when police report is not selected',
//           path: ['accidentReportNumber'],
//         });
//       }
//     }
//     if (data.pictureTaken === true) {
//       if (!data.pictureUpload) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Please upload a picture',
//           path: ['pictureUpload'],
//         });
//       }
//     }
//     if (data.missedTimeFromWorkOrSchool === 'Work') {
//       if (!data.approximateLossOfEarnings) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Please add Approximate Loss of Earnings',
//           path: ['approximateLossOfEarnings'],
//         });
//       }
//     }
//     if (data.missedTimeFromWorkOrSchool === 'School') {
//       if (!data.approximateMissedTimeFromSchool) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Please add Approximate Missed Time from School',
//           path: ['approximateMissedTimeFromSchool'],
//         });
//       }
//     }
//   });

// export const WitnessSchema = zod
//   .object({
//     id: zod.number().int().nullable().optional(),
//     isWitness: zod.boolean(),
//     witnessName: zod.string().nullable().optional(),
//     witnessPhone: zod.string().nullable().optional(),
//     createdAt: zod.date().optional(),
//     updatedAt: zod.date().optional(),
//     claimId: zod.number().int(),
//   })
//   .superRefine((data, ctx) => {
//     if (data.isWitness === true) {
//       if (!data.witnessName) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Name of witness is require',
//           path: ['witnessName'],
//         });
//       }
//       if (!data.witnessPhone) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Witness phone is require',
//           path: ['witnessPhone'],
//         });
//       }
//     }
//   });

// export const InjurySchema = zod.object({
//   id: zod.number().int().optional(),
//   injuryPoint: zod.enum(
//     [
//       InjuryPoint.Shoulder,
//       InjuryPoint.Elbow,
//       InjuryPoint.Leg,
//       InjuryPoint.Knee,
//       InjuryPoint.Hip_Pelvic,
//       InjuryPoint.Arm,
//       InjuryPoint.Wrist,
//       InjuryPoint.Thigh,
//       InjuryPoint.Ankle,
//       InjuryPoint.Finger,
//       InjuryPoint.Toe,
//       InjuryPoint.Hand,
//       InjuryPoint.Foot,
//       InjuryPoint.Other,
//     ],
//     { message: 'Injury point is require' }
//   ),
//   injurySide: zod.enum(['Left', 'Right', 'Both'], { message: 'Injury side is require' }),
//   injuryType: zod.enum(['Laceration', 'Contusion_Bruises', 'Broken', 'Fracture', 'Tear', 'Sprain'], {
//     message: 'Injury type is require',
//   }),
//   createdAt: zod.date().optional(),
//   updatedAt: zod.date().optional(),
//   claimId: zod.number().int(),
// });

// export const TreatmentSchema = zod
//   .object({
//     id: zod.number().int().optional(),
//     takenToHospital: zod.boolean(),
//     hospitalName: zod.string().optional().nullable(),
//     dateOfAdmission: zod.date().optional().nullable(),
//     dateOfDischarge: zod.date().optional().nullable(),
//     currentlyBeingTreated: zod.boolean(),
//     doctorName: zod.string().optional().nullable(),
//     doctorAddress: zod.string().optional().nullable(),
//     lastVisitDate: zod.date().optional().nullable(),
//     hasHealthInsurance: zod.boolean(),
//     healthInsuranceProvider: zod.string().optional().nullable(),
//     policyNumber: zod.string().optional().nullable(),
//     receivesBenefits: zod.boolean(),
//     createdAt: zod.date().optional(),
//     updatedAt: zod.date().optional(),
//     claimId: zod.number().int(),
//   })
//   .superRefine((data, ctx) => {
//     if (data.takenToHospital === true) {
//       if (!data.hospitalName) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Hospital name is require',
//           path: ['hospitalName'],
//         });
//       }
//       if (!data.dateOfAdmission) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Date of Admission is require',
//           path: ['dateOfAdmission'],
//         });
//       }
//       if (!data.dateOfDischarge) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Date of discharge is require',
//           path: ['dateOfDischarge'],
//         });
//       }
//     }
//     if (data.currentlyBeingTreated === true) {
//       if (!data.doctorName) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Doctor name is require',
//           path: ['doctorName'],
//         });
//       }
//       if (!data.doctorAddress) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Doctor Address is require',
//           path: ['doctorAddress'],
//         });
//       }
//       if (!data.lastVisitDate) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Last visit date is require',
//           path: ['lastVisitDate'],
//         });
//       }
//     }
//     if (data.hasHealthInsurance === true) {
//       if (!data.healthInsuranceProvider) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: ' Health Insurance provider is require',
//           path: ['healthInsuranceProvider'],
//         });
//       }
//       if (!data.policyNumber) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Doctor Address is require',
//           path: ['policyNumber'],
//         });
//       }
//     }
//   });

// export const QuestionnaireSchema = zod
//   .object({
//     id: zod.number().int().optional(),
//     driverOrPassenger: zod.enum(['Driver', 'Passenger'], { message: 'Select Driver or Passenger is required' }),
//     driverFirstName: zod.string().optional().nullable(),
//     driverLastName: zod.string().optional().nullable(),
//     driverOwnsVehicle: zod.boolean(),
//     vehicleOwnerFirstName: zod.string().optional().nullable(),
//     vehicleOwnerLastName: zod.string().optional().nullable(),
//     relationshipToDriver: zod.string().optional().nullable(),
//     vehicleYear: zod.string().min(3, { message: 'Vehicle Year is require like this 2024' }),
//     vehicleMake: zod.string().min(3, { message: 'Vehicle make is require' }),
//     vehicleModel: zod.string().min(3, { message: 'Vehicle Year is require' }),
//     vehicleInsuranceCarrier: zod.string().min(3, { message: 'Vehicle insurance carrier is require' }),
//     vehicleInsurancePolicyNumber: zod.string().min(3, { message: 'Vehicle insurance policy number is require' }),
//     claimAlreadyFiled: zod.boolean(),
//     claimNumber: zod.string().optional().nullable(),
//     claimRepresentativeName: zod.string().optional().nullable(),
//     claimRepresentativeNumber: zod.string().optional().nullable(),
//     noFaultApplicationFiled: zod.boolean(),
//     inRideShareVehicle: zod.boolean(),
//     otherRideShareInvolved: zod.boolean(),
//     numberOfPassengers: zod.string().min(3, { message: 'Number of passengers' }).optional().nullable(),
//     passengerNamesAndPhones: zod
//       .string()
//       .min(3, { message: 'Passenger name and phone is require' })
//       .optional()
//       .nullable(),
//     otherVehiclesInvolved: zod.string().min(1, { message: 'Reqiure other vehicles involve' }).optional().nullable(),
//     createdAt: zod.date().optional(),
//     updatedAt: zod.date().optional(),
//     claimId: zod.number().int(),
//   })
//   .superRefine((data, ctx) => {
//     if (data.driverOrPassenger === 'Passenger') {
//       if (!data.driverFirstName) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Enter driver first name',
//           path: ['driverFirstName'],
//         });
//       }
//       if (!data.driverLastName) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Enter driver last name',
//           path: ['driverLastName'],
//         });
//       }
//       if (!data.relationshipToDriver) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Enter relationship to driver',
//           path: ['relationshipToDriver'],
//         });
//       }
//     }

//     if (data.driverOwnsVehicle === false) {
//       if (!data.vehicleOwnerFirstName) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Enter vehicle owner first name',
//           path: ['vehicleOwnerFirstName'],
//         });
//       }
//       if (!data.vehicleOwnerLastName) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Enter vehicle owner last name',
//           path: ['vehicleOwnerLastName'],
//         });
//       }
//     }

//     if (data.claimAlreadyFiled === true) {
//       if (!data.claimNumber) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Enter claim number',
//           path: ['claimNumber'],
//         });
//       }
//       if (!data.claimRepresentativeName) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Enter claim representative name',
//           path: ['claimRepresentativeName'],
//         });
//       }
//       if (!data.claimRepresentativeNumber) {
//         ctx.addIssue({
//           code: zod.ZodIssueCode.custom,
//           message: 'Enter claim representative Phone Number',
//           path: ['claimRepresentativeNumber'],
//         });
//       }
//     }
//   });

// export const DefendantSchema = zod.object({
//   id: zod.number().int().optional(),
//   name: zod.string().min(3, { message: 'Name is required' }),
//   phone: zod.string().min(3, { message: 'Phone is required' }),
//   address: zod.string().min(3, { message: 'Address is required' }),
//   role: zod.enum(['Operator', 'Owner', 'Operator_Owner', 'Other'], { message: 'Role is required' }),
//   insuranceCarrier: zod.string().min(3, { message: 'Insurance Carrier is required' }),
//   policyHolder: zod.string().min(3, { message: 'Policy Holder is required' }),
//   policyNumber: zod.string().min(3, { message: 'Policy Number is required' }),
//   vehicleMake: zod.string().optional().nullable(),
//   vehicleModel: zod.string().optional().nullable(),
//   vehicleYear: zod.string().optional().nullable(),
//   vehicleColor: zod.string().optional().nullable(),
//   vehiclePlateNumber: zod.string().optional().nullable(),
//   vehicleRegisteredState: zod.string().optional().nullable(),
//   createdAt: zod.date().optional(),
//   updatedAt: zod.date().optional(),
//   claimId: zod.number().int(),
// });

// //DB schema

// export const ClaimDatabaseSchema = zod.object({
//   id: zod.number().int().optional(),
//   name: zod.string().nullable().optional(),
//   claimType: zod
//     .enum(
//       [
//         ClaimType.Car_Accident,
//         ClaimType.Workers_Compensation,
//         ClaimType.Construction_Accident,
//         ClaimType.Workplace_Accident,
//         ClaimType.Motorcycle_Accident,
//         ClaimType.Pedestrian_Accident,
//         ClaimType.Trucking_Accident,
//         ClaimType.Bicycle_Accident,
//         ClaimType.Bus_Accident,
//         ClaimType.Train_Accident,
//         ClaimType.Burn_Injury,
//         ClaimType.MTA_Accident,
//         ClaimType.Ride_Share_Accident,
//         ClaimType.Salon_Accident,
//         ClaimType.Amusement_Park_Accident,
//         ClaimType.Dog_Bite,
//         ClaimType.Slip_And_Fall,
//         ClaimType.Premise_Liability,
//         ClaimType.Negligence_Security,
//         ClaimType.Nursing_Home,
//         ClaimType.Medical_Malpractice,
//         ClaimType.Aviation_Accident,
//         ClaimType.Birth_Injury,
//         ClaimType.Wrongful_Death,
//       ],
//       { message: 'Claim Type is required' }
//     )
//     .nullable()
//     .optional(),
//   claimStatus: zod
//     .enum([
//       ClaimStatus.PENDING_INFORMATION,
//       ClaimStatus.UNDER_REVIEW,
//       ClaimStatus.ACCEPTED,
//       ClaimStatus.INVESTIGATION,
//       ClaimStatus.REJECTED,
//       ClaimStatus.CLOSED,
//     ])
//     .optional()
//     .nullable(),
//   assignedClaimSpecialist: zod.string().optional().nullable(),
//   claimSpecialistPhone: zod.string().optional().nullable(),
//   claimSpecialistEmail: zod.string().email().optional().nullable(),
//   assignedClaimLink: zod.string().optional().nullable(),
//   userId: zod.string({
//     required_error: 'User ID is required',
//   }),
//   Incidents: zod.array(IncidentSchema),
//   Witnesses: zod.array(WitnessSchema),
//   Injuries: zod.array(InjurySchema),
//   Treatments: zod.array(TreatmentSchema),
//   Questionnaires: zod.array(QuestionnaireSchema),
//   Defendants: zod.array(DefendantSchema),
// });
