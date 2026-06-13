import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'TIMIS — Property Management for Kenya',
  description: 'M-Pesa rent collection, tenant scoring, AI-powered lease management. Built for Kenya.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jakarta.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head><link rel="manifest" href="/manifest.json" /><meta name="theme-color" content="#0A1929" /></head>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
