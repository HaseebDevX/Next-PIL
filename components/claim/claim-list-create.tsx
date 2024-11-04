'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createClaim } from '@/actions/claim-create';

const ClaimListCreate = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const createNewClaim = async () => {
    await createClaim(userId).then((claim) => {
      if (claim.success) {
        router.push('/claim/' + claim.success.id);
      }
    });
  };

  return (
    <>
      <div className='mb-5 flex flex-col justify-center space-y-5'>
        <div className='flex w-full items-center justify-between rounded-xl bg-white p-6 shadow-sm'>
          <h2 className='text-lg font-bold uppercase'>Create new Claim</h2>
          <div className='btn w-[160px] cursor-pointer text-center' onClick={createNewClaim}>
            Create Claim
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimListCreate;
