import { db } from '@/lib/db';

export const getSingleClaim = async (id: number, userId: string) => {
  try {
    const claim = await db.claim.findFirst({
      where: { userId, id },
      include: {
        Incidents: true,
        Witnesses: true,
        Injuries: true,
        Treatments: true,
        Questionnaires: true,
        Defendants: true,
      },
    });
    return claim;
  } catch {
    return null;
  }
};
