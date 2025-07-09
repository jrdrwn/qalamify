import { AppKitProvider } from '@/components/providers/wallet-connect';
import { ReactScan } from '@/components/shared/react-scan';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Geist_Mono, Sora } from 'next/font/google';

import './globals.css';

import { ThemeProvider } from '@/components/shared/theme-provider';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const soraSans = Sora({
  variable: '--font-sora-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Qalamify',
  description: 'Create, share, and collect Islamic calligraphy NFTs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {process.env.RS && <ReactScan />}
      <body
        className={`${soraSans.className} ${geistMono.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <AppKitProvider>{children}</AppKitProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
