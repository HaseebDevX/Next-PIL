'use client';

import { useSearchParams } from 'next/navigation';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';

import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { Button } from '@/components/ui/button';

export function SocialButtons() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, {
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <div className='flex w-full items-center gap-x-2'>
      <Button className='w-full p-6' onClick={() => onClick('google')} size='lg' variant='outline'>
        Login with Google<FcGoogle className='h-5 w-5 ml-2' />
      </Button>
    </div>
  );
}
