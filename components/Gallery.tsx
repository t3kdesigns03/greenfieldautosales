"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import VehicleArt from "@/components/VehicleArt";
import type { Body, VehicleImage } from "@/content/inventory";

/**
 * Vehicle photo gallery.
 * Phone: full-bleed swipe with a 1/N counter. Tap a photo → fullscreen.
 * Desktop: big photo with arrows + a thumbnail strip.
 * Fullscreen: swipe / arrow keys / Esc.
 */
export default function Gallery({
  images,
  body,
  name,
  listingUrl,
}: {
  images: VehicleImage[];
  body: Body;
  name: string;
  listingUrl?: string;
}) {
  const main = useRef<HTMLDivElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [full, setFull] = useState<number | null>(null);

  const goTo = useCallback((i: number, smooth = true) => {
    const el = main.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Keep the active thumbnail in view
  useEffect(() => {
    const t = thumbs.current?.children[idx] as HTMLElement | undefined;
    t?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [idx]);

  if (!images.length) {
    return (
      <div className="relative overflow-hidden sm:rounded-card">
        <div className="aspect-[4/3]">
          <VehicleArt body={body} size="lg" />
        </div>
        {listingUrl && (
          <a
            href={listingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 left-3 right-3 flex min-h-tap items-center justify-center gap-2 rounded-full bg-night/70 px-4 text-[14.5px] font-semibold text-paper backdrop-blur-md sm:left-auto"
          >
            <Icon name="camera" className="h-4 w-4" />
            See photos on the original listing
            <Icon name="external" className="h-4 w-4" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="group relative overflow-hidden bg-panel-2 sm:rounded-card">
        <div
          ref={main}
          onScroll={(e) => {
            const el = e.currentTarget;
            setIdx(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
          }}
          className="no-scrollbar flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          aria-roledescription="carousel"
          aria-label={`Photos of ${name}`}
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setFull(i)}
              className="shimmer relative h-full w-full shrink-0 cursor-zoom-in snap-start"
              aria-label={`Open photo ${i + 1} of ${images.length} fullscreen`}
            >
              <Image
                src={img.src}
                alt={img.alt ?? ""}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : "lazy"}
                sizes="(min-width: 1024px) 60vw, 100vw"
                placeholder={img.blur ? "blur" : "empty"}
                blurDataURL={img.blur}
                className="object-cover"
              />
            </button>
          ))}
        </div>

        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-night/70 px-2.5 py-1 text-[13px] font-semibold tabular-nums text-paper backdrop-blur-md">
          {idx + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={() => setFull(idx)}
          className="absolute bottom-2 left-2 inline-flex h-tap w-tap items-center justify-center rounded-full bg-night/60 text-paper backdrop-blur-md hover:bg-night/80"
          aria-label="View photos fullscreen"
        >
          <Icon name="expand" className="h-5 w-5" />
        </button>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(Math.max(0, idx - 1))}
              disabled={idx === 0}
              className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-night/60 text-paper backdrop-blur-md transition-opacity hover:bg-night/80 disabled:opacity-0 md:flex"
              aria-label="Previous photo"
            >
              <Icon name="chevL" className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => goTo(Math.min(images.length - 1, idx + 1))}
              disabled={idx === images.length - 1}
              className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-night/60 text-paper backdrop-blur-md transition-opacity hover:bg-night/80 disabled:opacity-0 md:flex"
              aria-label="Next photo"
            >
              <Icon name="chevR" className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div ref={thumbs} className="no-scrollbar mt-3 hidden gap-2 overflow-x-auto pb-1 md:flex">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === idx ? "true" : undefined}
              className={`relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-[border-color,opacity] ${
                i === idx ? "border-gold opacity-100" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img.src} alt="" fill sizes="96px" className="object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {full !== null && (
        <Lightbox
          images={images}
          start={full}
          name={name}
          onClose={(last) => {
            setFull(null);
            goTo(last, false);
          }}
        />
      )}
    </div>
  );
}

function Lightbox({
  images,
  start,
  name,
  onClose,
}: {
  images: VehicleImage[];
  start: number;
  name: string;
  onClose: (lastIndex: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [i, setI] = useState(start);
  const iRef = useRef(start);
  iRef.current = i;

  const go = useCallback((n: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollLeft = start * el.clientWidth;
    closeBtn.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose(iRef.current);
      if (e.key === "ArrowRight") go(Math.min(images.length - 1, iRef.current + 1));
      if (e.key === "ArrowLeft") go(Math.max(0, iRef.current - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black" role="dialog" aria-modal="true" aria-label={`${name} photos`}>
      <div className="flex items-center justify-between px-3 py-2 text-paper">
        <span className="pl-2 text-[15px] font-semibold tabular-nums">
          {i + 1} / {images.length}
        </span>
        <button
          ref={closeBtn}
          type="button"
          onClick={() => onClose(i)}
          className="inline-flex h-tap w-tap items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Close photos"
        >
          <Icon name="close" className="h-7 w-7" />
        </button>
      </div>
      <div
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          setI(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
        }}
        className="no-scrollbar flex flex-1 snap-x snap-mandatory overflow-x-auto"
      >
        {images.map((img) => (
          <div key={img.src} className="relative h-full w-full shrink-0 snap-start">
            <Image src={img.src} alt={img.alt ?? ""} fill sizes="100vw" className="object-contain" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 py-3">
        <button
          type="button"
          onClick={() => go(Math.max(0, i - 1))}
          disabled={i === 0}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-paper disabled:opacity-30"
          aria-label="Previous photo"
        >
          <Icon name="chevL" className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={() => go(Math.min(images.length - 1, i + 1))}
          disabled={i === images.length - 1}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-paper disabled:opacity-30"
          aria-label="Next photo"
        >
          <Icon name="chevR" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
