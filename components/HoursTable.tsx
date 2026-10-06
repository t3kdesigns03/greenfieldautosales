"use client";

import { useEffect, useState } from "react";
import { site, fmtTime } from "@/content/site";
import { getOpenStatus } from "@/components/OpenStatus";

/** Full-week hours table. Highlights today (Greenfield time) once mounted. */
export default function HoursTable() {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(getOpenStatus().todayIdx), []);
  return (
    <table className="w-full text-[17px]">
      <caption className="sr-only">Business hours</caption>
      <tbody className="divide-y divide-white/10">
        {site.hours.map((h, i) => {
          const isToday = i === today;
          return (
            <tr key={h.day} className={isToday ? "bg-go/10" : undefined} aria-current={isToday ? "date" : undefined}>
              <th scope="row" className={`py-2.5 pl-3 text-left font-normal ${isToday ? "font-bold text-leaf" : "text-muted"}`}>
                {h.name}
                {isToday && <span className="ml-2 text-[13px] font-semibold uppercase tracking-wide text-leaf">Today</span>}
              </th>
              <td className={`py-2.5 pr-3 text-right ${h.open ? "font-semibold" : "text-muted"}`}>
                {h.open && h.close ? `${fmtTime(h.open)} – ${fmtTime(h.close)}` : "Closed"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
