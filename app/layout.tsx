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
  description: 'A minimal, fast clipboard sharing tool using session codes. Paste once, access anywhere.',
  keywords: 'clipboard sharing, sync clipboard, paste tool, real-time clipboard, no login, cross-platform copy paste tool, clipboard manager online, open source app',
  openGraph: {
    title: 'SyncPaste',
    description: 'Instantly sync your clipboard across devices with a session code.',
    url: 'https://syncpaste.vercel.app.com',
    siteName: 'SyncPaste'
  },
  type: 'website',
  
  icons: {
    icon: '/favicon.ico',
  },
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
