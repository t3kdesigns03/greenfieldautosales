"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";
import { site, telHref, smsHref } from "@/content/site";

/**
 * Sticky call bar — always visible under 768px. Hidden on md+ where the
 * header carries the phone number. Vehicle pages render their own version
 * (with price + a pre-filled text), so this one steps aside there.
 * Body has matching bottom padding (globals.css) so it never covers content.
 */
export default function CallBar() {
  const pathname = usePathname();
  if (/^\/inventory\/[^/]+$/.test(pathname)) return null;
  return <CallBarShell />;
}

export function CallBarShell({ textBody, children }: { textBody?: string; children?: ReactNode }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-panel/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      role="region"
      aria-label="Call or text Greenfield Auto Sales"
    >
      <div className="mx-auto flex h-[var(--callbar-h)] max-w-xl items-center gap-2 px-3">
        {children}
        <a
          href={telHref}
          className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full bg-go px-4 text-[16.5px] font-bold text-white shadow-[0_8px_24px_-12px_rgb(var(--go)/0.9)] active:scale-[0.98]"
        >
          <Icon name="phone" className="h-5 w-5" strokeWidth={2.2} />
          <span>
            <span className="hidden xs:inline">Call </span>
            {children ? "us" : site.phone.display}
          </span>
        </a>
        <a
          href={smsHref(textBody)}
          className="flex min-h-[48px] min-w-[72px] items-center justify-center gap-1.5 rounded-full border border-white/20 px-3 text-[16px] font-semibold text-fg active:scale-[0.98]"
          aria-label={`Text ${site.textPhone.display}`}
        >
          <Icon name="text" className="h-5 w-5" />
          Text
        </a>
      </div>
    </div>
  );
}
