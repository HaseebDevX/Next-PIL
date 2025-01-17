import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PainInjuryLaw',
  description: "Getting Injured Is Hard. Getting Legal Help Doesn't Have to Be.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
