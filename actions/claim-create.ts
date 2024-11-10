'use server';
import { db } from '@/lib/db';
import { Relationship } from '@prisma/client';

export const createClaim = async (userId: string) => {
  const claimDataCreated = await db.claim.create({
    data: {
      userId: userId,
      relationship: Relationship.Other,//TODO: make it dynamic
    },
  });

  return { success: claimDataCreated };
};
