'use server';

import * as zod from 'zod';

import { UserProfileSchema } from '@/schemas';
import { db } from '@/lib/db';

export const profile = async (values: zod.infer<typeof UserProfileSchema>) => {
  const validatedFields = UserProfileSchema.safeParse(values);


  if (!validatedFields.success) return { error: 'Invalid fields' };

  const {
    firstname,
    middleName,
    lastname,
    gender,
    dateOfBirth,
    isUnder18,
    fatherFirstName,
    fatherLastName,
    motherFirstName,
    motherLastName,
    mailingAddress1,
    mailingAddress2,
    mailingCity,
    mailingState,
    mailingZipCode,
    isPOBoxOrDifferentAddress,
    physicalAddress1,
    physicalAddress2,
    physicalCity,
    physicalState,
    physicalZipCode,
    phone,
    phone2,
    email,
    consentForElectronicComm,
    maritalStatus,
    spouseFirstName,
    spouseLastName,
    spousePhone,
    employmentStatus,
    employerName,
    employerTitle,
    employmentType,
    pay,
    schoolName,
    expectedGraduationYear,
    id,
  } = validatedFields.data;

  await db.user.update({
    data: {
      firstname,
      middleName,
      lastname,
      gender,
      dateOfBirth,
      isUnder18,
      fatherFirstName,
      fatherLastName,
      motherFirstName,
      motherLastName,
      mailingAddress1,
      mailingAddress2,
      mailingCity,
      mailingState,
      mailingZipCode,
      isPOBoxOrDifferentAddress,
      physicalAddress1,
      physicalAddress2,
      physicalCity,
      physicalState,
      physicalZipCode,
      phone,
      phone2,
      email,
      consentForElectronicComm,
      maritalStatus,
      spouseFirstName,
      spouseLastName,
      spousePhone,
      employmentStatus,
      employerName,
      employerTitle,
      employmentType,
      pay,
      schoolName,
      expectedGraduationYear
    },
    where:{id}
  });

  return { success: 'Profile Created Successfully' };
};
