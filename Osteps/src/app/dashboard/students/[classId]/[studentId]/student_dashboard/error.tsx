"use client";

import { Alert, Button, Card } from "antd";

export default function StudentDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <Card>
        <Alert
          type="error"
          showIcon
          message="Student dashboard failed to load"
          description={error?.message || "Unexpected client error."}
        />
        <div className="mt-4">
          <Button type="primary" onClick={reset}>
            Retry
          </Button>
        </div>
      </Card>
    </div>
  );
}

