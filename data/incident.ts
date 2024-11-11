import { db } from '@/lib/db';

export const getIncidentByClaimId = async (claimId: string) => {
  try {
    console.log(claimId);

    const incident = await db.incident.findFirst({
      where: { claimId },
    });
    console.log(incident);

    return incident;
  } catch {
    return null;
  }
};
