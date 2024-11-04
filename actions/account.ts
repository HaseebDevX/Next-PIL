'use server';

import * as zod from 'zod';


import { AccountSchema } from '@/schemas';
import { db } from '@/lib/db';

export const accounts = async (values: zod.infer<typeof AccountSchema>) => {
  const validatedFields = AccountSchema.safeParse(values);
  console.log(validatedFields)

  if (!validatedFields.success) return { error: 'Invalid fields' };

  const { firstName, middleName, lastName, gender, dateOfBirth, isUnder18, fatherFirstName, fatherLastName, motherFirstName, motherLastName, mailingAddress1, mailingAddress2, mailingCity, mailingState, mailingZipCode, isPOBoxOrDifferentAddress, physicalAddress1, physicalAddress2, physicalCity, physicalState, physicalZipCode, phone1, phone2, email, consentForElectronicComm, maritalStatus, spouseFirstName, spouseLastName, spousePhone, employmentStatus, employerName, employerTitle, employmentType, pay, schoolName, expectedGraduationYear, userId  } = validatedFields.data;


  await db.profile.create({
    data: {
      firstName, middleName, lastName, gender, dateOfBirth, isUnder18, fatherFirstName, fatherLastName, motherFirstName, motherLastName, mailingAddress1, mailingAddress2, mailingCity, mailingState, mailingZipCode, isPOBoxOrDifferentAddress, physicalAddress1, physicalAddress2, physicalCity, physicalState, physicalZipCode, phone1, phone2, email, consentForElectronicComm, maritalStatus, spouseFirstName, spouseLastName, spousePhone, employmentStatus, employerName, employerTitle, employmentType, pay, schoolName, expectedGraduationYear, userId
    },
  });

  return { success: 'Profile Created Successfully' };
};
