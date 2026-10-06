"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import VehicleArt from "@/components/VehicleArt";
import SaveButton from "@/components/SaveButton";
import Icon from "@/components/Icon";
import NoBreak from "@/components/NoBreak";
import { formatPrice, shortMiles, stateNames, type LiveVehicle } from "@/lib/inventory";

const MAX_CARD_PHOTOS = 6;

/**
 * Inventory card, Carvana-style: photo first (swipe through photos right in
 * the card), then name, trim · miles, and a big price.
 *
 * The whole card links to the detail page. The photo strip sits above the
 * stretched link so it can still be swiped; each photo is its own link.
 */
export default function VehicleCard({
  v,
  headingLevel = "h3",
  className = "",
  priority = false,
}: {
  v: LiveVehicle;
  headingLevel?: "h2" | "h3";
  className?: string;
  priority?: boolean;
}) {
  const Heading = headingLevel;
  const href = `/inventory/${v.slug}`;
  const photos = v.images.slice(0, MAX_CARD_PHOTOS);
  const scroller = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const go = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  const tags = [v.drivetrain, v.fuel === "Diesel" ? "Diesel" : undefined, v.origin ? `From ${stateNames[v.origin] ?? v.origin}` : undefined].filter(
    Boolean,
  ) as string[];

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-card border border-white/[0.07] bg-panel shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:shadow-lift ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-panel-2">
        {photos.length ? (
          <>
            <div
              ref={scroller}
              onScroll={(e) => {
                const el = e.currentTarget;
                setIdx(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
              }}
              className="no-scrollbar relative z-[2] flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
            >
              {photos.map((img, i) => (
                <Link
                  key={img.src}
                  href={href}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="shimmer relative h-full w-full shrink-0 snap-start"
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 30vw, (min-width: 640px) 46vw, 100vw"
                    placeholder={img.blur ? "blur" : "empty"}
                    blurDataURL={img.blur}
                    priority={priority && i === 0}
                    loading={priority && i === 0 ? undefined : "lazy"}
                    className="object-cover"
                  />
                </Link>
              ))}
            </div>
            {photos.length > 1 && (
              <>
                <div className="pointer-events-none absolute inset-x-0 bottom-2.5 z-[3] flex justify-center gap-1.5" aria-hidden="true">
                  {photos.map((p, i) => (
                    <span
                      key={p.src}
                      className={`h-1.5 rounded-full bg-white transition-all ${i === idx ? "w-4 opacity-100" : "w-1.5 opacity-50"}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-2 top-1/2 z-[3] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-night/60 text-paper opacity-0 backdrop-blur-md transition-opacity hover:bg-night/80 focus-visible:opacity-100 disabled:hidden group-hover:opacity-100 md:flex"
                  aria-label={`Previous photo of ${v.name}`}
                  disabled={idx === 0}
                >
                  <Icon name="chevL" className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-2 top-1/2 z-[3] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-night/60 text-paper opacity-0 backdrop-blur-md transition-opacity hover:bg-night/80 focus-visible:opacity-100 disabled:hidden group-hover:opacity-100 md:flex"
                  aria-label={`Next photo of ${v.name}`}
                  disabled={idx >= photos.length - 1}
                >
                  <Icon name="chevR" className="h-5 w-5" />
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <VehicleArt body={v.body} />
            {v.carsForSaleUrl && (
              <a
                href={v.carsForSaleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2.5 right-2.5 z-[3] inline-flex min-h-[32px] items-center gap-1 rounded-full bg-night/70 px-2.5 text-[12.5px] font-semibold text-paper backdrop-blur-md hover:bg-night/85"
              >
                <Icon name="camera" className="h-3.5 w-3.5" />
                Photos on original listing
                <span className="sr-only"> for {v.name} (opens Carsforsale)</span>
              </a>
            )}
          </>
        )}

        {/* badges */}
        <div className="pointer-events-none absolute left-3 top-3 z-[3] flex flex-wrap gap-1.5">
          {v.status === "pending" && (
            <span className="rounded-full bg-rust px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-[0.08em] text-paper">
              Sale pending
            </span>
          )}
          {v.isNew && v.status !== "pending" && (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-[0.08em] text-night">
              New arrival
            </span>
          )}
        </div>
        <SaveButton slug={v.slug} name={v.name} className="absolute right-2 top-2" />
        {v.images.length > 0 && (
          <span className="pointer-events-none absolute bottom-2.5 left-3 z-[3] inline-flex items-center gap-1 rounded-full bg-night/60 px-2 py-0.5 text-[12px] font-semibold text-paper backdrop-blur-md">
            <Icon name="camera" className="h-3.5 w-3.5" />
            {v.images.length}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Heading className="font-sans text-[18px] font-bold leading-snug tracking-normal text-fg">
          <Link href={href} className="after:absolute after:inset-0 after:z-[1] after:content-[''] focus-visible:outline-none">
            <NoBreak text={v.name} />
          </Link>
        </Heading>
        <p className="mt-0.5 truncate text-[14.5px] text-muted">
          {[v.trim, shortMiles(v.miles)].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <p className={`font-display font-bold text-leaf ${v.price === "call" ? "text-[19px]" : "text-[26px] leading-none"}`}>
            {formatPrice(v.price)}
          </p>
        </div>
        {tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-3" aria-label="Quick facts">
            {tags.map((t) => (
              <li key={t} className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[12.5px] font-semibold text-fg/80">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Focus ring for the stretched link */}
      <span className="pointer-events-none absolute inset-0 z-[4] rounded-card ring-gold group-has-[h2_a:focus-visible]:ring-[3px] group-has-[h3_a:focus-visible]:ring-[3px]" />
    </article>
  );
}

/** Loading skeleton with the same footprint as a card. */
export function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-white/[0.07] bg-panel" aria-hidden="true">
      <div className="shimmer aspect-[4/3]" />
      <div className="space-y-2.5 p-4">
        <div className="shimmer h-5 w-3/4 rounded" />
        <div className="shimmer h-4 w-1/2 rounded" />
        <div className="shimmer mt-4 h-7 w-1/3 rounded" />
      </div>
    </div>
  );
}
