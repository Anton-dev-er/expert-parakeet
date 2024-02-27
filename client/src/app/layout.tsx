import React from 'react';
import styles from './layout.module.scss';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';

import '@/src/styles/normalize.css';
import '@/src/styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { AuthContextProvider } from '@/src/contexts/AuthContext';
import { SocketContextProvider } from '@/src/contexts/SocketContext';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

config.autoAddCss = false;
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Main routes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${styles.body}`}>
        <AuthContextProvider>
          <SocketContextProvider>
            {children}
            <SpeedInsights />
            <Analytics />
          </SocketContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
