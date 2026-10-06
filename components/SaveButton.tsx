"use client";

import Icon from "@/components/Icon";
import { useSaved } from "@/lib/saved";

/** Heart toggle. Sits above stretched card links (z-[3]). */
export default function SaveButton({
  slug,
  name,
  className = "",
  variant = "overlay",
}: {
  slug: string;
  name: string;
  className?: string;
  variant?: "overlay" | "plain";
}) {
  const { isSaved, toggle } = useSaved();
  const on = isSaved(slug);
  const look =
    variant === "overlay"
      ? "bg-night/55 text-paper backdrop-blur-md hover:bg-night/75"
      : "border border-white/15 bg-panel-2 text-fg hover:border-white/30";
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from saved` : `Save ${name}`}
      className={`relative z-[3] inline-flex h-tap w-tap items-center justify-center rounded-full transition-[transform,background-color] active:scale-90 ${look} ${className}`}
    >
      <Icon name="heart" filled={on} className={`h-[22px] w-[22px] ${on ? "text-gold" : ""}`} strokeWidth={2} />
    </button>
  );
}
