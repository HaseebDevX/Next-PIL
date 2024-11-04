'use server';
import { db } from '@/lib/db';

export const createClaim = async (userId: string) => {
  const claimDataCreated = await db.claim.create({
    data: {
      userId: userId,
    },
  });

  return { success: claimDataCreated };
};
