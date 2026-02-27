"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import dynamic from "next/dynamic";
import { LanguageProvider } from "./LanguageContext";

// Lazy load Redux to avoid circular dependencies at module load time
const ReduxProvider = dynamic(
  async () => {
    const { Provider } = await import("react-redux");
    const { store, persistor } = await import("@/store/store");
    const { PersistGate } = await import("redux-persist/integration/react");

    return {
      default: ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {children}
          </PersistGate>
        </Provider>
      ),
    };
  },
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider>
        <LanguageProvider>
          {children}
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </LanguageProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}