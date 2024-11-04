import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import logo from '@/public/logo.png';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

export default function Home() {
  return (
    <div className='flex h-full w-full items-center justify-center bg-purple'>
      <div className='flex flex-col items-center space-y-10 text-white'>
        <>
          <Image alt='Paininjurylaw' className='' height={55} priority src={logo} width={300} />
        </>
        <>
          <div className='flex flex-col items-center justify-center'>
            <p className='text-2xl'>Getting Injured Is Hard.</p>
            <p className='text-xl'>Getting Legal Help Doesn&apos;t Have to Be.</p>
          </div>
          <div className='flex space-x-3'>
            <Link className='rounded-md bg-white px-8 py-3 font-bold text-purple' href='/register'>
              Register
            </Link>
            <Link className='rounded-md bg-white px-8 py-3 font-bold text-purple' href='/login'>
              Login
            </Link>
          </div>
        </>
      </div>
    </div>
  );
}
