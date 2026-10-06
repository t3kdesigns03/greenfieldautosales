"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** "Mark sold" (with a confirm step) and "Relist" buttons on the admin list. */
export function StatusButton({
  slug,
  to,
  label,
  confirmLabel,
}: {
  slug: string;
  to: "available" | "sold";
  label: string;
  confirmLabel?: string;
}) {
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/vehicles/${encodeURIComponent(slug)}/status`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: to }),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    setBusy(false);
    setArmed(false);
    if (!res.ok) setError(json.error ?? "Didn't save.");
    else router.refresh();
  }

  if (armed && confirmLabel) {
    return (
      <span className="inline-flex items-center gap-1">
        <button type="button" className="btn-go px-4 text-[14px]" onClick={run} disabled={busy}>
          {busy ? "Saving…" : confirmLabel}
        </button>
        <button type="button" className="btn-ghost px-3 text-[14px]" onClick={() => setArmed(false)}>
          Cancel
        </button>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        className="btn-ghost px-4 text-[14px]"
        onClick={() => (confirmLabel ? setArmed(true) : run())}
        disabled={busy}
      >
        {busy ? "Saving…" : label}
      </button>
      {error && <span className="text-[13px] text-rust-fg">{error}</span>}
    </span>
  );
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="btn-ghost px-4 text-[14px]"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
