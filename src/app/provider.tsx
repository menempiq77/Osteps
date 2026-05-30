"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { LanguageProvider } from "./LanguageContext";
import { persistor, store } from "@/store/store";
import { GlobalAiAssistant } from "@/components/GlobalAiAssistant";

function AppBootFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--theme-soft,#eef9f2)] px-4 text-center">
      <div className="max-w-md rounded-2xl border border-[var(--theme-border,#b9e2cd)] bg-white px-6 py-5 shadow-sm">
        <div className="text-sm font-semibold text-[var(--theme-dark,#2f8f5b)]">Loading Osteps</div>
        <p className="mt-2 text-sm text-slate-500">Please wait while your session is restored.</p>
      </div>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={<AppBootFallback />} persistor={persistor}>
          <LanguageProvider>
            <Suspense fallback={<AppBootFallback />}>
              {children}
            </Suspense>
            <Suspense fallback={null}>
              <GlobalAiAssistant />
            </Suspense>
            {process.env.NODE_ENV === "development" && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </LanguageProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
