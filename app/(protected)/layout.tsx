import Image from 'next/image';
import { PowerIcon } from '@heroicons/react/24/outline';
import { SessionProvider } from 'next-auth/react';

import { NavigationMenu } from '@/components/navbar/NavigationMenu';
import { Navbar } from '@/components/navbar/Navbar';
import logo from '@/public/logo.png';
import { LogoutButton } from '@/components/LogoutButton';
import { NavbarMobile } from '@/components/navbar/NavBarMobile';

export default async function ProtectedLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className='flex'>
        <div className='fixed left-0 top-0 hidden h-screen bg-purpledark md:block lg:block xl:block'>
          <Navbar>
            <Image alt='Paininjurylaw' className='' height={55} priority src={logo} width={300} />
            <NavigationMenu />
            <LogoutButton>
              <div className='flex cursor-pointer items-center justify-between rounded-md bg-purpledark p-3 px-5 text-xl hover:bg-purpledark2'>
                Logout <PowerIcon className='h-6 w-6 text-white' />
              </div>
            </LogoutButton>
          </Navbar>
        </div>

        <div className='ml-[300px] w-full'>{props.children}</div>
      </div>

      <footer className='fixed bottom-0 block w-full md:hidden lg:hidden xl:hidden'>
        <NavbarMobile />
      </footer>
    </>
  );
}
