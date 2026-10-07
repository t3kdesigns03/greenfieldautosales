"use client";

import { useEffect, useRef } from "react";
import Logo from "@/components/Logo";
import WavingFlags from "@/components/brand/WavingFlags";

type Props = {
  /** Heights for the badge and wordmark (Tailwind classes), like <Logo>. */
  badgeClass: string;
  wordmarkClass: string;
  /** Vertical room for the flags above/below the logo (Tailwind padding). */
  padClass?: string;
  className?: string;
};

/**
 * The standard Greenfield logo everywhere outside the header: checkered G
 * badge + GREENFIELD / AUTO SALES, with the two crossed checkered flags
 * waving behind it. Same art and motion as the header (minus the page-load
 * entrance). Hover, or tap on phones, revs it: full glow, faster flags, sparks.
 */
export default function BrandLockup({ badgeClass, wordmarkClass, padClass = "py-3", className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <span
      ref={ref}
      className={`gas-logo relative isolate inline-flex items-center px-1 ${padClass} ${className}`}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" || !ref.current) return;
        ref.current.dataset.rev = "1";
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
          if (ref.current) delete ref.current.dataset.rev;
        }, 1600);
      }}
    >
      <WavingFlags className="pointer-events-none absolute inset-y-0 -left-3 -z-10 h-full w-[calc(100%+1.5rem)] opacity-90" />
      <Logo animate badgeFlags={false} badgeClass={badgeClass} wordmarkClass={wordmarkClass} />
    </span>
  );
}
