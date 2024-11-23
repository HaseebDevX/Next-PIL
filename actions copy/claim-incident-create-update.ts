'use server';
import * as zod from 'zod';

import { db } from '@/lib/db';
import { ClaimSchema, IncidentSchema } from '@/schemas';

export const createOrUpdateIncident = async (values: any, claimId: string, attorneyPayload: any) => {
  const validatedFields = IncidentSchema.safeParse(values);

  if (!validatedFields.success) return { error: 'Invalid fields' };
  // console.log(validatedFields.data);

  const {
    id,
    date,
    time,
    timeOfDay,
    location,
    workRelated,
    description,
    policeReportCompleted,
    policeStation,
    policeOfficer,
    reportCompleted,
    reportNumber,
    supportingDocument,
    supportingDocumentUpload,
    lostEarning,
    amountLoss,
    timeLoss,
    priorRepresentation,
    namePriorRepresentation,
    priorRepresentationReason,
    roleId,
    claimType,
  } = validatedFields.data;

  if (id) {
    const claimDataUpdated = await db.incident.update({
      where: { id: id },
      data: {
        date,
        time,
        timeOfDay,
        location,
        workRelated,
        description,
        policeReportCompleted,
        policeStation,
        policeOfficer,
        reportCompleted,
        reportNumber,
        supportingDocument,
        supportingDocumentUpload,
        lostEarning,
        amountLoss,
        timeLoss,
        priorRepresentation,
        roleId,
        priorRepresentationReason,
      },
    });

    return { success: 'Claim has been updated', claimDataUpdated };
  } else {
    const claimDataCreated = await db.incident.create({
      data: {
        date,
        time,
        timeOfDay,
        location,
        workRelated,
        description,
        policeReportCompleted,
        policeStation,
        policeOfficer,
        reportCompleted,
        reportNumber,
        supportingDocument,
        supportingDocumentUpload,
        lostEarning,
        amountLoss,
        timeLoss,
        priorRepresentation,
        priorRepresentationReason,
        // Connect the existing claim by ID
        Claim: {
          connect: {
            id: claimId, // Ensure this value exists in the `Claim` table
          },
        },
        role: {
          create: {
            account: {
              create: {
                firstname: attorneyPayload?.firstname,
                lastname: attorneyPayload?.lastname,
              },
            },
            roletype: {
              create: {
                roleType: 'Plaintiff Law Firm',
              },
            },
          },
        },
      },
    });

    return { success: claimDataCreated };
  }

  return { error: 'Something wrong' };
};
