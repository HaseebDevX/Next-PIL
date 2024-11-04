import Image from 'next/image';
import { PowerIcon } from '@heroicons/react/24/outline';
import { SessionProvider } from 'next-auth/react';

import { NavigationMenu } from '@/components/navbar/NavigationMenu';
import { Navbar } from '@/components/navbar/Navbar';
import logo from '@/public/logo.png';
import { LogoutButton } from '@/components/LogoutButton';

export default async function ProtectedLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Navbar>
        <Image alt='Paininjurylaw' className='' height={55} priority src={logo} width={300} />
        <NavigationMenu />
        <LogoutButton>
          <div className='flex cursor-pointer items-center justify-between rounded-md bg-purpledark p-3 px-5 text-xl hover:bg-purpledark2'>
            Logout <PowerIcon className='h-6 w-6 text-white' />
          </div>
        </LogoutButton>
      </Navbar>
      <div className='m-auto flex w-[1170px] flex-col space-y-5 p-8 pl-[332px]'>{props.children}</div>
    </>
  );
}
