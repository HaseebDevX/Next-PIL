'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import arrowRight from '@/public/icons/arrow-right-black.svg';
import btnEdit from '@/public/icons/btn-edit.svg';

// import { createClaim } from '@/actions/claim-create';
import HalfCircleProgressBar from '../ui/half-progress-bar';

const ClaimListCreate = ({ userId }: { userId: string }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Example: Update progress every 1 second
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 5 : 100));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const router = useRouter();
  const createNewClaim = async () => {
    await createClaim(userId).then((claim) => {
      if (claim.success) {
        router.push('/claim/' + claim.success.id);
      }
    });
  };
  const CardHeading = (prop: { title: string }) => {
    return <p className='font-wicklowRegular text-2xl text-purple'>{prop.title}</p>;
  };
  const SimpleText = (prop: { title: string; textColor?: string }) => {
    return (
      <p className={`text-gingerRegular text-lg ${prop.textColor ? prop.textColor : 'text-black'}`}>{prop.title}</p>
    );
  };
  return (
    <>
      <div className='flex flex-col '>
        <div className=' bg-purple'>
          <div className='pb-[37px] pt-[43px]'>
            <HalfCircleProgressBar progress={progress} />
          </div>
        </div>
        <div className='flex w-full flex-row justify-center px-[15px] md:px-0 lg:px-0 xl:px-0'>
          <div className='min-w-full md:min-w-[520px]'>
            <div className='bg-themeGrayLight mt-[-15px] flex  flex-row items-start rounded-[12px] px-5 py-[15px]'>
              <div className='flex-grow'>
                <CardHeading title='Account Details' />
                <SimpleText title='First Name: Kashif Anjum' />
                <SimpleText title='Email: justoprint@gmail.com' />
                <SimpleText title='Mobile: +1 123 456 7890' />
              </div>
              <span className='cursor-pointer '>
                <Image alt='Paininjurylaw' className='' height={24} priority src={btnEdit} width={24} />
              </span>
            </div>
            <div className='mt-[21px] flex flex-row rounded-[12px] border border-purple bg-white p-[15px]'>
              <div className='flex-grow space-y-[5px]'>
                <CardHeading title='Car Accident' />
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

                <div className='btn max-w-[105px] cursor-pointer text-center' onClick={createNewClaim}>
                  Edit
                </div>
              </div>
            </div>
            <div className='mt-[21px] flex flex-row rounded-[12px] border border-purple bg-white p-[15px]'>
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
