"use client";

import { useEffect } from "react";
import { Alert, Button, Card } from "antd";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const isLikelyStaleClientError = (message: string) =>
  /Failed to find Server Action|ChunkLoadError|Loading chunk|dynamically imported module/i.test(message);

const clearSavedDashboardSession = () => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem("currentUser");
    window.localStorage.removeItem("persist:root");
  } catch (error) {
    console.error("Could not clear saved dashboard session:", error);
  }
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard route crashed:", error);
  }, [error]);

  const message = String(error?.message || "Unexpected client error.");
  const staleClientError = isLikelyStaleClientError(message);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center p-4 md:p-6">
      <Card className="w-full">
        <Alert
          type="error"
          showIcon
          message="Dashboard page failed to load"
          description={
            <div className="space-y-3 text-sm">
              <p>
                The page hit a client-side error while loading. Try the quick retry first.
                If this browser is holding an older deployment, reload the page to fetch the latest version.
              </p>
              {staleClientError ? (
                <p className="rounded bg-amber-50 px-3 py-2 text-amber-800">
                  This looks like a stale browser bundle after a deployment. Reloading the page or signing in again usually fixes it.
                </p>
              ) : null}
              <p className="break-words rounded bg-red-50 px-3 py-2 font-mono text-xs text-red-700">
                {message}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button type="primary" onClick={reset}>
                  Try again
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Reload page
                </Button>
                <Button
                  onClick={() => {
                    clearSavedDashboardSession();
                    window.location.assign("/");
                  }}
                >
                  Clear saved session and sign in again
                </Button>
              </div>
            </div>
          }
        />
      </Card>
    </div>
  );
}