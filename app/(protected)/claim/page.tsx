import { getClaimByUserId } from '@/data/claims';
import { currentSessionUser } from '@/lib/auth-utils';
import ClaimList from '@/components/claim/claimlist';
import ClaimListCreate from '@/components/claim/claim-list-create';
import { ClaimSchema } from '@/schemas';

export default async function DashboardPage() {
  const userSession = await currentSessionUser();
  const userId = userSession?.id as string;
  const getClaimByUserIdResult: any = await getClaimByUserId(userId);
  if (getClaimByUserIdResult?.length) {
    return (
      <div>
        {getClaimByUserIdResult.map((claim: Zod.infer<typeof ClaimSchema>) => (
          <ClaimList claim={claim} key={claim.id} />
        ))}
        <ClaimListCreate userId={userId} />
      </div>
    );
  } else {
    return (
      <div className='flex flex-col'>
        <ClaimListCreate userId={userId} />
      </div>
    );
  }
}
