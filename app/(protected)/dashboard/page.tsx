import { getClaimByUserId } from '@/data/claims';
import { ProfileForm } from '@/components/account-form/ProfileForm';
import { getProfileByUserId } from '@/data/profile';
import { currentSessionUser } from '@/lib/auth-utils';
import DashboardItems from '@/components/account-form/dashboard-items';
import ClaimList from '@/components/claim/claimlist';
import ClaimListCreate from '@/components/claim/claim-list-create';
import { getUserById } from '@/data/user';

export default async function DashboardPage() {
  const userSession = await currentSessionUser();
  const userId = userSession?.id as string;
  const existProfile: any = await getProfileByUserId(userId);
  const existingUser = await getUserById(userId);

  const getClaimByUserIdResult: any = await getClaimByUserId(userId);
  if (existProfile?.id) {
    return (
      <div>
        <DashboardItems profile={existProfile} />
        {getClaimByUserIdResult.map((claim: any) => (
          <ClaimList claim={claim} key={claim.id} />
        ))}
        <ClaimListCreate user={existingUser} />
      </div>
    );
  } else {
    return <ProfileForm user={userSession} />;
  }
}
