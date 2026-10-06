"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Renders public-site chrome (header, footer, call bar) everywhere except /admin. */
export default function PublicOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;
  return <>{children}</>;
}
