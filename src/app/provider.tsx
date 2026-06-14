"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { LanguageProvider } from "./LanguageContext";
import { persistor, store } from "@/store/store";
import { GlobalTimer } from "@/components/GlobalTimer";

function AppBootFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[var(--theme-soft,#eef9f2)] px-4 text-center"
      style={{
        alignItems: "center",
        background: "#eef9f2",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 16,
        textAlign: "center",
      }}
    >
      <div
        className="max-w-md rounded-2xl border border-[var(--theme-border,#b9e2cd)] bg-white px-6 py-5 shadow-sm"
        style={{
          background: "#ffffff",
          border: "1px solid #b9e2cd",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
          maxWidth: 420,
          padding: "20px 24px",
        }}
      >
        <div
          className="text-sm font-semibold text-[var(--theme-dark,#2f8f5b)]"
          style={{ color: "#2f8f5b", fontSize: 14, fontWeight: 700 }}
        >
          Loading Osteps
        </div>
        <p className="mt-2 text-sm text-slate-500" style={{ color: "#64748b", fontSize: 14, marginTop: 8 }}>
          Please wait while your session is restored.
        </p>
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
              <GlobalTimer />
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
