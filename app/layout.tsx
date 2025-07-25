// app/layout.tsx
import './globals.css';
import { Tiny5 } from 'next/font/google';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const tiny5 = Tiny5({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'SyncPaste',
  description: 'Cross-device clipboard sync tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${tiny5.className} bg-gray-900`}>
        <Navbar />
        {children}
        <Footer />
      </body>
      
    </html>
  );
}
