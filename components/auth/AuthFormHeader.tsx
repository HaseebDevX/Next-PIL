import { Poppins } from 'next/font/google';

import { cn } from '@/lib/utils';

const font = Poppins({ subsets: ['latin'], weight: '600' });

interface CardHeaderProps {
  label: string;
}

export function AuthFormHeader({ label }: CardHeaderProps) {
  return (
    <div className='flex w-full flex-col items-center justify-center gap-y-4'>
      <p className='text-xl font-medium'>{label}</p>
    </div>
  );
}
