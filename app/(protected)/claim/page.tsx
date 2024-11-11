import { getClaimByUserId } from '@/data/claims';
import { currentSessionUser } from '@/lib/auth-utils';
import ClaimList from '@/components/claim/claimlist';
import ClaimListCreate from '@/components/claim/claim-list-create';
import { ClaimSchema } from '@/schemas';
import { getProfileByUserId } from '@/data/profile';
import { getUserById } from '@/data/user';

export default async function DashboardPage() {
  const userSession = await currentSessionUser();
  const userId = userSession?.id as string;
  // const existProfile: any = await getProfileByUserId(userId);
  const existingUser = await getUserById(userId);
  const getClaimByUserIdResult: any = await getClaimByUserId(userId);

  return (
    <div className='flex flex-col'>
      <ClaimListCreate user={existingUser} userClaims={getClaimByUserIdResult} />
    </div>
  );
  // }
}
