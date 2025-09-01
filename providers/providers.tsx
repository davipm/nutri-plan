'use client';

import { Toaster } from '@/components/ui/sonner';
import { AlertDialogProvider } from '@/providers/alert-dialog-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';
import { toast } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        if (error.message === 'NEXT_REDIRECT') return;
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success('Operation was successful');
      },
    },
  },
});

type Props = {
  children: ReactNode;
};

/**
 * A context provider component that wraps its children with necessary providers
 * such as NextThemesProvider for theme management, QueryClientProvider for
 * React Query, and other necessary UI utilities.
 *
 * @param {object} props - The property object.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the providers.
 * @return The wrapped components with all applicable providers.
 */
export function Providers({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <NextThemesProvider>{children}</NextThemesProvider>
          <Toaster />
          <AlertDialogProvider />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </NextThemesProvider>
  );
}
