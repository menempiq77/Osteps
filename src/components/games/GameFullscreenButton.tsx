"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  exitDocumentFullscreenIfActive,
  isDocumentFullscreenActive,
  isDocumentFullscreenSupported,
  requestDocumentFullscreenFromGesture,
} from "@/lib/browserFullscreen";

type GameFullscreenButtonProps = {
  variant?: "light" | "dark";
};

export default function GameFullscreenButton({
  variant = "light",
}: GameFullscreenButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const updateState = () => setIsActive(isDocumentFullscreenActive());
    setIsSupported(isDocumentFullscreenSupported());
    updateState();
    document.addEventListener("fullscreenchange", updateState);
    document.addEventListener("webkitfullscreenchange", updateState);
    return () => {
      document.removeEventListener("fullscreenchange", updateState);
      document.removeEventListener("webkitfullscreenchange", updateState);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (isActive) {
      await exitDocumentFullscreenIfActive();
    } else {
      await requestDocumentFullscreenFromGesture();
    }
    setIsActive(isDocumentFullscreenActive());
  };

  const colors =
    variant === "dark"
      ? "border-white/15 bg-white/[0.08] text-white hover:bg-white/[0.14]"
      : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700";

  return (
    <button
      type="button"
      onClick={() => void toggleFullscreen()}
      disabled={!isSupported}
      className={`inline-flex h-10 items-center gap-2 rounded-2xl border px-3 text-xs font-black shadow-sm transition disabled:cursor-not-allowed disabled:opacity-45 ${colors}`}
      aria-label={isActive ? "Exit full screen" : "Enter full screen"}
      title={
        isSupported
          ? isActive
            ? "Exit full screen"
            : "Play in full screen"
          : "Full screen is not supported by this browser"
      }
    >
      {isActive ? (
        <Minimize2 className="h-4 w-4" />
      ) : (
        <Maximize2 className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">
        {isActive ? "Exit full screen" : "Full screen"}
      </span>
    </button>
  );
}
