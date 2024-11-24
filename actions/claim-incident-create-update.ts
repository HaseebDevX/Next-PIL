'use server';
import * as zod from 'zod';

import { db } from '@/lib/db';
import { IncidentSchema } from '@/schemas';

export const createOrUpdateIncident = async (values: any, claimId: string, attorneyPayload: any) => {
  const validatedFields = IncidentSchema.safeParse(values);

  if (!validatedFields.success) return { error: 'Invalid fields' };

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
    priorRepresentationReason,
    roleId,
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

    return { success: 'Incident has been updated', claimDataUpdated };
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
        Claim: {
          connect: { id: claimId },
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
              create: { roleType: 'Plaintiff Law Firm' },
            },
          },
        },
      },
    });

    return { success: claimDataCreated };
  }

  return { error: 'Something went wrong' };
};

export const getIncidentById = async (incidentId: string) => {
  try {
    const incident = await db.incident.findUnique({
      where: { id: incidentId },
      include: { role: { include: { account: true } } },
    });
    return incident;
  } catch (error) {
    console.error('Error fetching incident:', error);
    return null;
  }
};
