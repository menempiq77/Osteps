"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  fallbackTitle?: string;
};

type State = {
  hasError: boolean;
  errorMessage: string;
};

export default class ClientErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: "",
    };
  }

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    console.error("ClientErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            border: "1px solid rgba(239,68,68,0.35)",
            background: "#fef2f2",
            color: "#7f1d1d",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "8px" }}>
            {this.props.fallbackTitle ?? "This section failed to load"}
          </div>
          <div style={{ fontWeight: 600, lineHeight: 1.7 }}>
            {this.state.errorMessage || "Unknown client-side error."}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
