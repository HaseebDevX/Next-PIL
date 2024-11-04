'use client';
import Link from 'next/link';

const ClaimList = ({ claim }: any) => {
  return (
    <>
      <div className='mb-1 flex flex-col rounded-lg border bg-white p-8' key={claim.id}>
        <div className='mb-2 flex items-start justify-between'>
          <p className='bg-gray rounded-md font-bold text-purple'>
            Claim ID: {claim.id}{' '}
            <span className='ml-3 rounded-xl bg-yellow-200 px-2 text-sm text-black'>{claim?.claimStatus}</span>
          </p>
          <Link href={`/claim/${claim.id}`}>Edit</Link>
        </div>
        <p className='font-medium'>Claim Type: {claim.claimType?.replaceAll('_', ' ')}</p>
        <p className='text-sm'>{claim.createdAt.toLocaleString()}</p>
        <p className='text-sm'>{claim.status}</p>
      </div>
    </>
  );
};

export default ClaimList;
