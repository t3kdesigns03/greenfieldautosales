"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import { site, telHref, fullAddress } from "@/content/site";
import { useSaved } from "@/lib/saved";

/**
 * One shared header (dark).
 * Under 768px: badge + wordmark, saved, call icon, menu. Menu opens a sheet.
 * 768px+: badge + wordmark, nav, saved, phone button.
 *
 * The mobile menu is rendered as a SIBLING of <header>, not inside it:
 * the header uses backdrop-filter, which would trap a fixed child inside
 * the 60px bar.
 */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const { saved } = useSaved();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const savedHref = "/inventory?saved=1";

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-200 ${
          scrolled || open ? "border-white/[0.08] bg-night/85 backdrop-blur-xl" : "border-transparent bg-night"
        }`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-go focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>

        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-2">
          <Link href="/" className="flex min-h-tap min-w-0 items-center" aria-label="Greenfield Auto Sales, home">
            {/* Phones: same badge + prismatic wordmark, scaled to fit 320px next to three 44px buttons */}
            <Logo
              animate
              className="md:hidden"
              badgeClass="h-10 w-auto xs:h-[46px]"
              wordmarkClass="h-6 w-auto xs:h-[34px]"
            />
            <Logo animate className="hidden md:inline-flex" badgeClass="h-[62px] w-auto" wordmarkClass="h-[48px] w-auto" />
          </Link>

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`relative inline-flex min-h-tap items-center rounded-full px-3 text-[15px] font-semibold transition-colors lg:px-3.5 ${
                      isActive(item.href) ? "text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-gold lg:inset-x-3.5" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-0 xs:gap-1">
            <Link
              href={savedHref}
              className="relative inline-flex h-tap w-tap items-center justify-center rounded-full text-fg hover:bg-white/[0.06]"
              aria-label={`Saved vehicles${saved.length ? ` (${saved.length})` : ""}`}
            >
              <Icon name="heart" filled={saved.length > 0} className={`h-[22px] w-[22px] ${saved.length ? "text-gold" : ""}`} />
              {saved.length > 0 && (
                <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-night">
                  {saved.length}
                </span>
              )}
            </Link>
            <a href={telHref} className="btn-go ml-1 hidden md:inline-flex">
              <Icon name="phone" className="h-[18px] w-[18px]" />
              {site.phone.display}
            </a>
            <a
              href={telHref}
              className="inline-flex h-tap w-tap items-center justify-center rounded-full text-leaf hover:bg-white/[0.06] md:hidden"
              aria-label={`Call ${site.phone.display}`}
            >
              <Icon name="phone" className="h-[22px] w-[22px]" />
            </a>
            <button
              ref={menuBtn}
              type="button"
              className="inline-flex h-tap w-tap items-center justify-center rounded-full text-fg hover:bg-white/[0.06] md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu sheet — below the header, above content, call bar stays visible */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-[calc(var(--callbar-h)+env(safe-area-inset-bottom))] top-[var(--header-h)] z-40 overflow-y-auto bg-night md:hidden"
      >
        <nav aria-label="Mobile" className="container-x py-3">
          <ul className="divide-y divide-white/[0.08]">
            {[{ href: "/", label: "Home" }, ...site.nav].map((item, i) => (
              <li key={item.href} className="animate-rise-in" style={{ animationDelay: `${i * 35}ms` }}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`flex min-h-[58px] items-center justify-between font-display text-[25px] font-semibold ${
                    pathname === item.href ? "text-leaf" : "text-fg"
                  }`}
                >
                  {item.label}
                  <Icon name="chevR" className="h-5 w-5 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-card border border-white/[0.08] bg-panel p-4 text-[15px]">
            <p className="font-semibold">{fullAddress}</p>
            <ul className="mt-2 space-y-0.5 text-muted">
              {site.hoursSummary.map((h) => (
                <li key={h.label} className="flex justify-between gap-4">
                  <span>{h.label}</span>
                  <span className="text-fg">{h.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}
