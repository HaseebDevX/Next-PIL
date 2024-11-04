'use server';
import * as zod from 'zod';

import { db } from '@/lib/db';
import { ClaimSchema } from '@/schemas';

export const createOrUpdateClaim = async (values: zod.infer<typeof ClaimSchema>) => {
  const validatedFields = ClaimSchema.safeParse(values);

  if (!validatedFields.success) return { error: 'Invalid fields' };

  const { id, name, claimType, userId } = validatedFields.data;

  if (id) {
    const claimDataUpdated = await db.claim.update({
      where: { id: id },
      data: {
        name,
        claimType,
        userId,
      },
    });

    return { success: 'Claim has been updated' };
  } else {
    const claimDataCreated = await db.claim.create({
      data: {
        name,
        claimType,
        userId,
      },
    });

    return { success: 'Claim has been created' };
  }

  return { error: 'Something wrong' };
};
