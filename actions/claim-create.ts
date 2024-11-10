'use server';
import { db } from '@/lib/db';
import { Relationship } from '@prisma/client';

export const createClaim = async (payload: any) => {
  const claimDataCreated = await db.claim.create({
    data: payload,
  });

  return { success: claimDataCreated };
};
