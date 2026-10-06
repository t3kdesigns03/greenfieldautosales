"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

/** Copy a value (e.g. the VIN) to the clipboard. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {
          /* clipboard blocked; the value is visible to select by hand */
        }
      }}
      className="inline-flex min-h-tap items-center gap-1.5 rounded-full px-3 text-[14px] font-semibold text-leaf hover:bg-white/[0.06]"
      aria-label={done ? `${label} copied` : `Copy ${label}`}
    >
      <Icon name={done ? "check" : "copy"} className="h-4 w-4" />
      {done ? "Copied" : "Copy"}
    </button>
  );
}

/** Native share sheet on phones; copies the link elsewhere. */
export function ShareButton({ title }: { title: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const url = window.location.href;
        try {
          if (navigator.share) await navigator.share({ title, url });
          else {
            await navigator.clipboard.writeText(url);
            setDone(true);
            setTimeout(() => setDone(false), 1600);
          }
        } catch {
          /* user cancelled */
        }
      }}
      className="inline-flex h-tap items-center gap-1.5 rounded-full px-3 text-[14.5px] font-semibold text-fg hover:bg-white/[0.06]"
    >
      <Icon name={done ? "check" : "share"} className="h-5 w-5" />
      {done ? "Link copied" : "Share"}
    </button>
  );
}
