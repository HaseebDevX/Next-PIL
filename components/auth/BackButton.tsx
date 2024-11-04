'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface BackButtonProps {
  href: string;
  label: string;
}

export function BackButton({ href, label }: BackButtonProps) {
  return (
    <Button asChild className='w-full font-medium text-md underline' variant='link'>
      <Link href={href}>{label}</Link>
    </Button>
  );
}
