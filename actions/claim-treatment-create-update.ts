'use server';
import * as zod from 'zod';

import { db } from '@/lib/db';
import { TreatmentSchema } from '@/schemas';

export const createOrUpdateTreatment = async (values: zod.infer<typeof TreatmentSchema>) => {
  const validatedFields = TreatmentSchema.safeParse(values);
  if (!validatedFields.success) return { error: 'Invalid fields' };

  const {
    id,
    takenToHospital,
    hospitalName,
    dateOfAdmission,
    dateOfDischarge,
    currentlyBeingTreated,
    doctorName,
    doctorAddress,
    lastVisitDate,
    hasHealthInsurance,
    healthInsuranceProvider,
    policyNumber,
    receivesBenefits,
    claimId,
  } = validatedFields.data;
  if (id) {
    const claimDataUpdated = await db.treatment.update({
      where: { id: id },
      data: {
        takenToHospital,
        hospitalName,
        dateOfAdmission,
        dateOfDischarge,
        currentlyBeingTreated,
        doctorName,
        doctorAddress,
        lastVisitDate,
        hasHealthInsurance,
        healthInsuranceProvider,
        policyNumber,
        receivesBenefits,
        claimId,
      },
    });
    return { success: 'Witness has been updated' };
  } else {
    const claimDataCreated = await db.treatment.create({
      data: {
        takenToHospital,
        hospitalName,
        dateOfAdmission,
        dateOfDischarge,
        currentlyBeingTreated,
        doctorName,
        doctorAddress,
        lastVisitDate,
        hasHealthInsurance,
        healthInsuranceProvider,
        policyNumber,
        receivesBenefits,
        claimId,
      },
    });
    return { success: claimDataCreated };
  }

  return { error: 'Something wrong' };
};

export const deleteTreatment = async (treatmentId: number) => {
  try {
    await db.treatment.delete({
      where: { id: treatmentId },
    });
    return { success: 'Treatment has been deleted' };
  } catch (error) {
    return { error: 'Failed to delete the treatment' };
  }
};
