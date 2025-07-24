"use client";

import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        if (error.message === "NEXT_REDIRECT") return;
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("Operation was successful");
      },
    },
  },
});

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider>{children}</NextThemesProvider>
        <Toaster />
      </QueryClientProvider>
    </NextThemesProvider>
  );
}
