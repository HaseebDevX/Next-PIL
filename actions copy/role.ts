'use server'; 

import { db } from '@/lib/db';

export const createRole = async (payload: any) => {
  const roleDataCreated = await db.role.create({
    data: payload,
  });

  return { success: roleDataCreated };
};
