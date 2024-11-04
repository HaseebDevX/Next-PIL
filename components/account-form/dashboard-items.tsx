'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import * as zod from 'zod';

import { AccountSchema } from '@/schemas';

type AccountInfo = zod.infer<typeof AccountSchema>;
interface AccountInfoProps {
  profile?: AccountInfo;
}

const DashboardItems = ({ profile }: AccountInfoProps) => {
  return (
    <>
      <div className='mb-5 flex flex-col justify-center space-y-5'>
        <div className='flex w-full flex-col rounded-xl bg-white p-6 shadow-sm'>
          <h2 className='text-lg font-bold uppercase'>Account details</h2>
          <p>
            {profile?.id} {profile?.lastName}
          </p>
          <p>{profile?.email}</p>
          <p>{profile?.phone1}</p>
          <p>{profile?.mailingAddress1}</p>
          <p>15+</p>
          <Link className='btn w-[120px] text-center' href='/dashboard'>
            Edit Now
          </Link>
        </div>
      </div>
    </>
  );
};

export default DashboardItems;
