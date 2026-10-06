"use client";

import { useEffect, useState } from "react";
import { site, fmtTime } from "@/content/site";

const TZ = "America/Chicago";

function nowInGreenfield() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: get("weekday"), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export function getOpenStatus() {
  const { day, minutes } = nowInGreenfield();
  const idx = site.hours.findIndex((h) => h.day === day);
  const today = site.hours[idx];
  if (today?.open && today.close && minutes >= toMin(today.open) && minutes < toMin(today.close)) {
    return { open: true, label: `Open now · until ${fmtTime(today.close)}`, todayIdx: idx };
  }
  // Find the next opening (later today, or a following day)
  for (let i = 0; i < 7; i++) {
    const d = site.hours[(idx + i) % 7];
    if (!d.open) continue;
    if (i === 0 && minutes >= toMin(d.open)) continue;
    const when = i === 0 ? "today" : i === 1 ? "tomorrow" : d.name;
    return { open: false, label: `Closed · opens ${when} ${fmtTime(d.open)}`, todayIdx: idx };
  }
  return { open: false, label: "Closed", todayIdx: idx };
}

/** Live "Open now / Closed" pill, computed in Greenfield's time zone. */
export default function OpenStatus({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [status, setStatus] = useState<ReturnType<typeof getOpenStatus> | null>(null);

  useEffect(() => {
    setStatus(getOpenStatus());
    const id = setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => clearInterval(id);
  }, []);

  const base =
    tone === "light" ? "border-white/20 bg-white/10 text-paper" : "border-white/10 bg-white/[0.05] text-fg";

  return (
    <span
      className={`inline-flex min-h-[32px] items-center gap-2 rounded-full border px-3 text-[14px] font-semibold ${base}`}
      aria-live="polite"
    >
      <span
        className={`relative h-2.5 w-2.5 rounded-full ${
          status === null ? "bg-current opacity-30" : status.open ? "bg-signal" : "bg-gold"
        }`}
      >
        {status?.open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
        )}
      </span>
      {status ? status.label : "Hours: Mon–Sat"}
    </span>
  );
}
