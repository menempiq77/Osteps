import type { SVGProps } from "react";

export default function PrayerBeadsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="7.2" cy="5.1" r="1.55" />
      <circle cx="11.9" cy="3.8" r="1.55" />
      <circle cx="16.6" cy="5.1" r="1.55" />
      <circle cx="19.5" cy="8.9" r="1.55" />
      <circle cx="18.8" cy="13.6" r="1.55" />
      <circle cx="5.1" cy="13.6" r="1.55" />
      <circle cx="4.4" cy="8.9" r="1.55" />
      <path d="M6.2 16.1c1.4 2.2 3.3 3.2 5.8 3.2s4.4-1 5.8-3.2" />
      <path d="M12 19.3v2.1" />
      <path d="M10.4 22h3.2" />
    </svg>
  );
}
