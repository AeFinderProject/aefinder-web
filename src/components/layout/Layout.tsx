import * as React from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-[100vh] flex-col justify-between'>
      <Header />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
