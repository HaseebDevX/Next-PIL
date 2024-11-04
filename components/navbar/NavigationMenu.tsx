'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ViewColumnsIcon, DocumentPlusIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

import { Button } from '@/components/ui/button';

export function NavigationMenu() {
  const pathname = usePathname();
  return (
    <div>
      <ul className='nav flex flex-col space-y-1 text-xl font-medium'>
        <li>
          <Link className={pathname === '/dashboard' ? 'active' : ''} href='/dashboard'>
            <ViewColumnsIcon className='mr-2 w-[24px]' />
            Dashboard
          </Link>
        </li>
        <li>
          <Link className={pathname === '/claim' ? 'active' : ''} href='/claim'>
            <DocumentPlusIcon className='mr-2 w-[24px]' />
            Claim
          </Link>
        </li>
        <li>
          <Link className={pathname === '/admin' ? 'active' : ''} href='/dashboard'>
            <DocumentTextIcon className='mr-2 w-[24px]' />
            Documents
          </Link>
        </li>
      </ul>
    </div>
  );
}
