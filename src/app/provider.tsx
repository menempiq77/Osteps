"use client";

import { Provider } from "react-redux";
import { store, persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // useEffect(() => {
  //   const originalError = console.error;
  //   console.error = (...args) => {
  //     if (args[0]?.includes("antd: compatible")) return;
  //     originalError(...args);
  //   };
  // }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
