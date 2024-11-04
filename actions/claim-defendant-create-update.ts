'use server';
import * as zod from 'zod';

import { db } from '@/lib/db';
import { DefendantSchema } from '@/schemas';

export const createOrUpdateDefendant = async (values: zod.infer<typeof DefendantSchema>) => {
  const validatedFields = DefendantSchema.safeParse(values);
  if (!validatedFields.success) return { error: 'Invalid fields' };

  const {
    id,
    name,
    phone,
    address,
    role,
    insuranceCarrier,
    policyHolder,
    policyNumber,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    vehicleColor,
    vehiclePlateNumber,
    vehicleRegisteredState,
    claimId,
  } = validatedFields.data;
  if (id) {
    const claimDataUpdated = await db.defendant.update({
      where: { id: id },
      data: {
        name,
        phone,
        address,
        role,
        insuranceCarrier,
        policyHolder,
        policyNumber,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        vehicleColor,
        vehiclePlateNumber,
        vehicleRegisteredState,
        claimId,
      },
    });
    return { success: 'Witness has been updated' };
  } else {
    const claimDataCreated = await db.defendant.create({
      data: {
        name,
        phone,
        address,
        role,
        insuranceCarrier,
        policyHolder,
        policyNumber,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        vehicleColor,
        vehiclePlateNumber,
        vehicleRegisteredState,
        claimId,
      },
    });
    return { success: claimDataCreated };
  }

  return { error: 'Something wrong' };
};

export const deleteDefendant = async (id: number) => {
  try {
    const defendantDeleted = await db.defendant.delete({
      where: { id },
    });
    return { success: 'Defendant has been deleted successfully!' };
  } catch (error) {
    return { error: 'Failed to delete defendant' };
  }
};