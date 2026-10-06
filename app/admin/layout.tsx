import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/Logo";
import { LogoutButton } from "@/components/admin/AdminActions";
import { isAdmin } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: { absolute: "Inventory admin · Greenfield Auto Sales" },
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const signedIn = await isAdmin();
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/[0.08] bg-panel">
        <div className="container-x flex h-16 items-center justify-between gap-3">
          <Link href="/admin" className="flex min-h-tap items-center gap-2.5 font-semibold">
            <LogoMark className="h-10 w-auto" flags={false} />
            <span>Inventory admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <a href="/inventory" target="_blank" rel="noopener noreferrer" className="btn-ghost hidden px-4 text-[14px] sm:inline-flex">
              View site
            </a>
            {signedIn && <LogoutButton />}
          </div>
        </div>
      </header>
      <div className="container-x py-6 sm:py-8">{children}</div>
    </div>
  );
}
