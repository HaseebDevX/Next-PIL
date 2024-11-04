'use server';
import * as zod from 'zod';

import { db } from '@/lib/db';
import { IncidentSchema } from '@/schemas';

export const createOrUpdateIncident = async (values: zod.infer<typeof IncidentSchema>) => {
  const validatedFields = IncidentSchema.safeParse(values);

  if (!validatedFields.success) return { error: 'Invalid fields' };

  const {
    id,
    injured,
    nameOfInjuredParty,
    relationshipToInjuredParty,
    dateOfIncident,
    incidentLocation,
    inScopeOfEmployment,
    descriptionOfAccident,
    policeReportFiled,
    precinct,
    officerNameAndDescription,
    accidentReportNumber,
    pictureTaken,
    pictureUpload,
    missedTimeFromWorkOrSchool,
    approximateLossOfEarnings,
    approximateMissedTimeFromSchool,
    haveRepresentation,
    attorneyName,
    reasonForRemovingRepresentation,
    claimId,
  } = validatedFields.data;

  if (id) {
    const claimDataUpdated = await db.incident.update({
      where: { id: id },
      data: {
        injured,
        nameOfInjuredParty,
        relationshipToInjuredParty,
        dateOfIncident,
        incidentLocation,
        inScopeOfEmployment,
        descriptionOfAccident,
        policeReportFiled,
        precinct,
        officerNameAndDescription,
        accidentReportNumber,
        pictureTaken,
        pictureUpload,
        missedTimeFromWorkOrSchool,
        approximateLossOfEarnings,
        approximateMissedTimeFromSchool,
        haveRepresentation,
        attorneyName,
        reasonForRemovingRepresentation,
        claimId,
      },
    });

    return { success: 'Claim has been updated' };
  } else {
    const claimDataCreated = await db.incident.create({
      data: {
        injured,
        nameOfInjuredParty,
        relationshipToInjuredParty,
        dateOfIncident,
        incidentLocation,
        inScopeOfEmployment,
        descriptionOfAccident,
        policeReportFiled,
        precinct,
        officerNameAndDescription,
        accidentReportNumber,
        pictureTaken,
        pictureUpload,
        missedTimeFromWorkOrSchool,
        approximateLossOfEarnings,
        approximateMissedTimeFromSchool,
        haveRepresentation,
        attorneyName,
        reasonForRemovingRepresentation,
        claimId,
      },
    });

    return { success: claimDataCreated };
  }

  return { error: 'Something wrong' };
};
