/* eslint-disable react/no-unescaped-entities */
 import Image from 'next/image';

import logo from '@/public/logo.png';
import rImage from '@/public/icons/Rimage.svg';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const HeaderLogo = () => {
    return <Image alt='Paininjurylaw' className='' height={44} priority src={logo} width={240} />;
  };
  return (
    <>
      <div className='flex h-screen flex-col md:flex-row'>
        <div className='hidden w-2/3  flex-col justify-between bg-purple p-10 text-white md:flex'>
          <HeaderLogo />
          <div>
            <h1 className='font-wicklowRegular mb-6 text-4xl font-medium'>
              Getting Injured Is Hard. <br />
              Getting Legal Help Doesn't Have to Be.
            </h1>
          </div>
          <div>
            <div className='mt-6 flex items-center'>
              <Image alt='Paininjurylaw' className='' height={60} priority src={rImage} width={60} />
              <div className='ml-4'>
                <p className='text-md font-gingerRegular font-medium '>John F.</p>
                <p className='space text-sm'>★★★★★</p>
              </div>
            </div>
            <p className='font-gingerRegular mt-5 text-sm'>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy
              text of the printing.
            </p>
          </div>
        </div>
        <div className='m-auto flex w-[1440px] flex-col px-64'>{children}</div>
      </div>
    </>
  );
}
