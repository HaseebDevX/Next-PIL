'use client';
import Image from 'next/image';
import { useState } from 'react';

import homeIcon from '@/public/icons/home.svg';
import claimIcon from '@/public/icons/claim.svg';
import documentIcon from '@/public/icons/document.svg';
import notifyIcon from '@/public/icons/notify.svg';

export function NavbarMobile() {
  const [isActive, setIsActive] = useState<number>(1);
  const MenuItem = (prop: { title: string; active: boolean; icon: string; onClick: () => void }) => {
    return (
      <div className='flex  flex-col items-center ' onClick={prop.onClick}>
        <Image alt='Paininjurylaw' className='' height={24} priority src={prop.icon} width={24} />
        <p className='px-2 font-wicklowRegular text-white'>{prop.title}</p>
        {prop.active && <div className='border-themeLightPurple border-1 mt-[15px] w-full border-[2px] border-b' />}
      </div>
    );
  };
  return (
    <nav className=' flex flex-row justify-evenly space-y-0.5 bg-purple  pt-[17px]  '>
      <MenuItem
        active={isActive === 1}
        icon={homeIcon}
        onClick={() => {
          setIsActive(1);
        }}
        title='Home'
      />
      <MenuItem
        active={isActive === 2}
        icon={claimIcon}
        onClick={() => {
          setIsActive(2);
        }}
        title='Claim'
      />
      <MenuItem
        active={isActive === 3}
        icon={documentIcon}
        onClick={() => {
          setIsActive(3);
        }}
        title='Document'
      />
      <MenuItem
        active={isActive === 4}
        icon={notifyIcon}
        onClick={() => {
          setIsActive(4);
        }}
        title='Notify'
      />
    </nav>
  );
}
