'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import arrowRight from '@/public/icons/arrow-right-black.svg';
import btnEdit from '@/public/icons/btn-edit.svg';
import { ClaimSchema } from '@/schemas';

import HalfCircleProgressBar from '../ui/half-progress-bar';
import ThemeChip from '../ui/chip';

import { CardHeading } from './cardHeading';
import { SimpleText } from './simpleText';

const ClaimListCreate = (prop: { user: any; userClaims?: Zod.infer<typeof ClaimSchema>[] }) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    data1();
  }),
    [prop.user];

  const data1 = async () => {
    // console.log(prop.user);
  };
  const router = useRouter();

  return (
    <>
      <div className='flex flex-col '>
        <div className=' bg-purple'>
          <div className='pb-[37px] pt-[43px]'>
            <div className='flex flex-col items-center '>
              <HalfCircleProgressBar progress={progress} />
              <p className='text-gingerRegular text-themeLightPurple2 pt-2.5 text-[18px]'>Unable to submit claim</p>
            </div>
          </div>
        </div>
        <div className='flex w-full flex-row justify-center px-[15px] md:px-0 lg:px-0 xl:px-0'>
          <div className='min-w-full md:min-w-[520px]'>
            <div className='bg-themeGrayLight mt-[-15px] flex  flex-row items-start rounded-[12px] px-5 py-[15px]'>
              <div className='flex-grow'>
                <CardHeading title='Account Details' />
                <SimpleText
                  title={`First Name:  ${prop.user.firstname || ''} ${prop.user.middleName || ''} ${prop.user.lastname || ''}`}
                />
                <SimpleText title={`Email: ${prop.user.email || ''}`} />
                <SimpleText title={`Mobile: ${prop.user.phone || ''}`} />
              </div>
              <span className='cursor-pointer '>
                <Image alt='Paininjurylaw' className='' height={24} priority src={btnEdit} width={24} />
              </span>
            </div>
            {prop.userClaims &&
              prop.userClaims.map((claim: Zod.infer<typeof ClaimSchema>) => (
                <div
                  className='mt-[21px] flex flex-row rounded-[12px] border border-purple bg-white p-[15px]'
                  key={claim.id + 'claimId'}
                >
                  <div className='flex-grow space-y-[5px]'>
                    <div className='flex flex-row space-x-[5px] '>
                      <CardHeading title={claim?.type.replaceAll('_', ' ')} />
                      <ThemeChip color='bg-themeRed' title='Pending Info' />
                    </div>
                    <div className='flex flex-row space-x-2.5 '>
                      <SimpleText title='Incident' />
                      <SimpleText textColor='text-themeGreen' title='COMPLETED' />
                    </div>
                    <div className='flex flex-row space-x-2.5 '>
                      <SimpleText title='Witness' />
                      <SimpleText textColor='text-themeGreen' title='COMPLETED' />
                    </div>
                    <div className='flex flex-row space-x-2.5 '>
                      <SimpleText title='Defendant' />
                      <SimpleText textColor='text-themeRed' title='PENDING' />
                    </div>
                    <div className='flex flex-row space-x-2.5 '>
                      <SimpleText title='Injury & Treatment' />
                      <SimpleText textColor='text-themeRed' title='PENDING' />
                    </div>
                    <div className='flex flex-row space-x-2.5 '>
                      <SimpleText title='Additional Information' />
                      <SimpleText textColor='text-themeRed' title='PENDING' />
                    </div>
                    <div className='flex flex-row space-x-2.5 '>
                      <SimpleText title='Documents' />
                      <SimpleText textColor='text-themeRed' title='PENDING' />
                    </div>

                    <div
                      className='btn max-w-[105px] cursor-pointer text-center'
                      onClick={() => {
                        sessionStorage.setItem('claimToEdit', JSON.stringify(claim));
                        router.push(`claim/incident/${prop.user.id}?claimId=${claim?.id ?? ''} `);
                      }}
                    >
                      Edit
                    </div>
                  </div>
                </div>
              ))}
            <div
              className='mt-[21px] flex cursor-pointer flex-row rounded-[12px] border border-purple bg-white p-[15px]  '
              onClick={() => {
                sessionStorage.removeItem('claimToEdit');
                router.push('claim/incident/' + prop.user.id);
              }}
            >
              <div className='flex-grow space-y-[5px]'>
                <CardHeading title='Create New Claim' />
                <SimpleText title="Let's start your claim process" />
              </div>
              <Image alt='Paininjurylaw' className='' height={24} priority src={arrowRight} width={24} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimListCreate;
