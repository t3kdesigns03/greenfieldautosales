/**
 * Greenfield Auto Sales logo — inline SVG, no image request.
 *
 * Mark: a road running to the horizon under a low sun. The two road edges
 * draw in once when the page first loads (CSS animation, so it does not
 * replay on client-side navigation because the header persists).
 * prefers-reduced-motion: the global rule in globals.css collapses the
 * animation so the mark is static.
 */
import type { CSSProperties } from "react";

type Props = {
  /** "full" = mark + wordmark, "mark" = square mark only */
  variant?: "full" | "mark";
  /** "dark" text on light backgrounds, "light" text on green */
  tone?: "dark" | "light";
  /** Draw the road on mount. Turn off for repeated marks (footer, icons). */
  animate?: boolean;
  className?: string;
};

export function LogoMark({
  animate = false,
  className,
  title,
}: {
  animate?: boolean;
  className?: string;
  title?: string;
}) {
  const draw = animate ? "animate-draw-road" : "";
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect width="48" height="48" rx="12" className="fill-brand" />
      {/* low sun, sitting on the horizon */}
      <path d="M15.5 21a8.5 8.5 0 0 1 17 0Z" className="fill-gold" />
      {/* horizon */}
      <path d="M6 21h36" className="stroke-cream" strokeWidth="2" strokeLinecap="round" />
      {/* field rows */}
      <path
        d="M6 27.5 18 24M42 27.5 30 24M6 34 15.5 28.5M42 34 32.5 28.5"
        className="stroke-brand-deep"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* road edges — these draw in, both at once */}
      {["M11 42 22.6 21.6", "M37 42 25.4 21.6"].map((d) => (
        <path
          key={d}
          d={d}
          className={`stroke-cream ${draw}`}
          strokeWidth="2.4"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          style={animate ? ({ ["--dash" as string]: "1", strokeDashoffset: 1 } as CSSProperties) : undefined}
        />
      ))}
      {/* center line */}
      <path
        d="M24 41v-3.5M24 34.5v-2.6M24 29.4v-1.8M24 25.6v-1"
        className={`stroke-gold ${animate ? "animate-fade-in [animation-delay:1100ms]" : ""}`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo({ variant = "full", tone = "dark", animate = false, className }: Props) {
  if (variant === "mark") {
    return <LogoMark animate={animate} className={className} title="Greenfield Auto Sales" />;
  }
  const main = tone === "light" ? "text-paper" : "text-brand-deep";
  const sub = tone === "light" ? "text-gold" : "text-brand";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark animate={animate} className="h-10 w-10 shrink-0" />
      <span className="flex flex-col leading-none" aria-hidden="true">
        <span className={`font-display text-[19px] font-bold tracking-[0.04em] ${main}`}>GREENFIELD</span>
        <span className={`mt-1 font-sans text-[10.5px] font-semibold tracking-[0.34em] ${sub}`}>AUTO SALES</span>
      </span>
      <span className="sr-only">Greenfield Auto Sales</span>
    </span>
  );
}
