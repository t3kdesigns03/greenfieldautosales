"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="card mx-auto mt-16 max-w-sm space-y-4 p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ password }),
        });
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        if (res.ok) {
          router.refresh();
        } else {
          setError(json.error ?? "Sign-in failed.");
          setBusy(false);
        }
      }}
    >
      <h1 className="text-[26px] font-semibold">Inventory admin</h1>
      <div>
        <label htmlFor="admin-password" className="field-label">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          className="field-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
        />
      </div>
      {error && (
        <p role="alert" className="text-[15px] font-semibold text-rust-fg">
          {error}
        </p>
      )}
      <button type="submit" className="btn-go w-full" disabled={busy || !password}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
