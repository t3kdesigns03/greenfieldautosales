import type { ReactNode } from "react";

/** Top band for inner pages: eyebrow, H1, short intro. Dark, with the horizon accent. */
export default function PageHeader({
  eyebrow,
  title,
  children,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-hero-gradient">
      <div className="grain absolute inset-0" aria-hidden="true" />
      <svg
        viewBox="0 0 400 120"
        className="pointer-events-none absolute -right-10 bottom-0 hidden h-40 w-auto opacity-[0.18] sm:block"
        aria-hidden="true"
      >
        <path d="M0 70h400" className="stroke-gold" strokeWidth="2" />
        <path d="M150 120 196 70M250 120 204 70" className="stroke-fg" strokeWidth="4" strokeLinecap="round" />
        <path d="M168 70a32 32 0 0 1 64 0Z" className="fill-gold" />
      </svg>
      <div className={`container-x relative ${compact ? "py-6 md:py-9" : "py-9 md:py-14"}`}>
        <p className="eyebrow animate-rise-in">{eyebrow}</p>
        <h1
          className={`mt-2 max-w-3xl animate-rise-in font-semibold [animation-delay:60ms] ${
            compact ? "text-[30px] sm:text-[40px]" : "text-[36px] sm:text-[50px]"
          }`}
        >
          {title}
        </h1>
        {children && (
          <div className="mt-3 max-w-2xl animate-rise-in text-[17px] text-muted [animation-delay:120ms]">{children}</div>
        )}
      </div>
    </section>
  );
}
