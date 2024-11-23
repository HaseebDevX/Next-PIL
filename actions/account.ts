'use server'; 

import { db } from '@/lib/db';

export const createAccount = async (payload: any) => {
  const accountDataCreated = await db.account.create({
    data: payload,
  });

  return { success: accountDataCreated };
};
