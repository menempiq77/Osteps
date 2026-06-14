"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import SubjectRightSidebar from "@/components/ui/SubjectRightSidebar";

export default function RightSidebarReveal() {
  const [revealed, setRevealed] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const reveal = () => {
    clearHideTimer();
    setRevealed(true);
  };

  const scheduleHide = () => {
    clearHideTimer();
    hideTimer.current = setTimeout(() => setRevealed(false), 220);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setRevealed(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearHideTimer();
    };
  }, []);

  return (
    <>
      {/* Invisible hover strip pinned to the right edge */}
      <div
        className="fixed right-0 top-[78px] bottom-0 z-[700] hidden w-3.5 md:block"
        onMouseEnter={reveal}
      />

      {/* Visible pull handle (hidden while the panel is open) */}
      <button
        type="button"
        aria-label="Show subject shortcuts"
        title="Subject shortcuts"
        onMouseEnter={reveal}
        onClick={reveal}
        className={`fixed right-0 top-1/2 z-[700] hidden -translate-y-1/2 items-center gap-1 rounded-l-xl border border-r-0 border-white/10 bg-[#424253] py-3 pl-1.5 pr-1 text-white shadow-[-8px_0_20px_rgba(15,23,42,0.22)] transition md:flex ${
          revealed ? "pointer-events-none opacity-0" : "opacity-100 hover:bg-[#4c4c5e]"
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <SubjectRightSidebar
        overlayState={revealed ? "revealed" : "hidden"}
        onPointerEnter={reveal}
        onPointerLeave={scheduleHide}
      />
    </>
  );
}
