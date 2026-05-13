import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers/Providers';
import  Navbar  from '@/components/layout/Navbar/Navbar';
import '@/styles/global.scss';
 
const inter = Inter({ subsets: ['latin'] });
 
export const metadata: Metadata = {
  title: {
    default: 'Shop',
    template: '%s | Shop',
  },
  description: 'A modern e-commerce platform',
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}