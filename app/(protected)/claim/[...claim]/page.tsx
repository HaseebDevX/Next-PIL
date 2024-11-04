import ClaimForm from '@/components/claim/claim-form';
import IncidentForm from '@/components/claim/incident-form';
import WitnessForm from '@/components/claim/witness-form';
import InjuryForm from '@/components/claim/injury-form';
import TreatmentForm from '@/components/claim/treatment-form';
import QuestionnaireForm from '@/components/claim/questionnaire-form';
import DefendantForm from '@/components/claim/defendant-form';
import { currentSessionUser } from '@/lib/auth-utils';
import { getSingleClaim } from '@/data/claim-single';
import { ClaimDatabaseSchema } from '@/schemas';

export default async function ClaimDetailsPage({ params }: { params: { claim: string } }) {
  const { claim } = params;
  const userSession = await currentSessionUser();
  const userId = userSession?.id as string;
  const id = Number(claim[0]) as number;
  const singleClaimData = await getSingleClaim(id, userId);

  if (!singleClaimData) {
    return <div>No claim data found.</div>;
  }
  const parsedClaimData = ClaimDatabaseSchema.parse(singleClaimData);
  return (
    <div className='flex flex-col rounded-lg bg-white p-8 shadow-lg'>
      <ClaimForm claimData={parsedClaimData} />
      <div className='my-6 border' />

      <div className='mb-10'>
        <h3 className='text-xl font-semibold uppercase text-purple'>Incident</h3>
        <IncidentForm claimId={singleClaimData?.id} incident={parsedClaimData?.Incidents} />
      </div>
      <div className='mb-10'>
        <h3 className='text-xl font-semibold uppercase text-purple'>Witness</h3>
        <WitnessForm claimId={singleClaimData?.id} witness={parsedClaimData?.Witnesses} />
      </div>
      <div className='mb-10'>
        <h3 className='text-xl font-semibold uppercase text-purple'>Injury</h3>
        <InjuryForm claimId={singleClaimData?.id} injury={parsedClaimData?.Injuries} />
      </div>
      <div className='mb-10'>
        <h3 className='text-xl font-semibold uppercase text-purple'>Treatment</h3>
        <TreatmentForm claimId={singleClaimData?.id} treatment={parsedClaimData?.Treatments} />
      </div>
      <div className='mb-10'>
        <h3 className='text-xl font-semibold uppercase text-purple'>Questionnaire</h3>
        <p className='text-xs'>if (Car Accident, Trucking Accident, Motorcycle Accident or Ride-Share Accident.)</p>
        <QuestionnaireForm claimId={singleClaimData?.id} questionnaire={parsedClaimData?.Questionnaires} />
      </div>
      <div className='mb-10'>
        <h3 className='text-xl font-semibold uppercase text-purple'>Defendants</h3>
        <DefendantForm claimId={singleClaimData?.id} defendant={parsedClaimData?.Defendants} />
      </div>
    </div>
  );
}
