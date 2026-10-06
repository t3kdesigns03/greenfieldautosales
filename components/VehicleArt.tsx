import type { Body } from "@/content/inventory";
import Icon from "@/components/Icon";

/**
 * Branded "no photo yet" placeholder: a plain side profile by body type on a
 * dark horizon. Clearly a placeholder, never mistaken for the actual unit.
 */
export const bodies: Record<Body, { body: string; glass: string; wheels: [number, number] }> = {
  car: {
    body: "M14 66c0-9 3-13 12-15l20-4 22-15c5-3 10-4 16-4h34c7 0 12 2 17 6l15 13 22 4c7 1 10 5 10 11v4H14Z",
    glass: "M72 46l16-11c3-2 6-3 10-3h12v14Zm44 0V32h18c4 0 7 1 10 4l10 10Z",
    wheels: [52, 150],
  },
  suv: {
    body: "M12 66V50c0-5 3-8 8-9l20-3 16-17c3-3 6-4 10-4h86c6 0 10 2 13 6l12 16 8 2c5 1 7 4 7 9v16Z",
    glass: "M62 38l12-13c2-2 4-3 7-3h29v16Zm54 0V22h32c3 0 5 1 7 3l9 13Z",
    wheels: [50, 152],
  },
  truck: {
    body: "M12 66V48c0-5 3-8 8-9l30-3 14-18c2-3 5-4 9-4h34c4 0 6 2 6 6v20h76c4 0 6 2 6 6v20Z",
    glass: "M66 36l11-14c1-2 3-2 5-2h22v16Z",
    wheels: [46, 156],
  },
  van: {
    body: "M12 66V40c0-5 2-9 6-12l20-14c3-2 6-3 10-3h128c6 0 10 4 10 10v45Z",
    glass: "M28 36l15-12c2-2 4-2 6-2h21v14Zm50 0V22h28v14Zm36 0V22h28v14Z",
    wheels: [46, 156],
  },
};

export function Silhouette({
  body,
  className = "",
  tone = "bright",
}: {
  body: Body;
  className?: string;
  /** "faint" for big placeholder art, "bright" for small icons */
  tone?: "faint" | "bright";
}) {
  const b = bodies[body];
  const faint = tone === "faint";
  return (
    <svg viewBox="0 0 200 84" className={className} aria-hidden="true">
      <path d={b.body} className={faint ? "fill-white/[0.09]" : "fill-current opacity-80"} />
      <path d={b.glass} className={faint ? "fill-white/[0.07]" : "fill-night/60"} />
      {b.wheels.map((x) => (
        <g key={x}>
          <circle cx={x} cy="66" r="12.5" className="fill-night" />
          <circle cx={x} cy="66" r="12.5" className={faint ? "fill-none stroke-white/15" : "fill-none stroke-current opacity-80"} strokeWidth={faint ? 2 : 4} />
          <circle cx={x} cy="66" r="4.5" className={faint ? "fill-white/15" : "fill-current opacity-80"} />
        </g>
      ))}
    </svg>
  );
}

export default function VehicleArt({
  body,
  className = "",
  label = true,
  size = "md",
}: {
  body: Body;
  className?: string;
  label?: boolean;
  size?: "md" | "lg";
}) {
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,rgb(var(--panel-3))_0%,rgb(var(--panel))_70%)] ${className}`}
    >
      <div className="absolute inset-x-0 top-[62%] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <Silhouette body={body} tone="faint" className={size === "lg" ? "relative w-[62%] max-w-[420px]" : "relative w-[64%]"} />
      {label && (
        <p className="relative mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-muted">
          <Icon name="camera" className="h-4 w-4" />
          Photos coming soon
        </p>
      )}
    </div>
  );
}
