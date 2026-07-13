"use client";

import { SerwistProvider } from "@serwist/next/react";
import type { ReactNode } from "react";
import { PwaLifecycle } from "./PwaLifecycle";

export function PwaProvider({ children }: { children: ReactNode }) {
  return (
    <SerwistProvider
      swUrl="/sw.js"
      disable={process.env.NODE_ENV !== "production"}
      cacheOnNavigation={false}
      reloadOnOnline={false}
      options={{ scope: "/", type: "classic", updateViaCache: "none" }}
    >
      {children}
      <PwaLifecycle />
    </SerwistProvider>
  );
}
