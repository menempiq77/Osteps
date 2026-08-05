"use client";

import { useReportWebVitals } from "next/web-vitals";

const REPORTED_METRICS = new Set(["LCP", "CLS", "INP", "TTFB"]);

export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (!REPORTED_METRICS.has(metric.name)) return;

    const body = JSON.stringify({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      rating: metric.rating,
      navigationType: metric.navigationType,
      pathname: window.location.pathname,
    });
    const endpoint = "/api/web-vitals";

    if (
      navigator.sendBeacon?.(
        endpoint,
        new Blob([body], { type: "application/json" })
      )
    ) {
      return;
    }

    void fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  });

  return null;
}
