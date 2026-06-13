'use client';
import { ThemeProvider } from 'next-themes';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </ThemeProvider>
  );
}
