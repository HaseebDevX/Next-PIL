import Image from 'next/image';

import logo from '@/public/logo.png';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className='flex min-h-full w-full justify-center bg-purple'>
        <div className='my-12 flex flex-col items-center space-y-10 text-white'>
          <>
            <Image alt='Paininjurylaw' className='' height={55} priority src={logo} width={300} />
          </>
          <>{children}</>
        </div>
      </div>
    </>
  );
}
