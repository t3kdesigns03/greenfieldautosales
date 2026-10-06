import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import VehicleCard from "@/components/VehicleCard";
import SaveButton from "@/components/SaveButton";
import OpenStatus from "@/components/OpenStatus";
import Icon, { type IconName } from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import NoBreak from "@/components/NoBreak";
import { CallBarShell } from "@/components/CallBar";
import { CopyButton, ShareButton } from "@/components/ShareCopy";
import { site, telHref, smsHref, fullAddress } from "@/content/site";
import {
  liveVehicles,
  getVehicle,
  formatPrice,
  bodyLabels,
  stateNames,
  isHighMiles,
  keyFeatures,
} from "@/lib/inventory";
import { vehicleSchema } from "@/lib/schema";

type Props = { params: Promise<{ slug: string }> };

/** Only live (not sold) units are prebuilt. Sold or unknown slugs hit notFound() below. */

export function generateStaticParams() {
  return liveVehicles().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const v = getVehicle(slug);
  if (!v) return {};
  const price = formatPrice(v.price);
  const miles = v.miles !== null ? `, ${v.miles.toLocaleString("en-US")} miles` : "";
  const extra = [v.drivetrain, v.engine].filter(Boolean).join(", ");
  return {
    title: `${v.title} for Sale in Greenfield, IA`,
    description: `Used ${v.title}${miles}${extra ? ` (${extra})` : ""}. ${price}. At ${site.name} in ${site.address.city}, Iowa. Call ${site.phone.display}.`,
    alternates: { canonical: `/inventory/${v.slug}` },
    openGraph: {
      url: `/inventory/${v.slug}`,
      title: `${v.title} · ${price}`,
      ...(v.images[0] && { images: [{ url: v.images[0].src, width: v.images[0].width, height: v.images[0].height }] }),
    },
  };
}

const featureIcon: Record<string, IconName> = {
  phone: "phone", key: "key", flame: "flame", gauge: "gauge", road: "road", camera: "camera", bolt: "bolt",
  door: "door", step: "step", hitch: "hitch", mountain: "mountain", seat: "seat", radio: "radio", sun: "sun",
  wrench: "wrench", wheel: "wheel", box: "box",
};

export default async function VehiclePage({ params }: Props) {
  const { slug } = await params;
  const v = getVehicle(slug);
  if (!v) notFound();

  const quick: { icon: IconName; label: string; value: string }[] = [
    { icon: "gauge", label: "Miles", value: v.miles !== null ? v.miles.toLocaleString("en-US") : "Ask" },
    ...(v.drivetrain ? [{ icon: "drive" as IconName, label: "Drivetrain", value: v.drivetrain }] : []),
    ...(v.engine ? [{ icon: "engine" as IconName, label: "Engine", value: v.engine }] : []),
    ...(v.transmission ? [{ icon: "gear" as IconName, label: "Transmission", value: v.transmission }] : []),
    ...(v.mpg ? [{ icon: "fuel" as IconName, label: "MPG", value: `${v.mpg.city} city / ${v.mpg.hwy} hwy` }] : []),
    ...(v.fuel && !v.mpg ? [{ icon: "fuel" as IconName, label: "Fuel", value: v.fuel }] : []),
  ];

  const specs: [string, string | undefined][] = [
    ["Year", String(v.year)],
    ["Make", v.make],
    ["Model", v.model],
    ["Trim", v.trim],
    ["Body", v.bodyStyle ?? bodyLabels[v.body].one],
    ["Miles", v.miles !== null ? v.miles.toLocaleString("en-US") : undefined],
    ["Engine", v.engine],
    ["Transmission", v.transmission],
    ["Drivetrain", v.drivetrain],
    ["Fuel", v.fuel],
    ["MPG", v.mpg ? `${v.mpg.city} city / ${v.mpg.hwy} highway` : undefined],
    ["Exterior", v.exterior],
    ["Interior", v.interior],
    ["Doors", v.doors ? String(v.doors) : undefined],
    ["Seats", v.seats ? String(v.seats) : undefined],
    ["Title", v.titleStatus ? `${v.titleStatus} (per listing)` : undefined],
  ];
  const shownSpecs = specs.filter((s): s is [string, string] => Boolean(s[1]));
  const keys = keyFeatures(v);

  const others = liveVehicles()
    .filter((o) => o.slug !== v.slug)
    .sort((a, b) => Number(b.body === v.body) - Number(a.body === v.body) || b.listingId - a.listingId)
    .slice(0, 3);

  const textBody = `Hi, is the ${v.title}${typeof v.price === "number" ? ` (${formatPrice(v.price)})` : ""} still available?`;

  const badges = [
    ...(v.isNew ? [{ text: "New arrival", cls: "bg-gold text-night" }] : []),
    ...(v.titleStatus === "Clean" ? [{ text: "Clean title", cls: "bg-white/[0.08] text-fg" }] : []),
    ...(v.origin ? [{ text: `From ${stateNames[v.origin] ?? v.origin}`, cls: "bg-white/[0.08] text-fg" }] : []),
    ...(v.highlights?.some((h) => /no rust/i.test(h)) ? [{ text: "No rust (per seller)", cls: "bg-go/15 text-leaf" }] : []),
  ];

  return (
    <>
      <JsonLd data={vehicleSchema(v)} />

      <div className="container-x flex items-center justify-between pt-2">
        <Link
          href="/inventory"
          className="inline-flex min-h-tap items-center gap-1 text-[15px] font-semibold text-muted hover:text-fg"
        >
          <Icon name="chevL" className="h-5 w-5" />
          All inventory
        </Link>
        <ShareButton title={`${v.title} · ${formatPrice(v.price)}`} />
      </div>

      <div className="container-x grid gap-6 pb-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        {/* Gallery — full-bleed on phones */}
        <div className="-mx-4 sm:mx-0 lg:col-start-1 lg:row-start-1">
          <Gallery images={v.images} body={v.body} name={v.name} listingUrl={v.carsForSaleUrl} />
        </div>

        {/* Price + CTA panel — under the gallery on phones, pinned on the right on desktop */}
        <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1" aria-label="Price and contact">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+20px)]">
            <div className="lg:card lg:p-6">
              {badges.length > 0 && (
                <ul className="mb-3 flex flex-wrap gap-1.5">
                  {badges.map((b) => (
                    <li key={b.text} className={`rounded-full px-2.5 py-1 text-[12px] font-bold uppercase tracking-[0.06em] ${b.cls}`}>
                      {b.text}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-start justify-between gap-3">
                <h1 className="font-sans text-[26px] font-bold leading-tight tracking-tight sm:text-[30px]">
                  <NoBreak text={v.name} />
                  {v.trim && <span className="mt-0.5 block text-[17px] font-semibold text-muted">{v.trim}</span>}
                </h1>
                <SaveButton slug={v.slug} name={v.name} variant="plain" className="shrink-0" />
              </div>
              <p className="mt-1 text-[15.5px] text-muted">
                {[v.miles !== null ? `${v.miles.toLocaleString("en-US")} miles` : null, v.exterior, v.drivetrain]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className={`mt-4 font-display font-bold text-leaf ${v.price === "call" ? "text-[30px]" : "text-[44px] leading-none"}`}>
                {formatPrice(v.price)}
              </p>
              {v.price !== "call" && <p className="mt-1.5 text-[13.5px] text-muted">Asking price, before tax and title.</p>}

              <div className="mt-5 grid gap-2.5">
                <a href={telHref} className="btn-go text-[17px]">
                  <Icon name="phone" className="h-5 w-5" />
                  Call {site.phone.display}
                </a>
                <a href={smsHref(textBody)} className="btn-ghost text-[17px]">
                  <Icon name="text" className="h-5 w-5" />
                  Text about this {bodyLabels[v.body].one === "SUV" ? "SUV" : bodyLabels[v.body].one.toLowerCase()}
                </a>
                {v.carsForSaleUrl && (
                  <a
                    href={v.carsForSaleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-tap items-center justify-center gap-1.5 text-[15px] font-semibold text-muted hover:text-fg"
                  >
                    View original listing
                    <Icon name="external" className="h-4 w-4" />
                    <span className="sr-only">(opens Carsforsale)</span>
                  </a>
                )}
              </div>

              <div className="mt-5 hidden rounded-xl bg-white/[0.04] p-4 text-[14.5px] lg:block">
                <div className="flex flex-col items-start gap-2">
                  <span className="font-semibold">See it on the lot</span>
                  <OpenStatus />
                </div>
                <p className="mt-2 text-muted">{fullAddress}</p>
                <Link href="/contact" className="mt-1 inline-flex min-h-tap items-center gap-1 font-semibold text-leaf hover:underline">
                  Hours &amp; directions <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Details */}
        <div className="min-w-0 space-y-6 lg:col-start-1 lg:row-start-2">
          {/* At-a-glance strip */}
          <section aria-label="At a glance">
            <ul className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 xl:grid-cols-5">
              {quick.map((q) => (
                <li key={q.label} className="min-w-[150px] shrink-0 rounded-xl border border-white/[0.07] bg-panel p-3.5 sm:min-w-0">
                  <Icon name={q.icon} className="h-5 w-5 text-gold" />
                  <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.1em] text-muted">{q.label}</p>
                  <p className="mt-0.5 text-[15px] font-semibold leading-snug">{q.value}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Seller's notes */}
          {(v.highlights?.length || v.description || v.caveat) && (
            <section className="card p-5 sm:p-6" aria-labelledby="notes-title">
              <h2 id="notes-title" className="text-[24px] font-semibold">
                Seller&apos;s notes
              </h2>
              {v.highlights && (
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {v.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-[16px]">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-go/20 text-leaf">
                        <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.6} />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              {v.caveat && (
                <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-rust/50 bg-rust/15 p-3 text-[15.5px] text-rust-fg">
                  <Icon name="info" className="mt-0.5 h-5 w-5 shrink-0" />
                  {v.caveat}
                </p>
              )}
              {v.description && (
                <blockquote className="mt-5 border-l-2 border-gold pl-4 text-[16px] leading-relaxed text-fg/85">
                  {v.description}
                  <footer className="mt-2 text-[13.5px] text-muted">From the listing</footer>
                </blockquote>
              )}
            </section>
          )}

          {isHighMiles(v) && (
            <aside className="flex gap-3 rounded-card border border-gold/40 bg-gold/[0.08] p-4" aria-label="A note about miles">
              <Icon name="wrench" className="mt-0.5 h-6 w-6 shrink-0 text-gold" />
              <div className="text-[15.5px]">
                <p className="font-bold">A note on the miles</p>
                <p className="mt-1 text-fg/80">
                  This one has {v.miles!.toLocaleString("en-US")} miles. Ask us what we know about its history,
                  and you&apos;re welcome to bring your own mechanic before you buy.
                </p>
              </div>
            </aside>
          )}

          {/* Features */}
          {(keys.length > 0 || (v.features && v.features.length > 0)) && (
            <section className="card p-5 sm:p-6" aria-labelledby="features-title">
              <h2 id="features-title" className="text-[24px] font-semibold">
                Features
              </h2>
              {keys.length > 0 && (
                <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
                  {keys.map((k) => (
                    <li key={k.label} className="flex items-center gap-2.5 rounded-xl bg-white/[0.04] px-3 py-3 text-[14.5px] font-semibold">
                      <Icon name={featureIcon[k.icon] ?? "check"} className="h-5 w-5 shrink-0 text-gold" />
                      {k.label}
                    </li>
                  ))}
                </ul>
              )}
              {v.features && v.features.length > 0 && (
                <details className="group mt-4">
                  <summary className="inline-flex min-h-tap cursor-pointer list-none items-center gap-1.5 font-semibold text-leaf">
                    All {v.features.length} listed features
                    <Icon name="chevD" className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="mt-3 columns-1 gap-8 text-[14.5px] text-fg/80 sm:columns-2">
                    {v.features.map((f) => (
                      <li key={f} className="break-inside-avoid border-b border-white/[0.05] py-1.5">
                        {f}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </section>
          )}

          {/* Specs */}
          <section className="card p-5 sm:p-6" aria-labelledby="specs-title">
            <h2 id="specs-title" className="text-[24px] font-semibold">
              Specs
            </h2>
            <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8">
              {shownSpecs.map(([k, val]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-white/[0.06] py-2.5">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-semibold">{val}</dd>
                </div>
              ))}
            </dl>
            {v.vin && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/[0.04] px-4 py-2">
                <div className="min-w-0">
                  <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-muted">VIN</p>
                  <p className="break-all font-mono text-[15px] tracking-wide">{v.vin}</p>
                </div>
                <CopyButton value={v.vin} label="VIN" />
              </div>
            )}
            <p className="mt-4 text-[13.5px] text-muted">
              Details come from our listing. Confirm anything that matters to you with us before you drive out.
            </p>
          </section>

          {/* How buying works */}
          <section className="rounded-card border border-white/[0.07] bg-[linear-gradient(135deg,rgb(var(--brand)/0.25),transparent_60%)] p-5 sm:p-6">
            <h2 className="text-[22px] font-semibold">How buying works here</h2>
            <ul className="mt-3 grid gap-3 text-[15.5px] sm:grid-cols-3">
              {(
                [
                  ["eye", "Come look it over during open hours."],
                  ["wrench", "Bring your mechanic, or take it to one."],
                  ["bank", "Pay cash or with a loan from your own bank."],
                ] as [IconName, string][]
              ).map(([icon, text]) => (
                <li key={text} className="flex gap-2.5">
                  <Icon name={icon} className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  {text}
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-3 inline-flex min-h-tap items-center gap-1 font-semibold text-leaf hover:underline">
              More about the lot <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>

      {others.length > 0 && (
        <section className="container-x mt-10" aria-labelledby="more-title">
          <div className="flex items-end justify-between gap-4">
            <h2 id="more-title" className="text-[28px] font-semibold">
              Also on the lot
            </h2>
            <Link href="/inventory" className="hidden min-h-tap items-center gap-1 font-semibold text-leaf hover:underline sm:inline-flex">
              See all <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug} className="flex">
                <VehicleCard v={o} className="w-full" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Phone sticky bar for this vehicle */}
      <CallBarShell textBody={textBody}>
        <div className="mr-1 min-w-0 shrink-0 leading-tight">
          <p className={`font-display font-bold text-leaf ${v.price === "call" ? "text-[15px]" : "text-[21px]"}`}>
            {v.price === "call" ? "Call" : formatPrice(v.price)}
          </p>
          <p className="max-w-[92px] truncate text-[11.5px] text-muted">
            {v.year} {v.model}
          </p>
        </div>
      </CallBarShell>
    </>
  );
}
