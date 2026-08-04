"use client";

import { useEffect, useState } from "react";
import { getAuthHeader } from "@/lib/apiClient";

type Props = {
  src?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function AuthenticatedNotebookImage({ src, alt, className, style }: Props) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let nextObjectUrl: string | null = null;
    setObjectUrl(null);
    if (!src) return undefined;

    void fetch(src, { headers: getAuthHeader() })
      .then((response) => {
        if (!response.ok) throw new Error("Notebook image unavailable");
        return response.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        nextObjectUrl = URL.createObjectURL(blob);
        setObjectUrl(nextObjectUrl);
      })
      .catch(() => {
        if (!cancelled) setObjectUrl(null);
      });

    return () => {
      cancelled = true;
      if (nextObjectUrl) URL.revokeObjectURL(nextObjectUrl);
    };
  }, [src]);

  if (!objectUrl) return null;
  return <img src={objectUrl} alt={alt} className={className} style={style} />;
}
