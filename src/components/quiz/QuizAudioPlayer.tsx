"use client";

import React, { useRef } from "react";

// Audio recorded via MediaRecorder (webm) often reports duration as Infinity in
// Chrome until the stream is fully scanned, which shows "0:00" and breaks the
// seek bar. Seeking to a huge time forces the browser to compute the real
// duration, then we reset to the start.
export default function QuizAudioPlayer({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const fixedRef = useRef(false);

  const handleLoadedMetadata = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = event.currentTarget;
    if (fixedRef.current) return;
    if (audio.duration === Infinity || Number.isNaN(audio.duration)) {
      fixedRef.current = true;
      const handleTimeUpdate = () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.currentTime = 0;
      };
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.currentTime = 1e101;
    }
  };

  return (
    <audio
      controls
      preload="metadata"
      src={src}
      onLoadedMetadata={handleLoadedMetadata}
      className={className}
    />
  );
}
