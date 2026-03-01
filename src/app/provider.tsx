"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { LanguageProvider } from "./LanguageContext";
import { persistor, store } from "@/store/store";

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
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <LanguageProvider>
            {children}
            {process.env.NODE_ENV === "development" && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </LanguageProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
