'use server'; 

import { db } from '@/lib/db';

export const createRoleType = async (payload: any) => {
  const roleTypeDataCreated = await db.roleType.create({
    data: payload,
  });

  return { success: roleTypeDataCreated };
};
