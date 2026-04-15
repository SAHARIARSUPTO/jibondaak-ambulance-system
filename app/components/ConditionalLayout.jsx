'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar/navbar';
import Footer from './footer/footer';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Hide navbar and footer for dashboard pages
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/provider-dashboard') || pathname?.startsWith('/admin');
  
  if (isDashboard) {
    return <main>{children}</main>;
  }
  
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
