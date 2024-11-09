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
        namePriorRepresentation,
        priorRepresentationReason,
      },
    });

    return { success: 'Claim has been updated' };
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
        namePriorRepresentation,
        priorRepresentationReason,
        claimId: '',
      },
    });

    return { success: claimDataCreated };
  }

  return { error: 'Something wrong' };
};
