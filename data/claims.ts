import { db } from '@/lib/db';

export const getClaimByUserId = async (userId: string) => {
  try {
    const claim = await db.claim.findMany({
      where: { userId },
      include: {
        incident: true,
      },
    });
    return claim;
  } catch {
    return null;
  }
};
