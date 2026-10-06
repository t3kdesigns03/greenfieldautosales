import type { Metadata } from "next";
import Link from "next/link";
import VehicleCard from "@/components/VehicleCard";
import OpenStatus from "@/components/OpenStatus";
import Reveal from "@/components/Reveal";
import { Silhouette } from "@/components/VehicleArt";
import Icon, { type IconName } from "@/components/Icon";
import { site, telHref, smsHref, mapsLink, fullAddress } from "@/content/site";
import { home } from "@/content/copy";
import { liveVehicles, soldVehicles, bodyLabels, shortMiles } from "@/lib/inventory";
import type { Body } from "@/content/inventory";

export const metadata: Metadata = {
  title: { absolute: `${site.name} | Used Trucks, SUVs & Cars in Greenfield, Iowa` },
  description:
    "Quality used cars, trucks and SUVs from a family-owned lot in Greenfield, Iowa, selling since 2008. Browse the lot, then call (641) 329-6186, text (641) 743-2700, or stop by 503 NE 6th St.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function HomePage() {
  const vehicles = liveVehicles();
  const sold = soldVehicles();
  const featured = vehicles[0];
  const rail = vehicles.slice(0, 8);
  const bodies = (["truck", "suv", "van", "car"] as Body[])
    .map((b) => ({ b, n: vehicles.filter((v) => v.body === b).length }))
    .filter((x) => x.n > 0);
  const soldLabel = site.soldCount ? `${Math.floor(site.soldCount / 10) * 10}+` : null;

  return (
    <>
      {/* HERO ------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="grain absolute inset-0" aria-hidden="true" />
        {/* road to the horizon */}
        <svg
          viewBox="0 0 1200 400"
          preserveAspectRatio="xMidYMax slice"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] w-full opacity-[0.16]"
          aria-hidden="true"
        >
          <path d="M0 140h1200" className="stroke-gold" strokeWidth="1.5" />
          <path d="M560 140 300 400M640 140 900 400" className="stroke-fg" strokeWidth="3" />
          <path d="M600 160v24M600 210v34M600 280v50M600 360v40" className="stroke-gold" strokeWidth="4" />
        </svg>

        <div className="container-x relative grid items-center gap-10 pb-12 pt-7 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pb-20 lg:pt-14">
          <div className="animate-rise-in">
            <OpenStatus />
            <p className="eyebrow mt-5">{home.heroEyebrow}</p>
            <h1 className="mt-3 text-[38px] font-semibold leading-[1.05] xs:text-[42px] sm:text-[54px] lg:text-[62px]">
              {home.heroTitle}
            </h1>
            <p className="mt-4 max-w-lg text-[17.5px] text-muted">{home.heroSub}</p>

            <form action="/inventory" method="get" role="search" className="mt-6 flex max-w-lg gap-2">
              <label className="relative flex-1">
                <span className="sr-only">Search the lot</span>
                <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  name="q"
                  placeholder="Tundra, 4x4, diesel…"
                  className="field-input h-[52px] rounded-full bg-panel/90 pl-12 text-[16.5px]"
                  enterKeyHint="search"
                />
              </label>
              <button type="submit" className="btn-go h-[52px] px-6">
                Search
              </button>
            </form>

            <ul className="mt-4 grid max-w-lg grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Shop by type">
              {bodies.map(({ b, n }) => (
                <li key={b}>
                  <Link
                    href={`/inventory?body=${b}`}
                    className="group flex min-h-[64px] items-center gap-2.5 rounded-xl border border-white/10 bg-panel/70 px-3 py-2 backdrop-blur-md transition-colors hover:border-go/60 sm:flex-col sm:items-start sm:gap-1"
                  >
                    <Silhouette body={b} className="h-6 w-auto shrink-0 text-gold transition-transform group-hover:translate-x-0.5" />
                    <span className="text-[14.5px] font-semibold leading-tight">
                      {bodyLabels[b].many} <span className="text-muted">{n}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Every way to reach the lot, same as the original site plus text */}
            <ul className="mt-7 grid max-w-lg grid-cols-2 gap-x-6 gap-y-1 border-t border-white/[0.08] pt-5" aria-label="Contact">
              {[
                { href: telHref, icon: "phone" as IconName, label: "Call", value: site.phone.display },
                { href: smsHref(), icon: "text" as IconName, label: "Text", value: site.textPhone.display },
                { href: mapsLink, icon: "pin" as IconName, label: "Visit", value: site.address.street, external: true },
                { href: "/contact", icon: "clock" as IconName, label: "Hours", value: "Mon–Sat" },
              ].map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex min-h-[52px] items-center gap-3 rounded-lg py-1.5"
                  >
                    <Icon name={c.icon} className="h-5 w-5 shrink-0 text-leaf" />
                    <span className="leading-tight">
                      <span className="block text-[12.5px] text-muted">{c.label}</span>
                      <span className="block whitespace-nowrap text-[16px] font-semibold group-hover:text-leaf">{c.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {featured && (
            <div className="relative hidden animate-rise-in [animation-delay:140ms] lg:block">
              <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(closest-side,rgb(var(--gold)/0.18),transparent)]" aria-hidden="true" />
              <p className="eyebrow relative mb-3">Newest on the lot</p>
              <VehicleCard v={featured} className="relative" priority />
            </div>
          )}
        </div>
      </section>

      {/* FRESH-IN RAIL --------------------------------------------------- */}
      <section aria-labelledby="rail-title" className="pt-10 lg:pt-14">
        <div className="container-x flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">On the lot</p>
            <h2 id="rail-title" className="mt-1 text-[30px] font-semibold sm:text-[38px]">
              Fresh in
            </h2>
          </div>
          <Link href="/inventory" className="btn-ghost shrink-0">
            See all {vehicles.length}
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
        <ul
          className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 sm:scroll-px-6 sm:px-6 lg:scroll-px-8 lg:px-[max(2rem,calc((100%-80rem)/2+2rem))]"
          aria-label="Newest vehicles. Swipe for more."
        >
          {rail.map((v) => (
            <li key={v.slug} className="flex w-[84%] shrink-0 snap-start xs:w-[80%] sm:w-[46%] lg:w-[30%] xl:w-[23.5%]">
              <VehicleCard v={v} className="w-full" />
            </li>
          ))}
        </ul>
      </section>

      {/* PROOF POINTS ---------------------------------------------------- */}
      <section aria-labelledby="proof-title" className="container-x mt-10">
        <h2 id="proof-title" className="sr-only">
          Why buy here
        </h2>
        <ul className="grid gap-3 md:grid-cols-3 md:gap-5">
          {home.proofPoints.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 90} className="card relative overflow-hidden p-5 sm:p-6">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand/30 blur-2xl" aria-hidden="true" />
              <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15 text-gold">
                <Icon name={p.icon as IconName} className="h-6 w-6" />
              </span>
              <h3 className="relative mt-4 text-[22px] font-semibold">{p.title}</h3>
              <p className="relative mt-2 text-[15.5px] text-muted">{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* REVIEWS --------------------------------------------------------- */}
      <section aria-labelledby="reviews-title" className="container-x py-14">
        <p className="eyebrow">Word of mouth</p>
        <h2 id="reviews-title" className="mt-1 text-[30px] font-semibold sm:text-[38px]">
          {home.reviewsTitle}
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {home.reviews.map((r, i) => (
            <Reveal as="li" key={r.headline} delay={i * 80} className="card relative flex flex-col p-5">
              <span className="absolute left-5 top-0 h-[3px] w-10 rounded-b-full bg-gold" aria-hidden="true" />
              <h3 className="mt-2 text-[20px] font-semibold leading-snug">{r.headline}</h3>
              <p className="mt-2 text-[15.5px] text-muted">{r.body}</p>
              {r.attribution && (
                <p className="mt-auto pt-4 text-[14px] font-semibold text-fg/70">
                  {r.href ? (
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                      {r.attribution}
                    </a>
                  ) : (
                    r.attribution
                  )}
                </p>
              )}
            </Reveal>
          ))}
        </ul>
        <p className="mt-4 text-[13.5px] text-muted">{home.reviewsNote}</p>
      </section>

      {/* SOLD STRIP ------------------------------------------------------ */}
      {sold.length > 0 && (
        <section aria-labelledby="sold-title" className="border-y border-white/[0.06] bg-panel py-10">
          <div className="container-x flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Already gone</p>
              <h2 id="sold-title" className="mt-1 text-[26px] font-semibold sm:text-[32px]">
                Sold here{soldLabel ? `: ${soldLabel} and counting` : ""}
              </h2>
            </div>
            <p className="max-w-sm text-[15px] text-muted">Good ones go fast. If you see one you like, call.</p>
          </div>
          <ul
            className="no-scrollbar mt-6 flex gap-3 overflow-x-auto px-4 pb-1 sm:px-6 lg:px-[max(2rem,calc((100%-80rem)/2+2rem))]"
            aria-label="Vehicles that have sold"
          >
            {sold.map((s) => (
              <li
                key={s.listingId}
                className="relative flex w-[220px] shrink-0 flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-night p-4"
              >
                <Silhouette body={s.body} className="h-10 w-auto self-start text-muted" />
                <p className="mt-3 text-[15px] font-semibold leading-snug">{s.name}</p>
                <p className="truncate text-[13.5px] text-muted">{[s.trim, shortMiles(s.miles)].filter(Boolean).join(" · ")}</p>
                <span className="absolute right-3 top-3 -rotate-6 rounded border-2 border-rust-fg/80 px-1.5 py-0.5 text-[12px] font-black uppercase tracking-[0.14em] text-rust-fg">
                  Sold
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* TRADE CTA ------------------------------------------------------- */}
      <section aria-labelledby="trade-title" className="container-x mt-14">
        <Reveal className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[linear-gradient(135deg,rgb(var(--brand-deep))_0%,rgb(var(--panel))_75%)] px-5 py-10 sm:px-10 md:py-14">
          <div className="grain absolute inset-0" aria-hidden="true" />
          <svg viewBox="0 0 400 200" className="pointer-events-none absolute -right-10 bottom-0 h-40 w-auto opacity-25 sm:h-56" aria-hidden="true">
            <path d="M0 120h400" className="stroke-gold" strokeWidth="3" />
            <path d="M120 200 196 120M280 200 204 120" className="stroke-fg" strokeWidth="5" strokeLinecap="round" />
            <path d="M152 120a48 48 0 0 1 96 0Z" className="fill-gold" />
          </svg>
          <div className="relative max-w-xl">
            <p className="eyebrow">Trade-ins wanted</p>
            <h2 id="trade-title" className="mt-2 text-[32px] font-semibold sm:text-[42px]">
              {home.tradeTitle}
            </h2>
            <p className="mt-3 text-[17.5px] text-fg/80">{home.tradeBody}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/trade" className="btn-gold">
                Tell us about your vehicle
                <Icon name="arrow" className="h-5 w-5" />
              </Link>
              <a href={telHref} className="btn-ghost">
                <Icon name="phone" className="h-5 w-5" />
                Or just call
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* VISIT ----------------------------------------------------------- */}
      <section aria-labelledby="visit-title" className="container-x mt-10 grid gap-3 md:grid-cols-2 md:gap-5">
        <Reveal className="card p-5 sm:p-6">
          <h2 id="visit-title" className="text-[24px] font-semibold">
            Come see it in person
          </h2>
          <p className="mt-2 flex items-start gap-2 text-[16.5px]">
            <Icon name="pin" className="mt-1 h-5 w-5 shrink-0 text-gold" />
            {fullAddress}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="btn-go">
              Get directions
            </a>
            <Link href="/contact" className="btn-ghost">
              Hours &amp; map
            </Link>
          </div>
        </Reveal>
        <Reveal delay={90} className="card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[24px] font-semibold">Hours</h2>
            <OpenStatus />
          </div>
          <dl className="mt-3 divide-y divide-white/[0.07] text-[16.5px]">
            {site.hoursSummary.map((h) => (
              <div key={h.label} className="flex justify-between gap-4 py-2">
                <dt className="text-muted">{h.label}</dt>
                <dd className="font-semibold">{h.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>
    </>
  );
}
