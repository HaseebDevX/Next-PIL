'use server';
import { Relationship } from '@prisma/client';

import { db } from '@/lib/db';

export const createClaim = async (payload: any) => {
  const claimDataCreated = await db.claim.create({
    data: payload,
  });

  return { success: claimDataCreated };
};
