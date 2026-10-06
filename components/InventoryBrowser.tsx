"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import VehicleCard from "@/components/VehicleCard";
import TradeForm from "@/components/TradeForm";
import Icon from "@/components/Icon";
import { Silhouette } from "@/components/VehicleArt";
import { bodyLabels, facets, type LiveVehicle } from "@/lib/inventory";
import {
  activeCount,
  applyFilters,
  EMPTY_FILTERS,
  filtersToQuery,
  MILES_STEPS,
  parseFilters,
  PRICE_STEPS,
  sortLabels,
  swatch,
  type Filters,
  type SortKey,
} from "@/lib/filters";
import { useSaved } from "@/lib/saved";
import { site, telHref } from "@/content/site";
import type { Body } from "@/content/inventory";

const money = (n: number) => (n >= 1000 ? `$${n / 1000}k` : `$${n}`);
const kmi = (n: number) => `${Math.round(n / 1000)}k mi`;
const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-white/[0.07] pb-5 pt-5 first:pt-0 last:border-0">
      <legend className="float-left mb-3 w-full text-[13px] font-bold uppercase tracking-[0.12em] text-muted">{title}</legend>
      <div className="clear-left">{children}</div>
    </fieldset>
  );
}

function Chip({ on, onClick, children, count }: { on: boolean; onClick: () => void; children: ReactNode; count?: number }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} className={on ? "chip-on" : "chip-off"}>
      {children}
      {count !== undefined && <span className={`text-[12.5px] ${on ? "text-leaf/80" : "text-muted"}`}>{count}</span>}
    </button>
  );
}

function FilterPanel({
  f,
  set,
  all,
  savedCount,
  idp,
}: {
  f: Filters;
  set: (u: Partial<Filters>) => void;
  all: LiveVehicle[];
  savedCount: number;
  idp: string;
}) {
  const fx = useMemo(() => facets(all), [all]);
  const years = useMemo(() => {
    const ys: number[] = [];
    for (let y = fx.yearMax; y >= fx.yearMin; y--) ys.push(y);
    return ys;
  }, [fx]);

  return (
    <div>
      {savedCount > 0 && (
        <Section title="Saved">
          <Chip on={f.saved} onClick={() => set({ saved: !f.saved })} count={savedCount}>
            <Icon name="heart" filled={f.saved} className="h-4 w-4 text-gold" />
            Saved only
          </Chip>
        </Section>
      )}

      <Section title="Body type">
        <div className="grid grid-cols-2 gap-2">
          {(["truck", "suv", "van", "car"] as Body[]).map((b) => {
            const n = fx.bodies.find(([k]) => k === b)?.[1] ?? 0;
            const on = f.body.includes(b);
            return (
              <button
                key={b}
                type="button"
                aria-pressed={on}
                disabled={!n && !on}
                onClick={() => set({ body: toggle(f.body, b) })}
                className={`flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-[14px] font-semibold transition-colors disabled:opacity-35 ${
                  on ? "border-go bg-go/15 text-leaf" : "border-white/15 bg-panel-2 hover:border-white/30"
                }`}
              >
                <Silhouette body={b} className="h-7 w-auto" />
                <span>
                  {bodyLabels[b].many} <span className="text-muted">{n}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Make">
        <ul className="-my-1">
          {fx.makes.map(([make, n]) => {
            const on = f.make.includes(make);
            return (
              <li key={make}>
                <label className="flex min-h-tap cursor-pointer items-center gap-3 text-[15.5px]">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => set({ make: toggle(f.make, make) })}
                    className="h-5 w-5 shrink-0 cursor-pointer rounded accent-[rgb(var(--go))]"
                  />
                  <span className="flex-1">{make}</span>
                  <span className="text-[13px] text-muted">{n}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="Max price">
        <div className="flex flex-wrap gap-2">
          <Chip on={f.priceMax === null} onClick={() => set({ priceMax: null })}>
            Any
          </Chip>
          {PRICE_STEPS.filter((p) => p <= fx.priceMax + 10000).map((p) => (
            <Chip key={p} on={f.priceMax === p} onClick={() => set({ priceMax: f.priceMax === p ? null : p })}>
              {money(p)}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Year">
        <label className="sr-only" htmlFor={`${idp}-year-min`}>
          Minimum year
        </label>
        <select
          id={`${idp}-year-min`}
          value={f.yearMin ?? ""}
          onChange={(e) => set({ yearMin: e.target.value ? Number(e.target.value) : null })}
          className="field-input"
        >
          <option value="">Any year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y} or newer
            </option>
          ))}
        </select>
      </Section>

      <Section title="Max miles">
        <div className="flex flex-wrap gap-2">
          <Chip on={f.milesMax === null} onClick={() => set({ milesMax: null })}>
            Any
          </Chip>
          {MILES_STEPS.map((m) => (
            <Chip key={m} on={f.milesMax === m} onClick={() => set({ milesMax: f.milesMax === m ? null : m })}>
              {kmi(m)}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Drivetrain">
        <div className="flex flex-wrap gap-2">
          {fx.drivetrains.map(([d, n]) => (
            <Chip key={d} on={f.drive.includes(d)} onClick={() => set({ drive: toggle(f.drive, d) })} count={n}>
              {d}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Fuel">
        <div className="flex flex-wrap gap-2">
          {fx.fuels.map(([d, n]) => (
            <Chip key={d} on={f.fuel.includes(d)} onClick={() => set({ fuel: toggle(f.fuel, d) })} count={n}>
              {d}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Exterior color">
        <div className="flex flex-wrap gap-2">
          {fx.colors.map(([c, n]) => (
            <Chip key={c} on={f.color.includes(c)} onClick={() => set({ color: toggle(f.color, c) })} count={n}>
              <span
                className="h-4 w-4 rounded-full border border-white/30"
                style={{ background: swatch[c] ?? "#888" }}
                aria-hidden="true"
              />
              {c}
            </Chip>
          ))}
        </div>
      </Section>
    </div>
  );
}

export default function InventoryBrowser({ vehicles }: { vehicles: LiveVehicle[] }) {
  const sp = useSearchParams();
  const [f, setFilters] = useState<Filters>(() => parseFilters(new URLSearchParams(sp?.toString() ?? "")));
  const [sheet, setSheet] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const { saved } = useSaved();

  const set = (u: Partial<Filters>) => setFilters((prev) => ({ ...prev, ...u }));
  const results = useMemo(() => applyFilters(vehicles, f, saved), [vehicles, f, saved]);
  const nActive = activeCount(f);

  // Shareable URL
  useEffect(() => {
    const qs = filtersToQuery(f);
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [f]);

  // The header's "Saved" link can be used while already on this page
  useEffect(() => {
    if (sp?.get("saved") === "1") setFilters((prev) => (prev.saved ? prev : { ...prev, saved: true }));
  }, [sp]);

  // Bottom sheet: scroll lock, Escape, focus management
  useEffect(() => {
    if (!sheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    const opener = openerRef.current;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [sheet]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setSheet(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const fourByAll = f.drive.includes("4x4") && f.drive.includes("AWD");
  const quick: { label: string; on: boolean; click: () => void }[] = [
    ...(["truck", "suv", "van", "car"] as Body[])
      .filter((b) => vehicles.some((v) => v.body === b))
      .map((b) => ({ label: bodyLabels[b].many, on: f.body.includes(b), click: () => set({ body: toggle(f.body, b) }) })),
    { label: "4x4 / AWD", on: fourByAll, click: () => set({ drive: fourByAll ? [] : ["4x4", "AWD"] }) },
    { label: "Under $15k", on: f.priceMax === 15000, click: () => set({ priceMax: f.priceMax === 15000 ? null : 15000 }) },
    { label: "Under 100k mi", on: f.milesMax === 100000, click: () => set({ milesMax: f.milesMax === 100000 ? null : 100000 }) },
    ...(vehicles.some((v) => v.fuel === "Diesel")
      ? [{ label: "Diesel", on: f.fuel.includes("Diesel"), click: () => set({ fuel: toggle(f.fuel, "Diesel") }) }]
      : []),
  ];

  const activeChips: { label: string; clear: () => void }[] = [
    ...(f.saved ? [{ label: "Saved", clear: () => set({ saved: false }) }] : []),
    ...f.body.map((b) => ({ label: bodyLabels[b].many, clear: () => set({ body: f.body.filter((x) => x !== b) }) })),
    ...f.make.map((m) => ({ label: m, clear: () => set({ make: f.make.filter((x) => x !== m) }) })),
    ...(f.priceMax !== null ? [{ label: `Under ${money(f.priceMax)}`, clear: () => set({ priceMax: null }) }] : []),
    ...(f.yearMin !== null ? [{ label: `${f.yearMin}+`, clear: () => set({ yearMin: null }) }] : []),
    ...(f.milesMax !== null ? [{ label: `Under ${kmi(f.milesMax)}`, clear: () => set({ milesMax: null }) }] : []),
    ...f.drive.map((d) => ({ label: d, clear: () => set({ drive: f.drive.filter((x) => x !== d) }) })),
    ...f.fuel.map((d) => ({ label: d, clear: () => set({ fuel: f.fuel.filter((x) => x !== d) }) })),
    ...f.color.map((d) => ({ label: d, clear: () => set({ color: f.color.filter((x) => x !== d) }) })),
  ];

  const clearAll = () => setFilters({ ...EMPTY_FILTERS, q: f.q, sort: f.sort });

  const sortSelect = (id: string) => (
    <label className="relative inline-flex items-center" htmlFor={id}>
      <span className="sr-only">Sort by</span>
      <Icon name="sort" className="pointer-events-none absolute left-3 h-4 w-4 text-muted" />
      <select
        id={id}
        value={f.sort}
        onChange={(e) => set({ sort: e.target.value as SortKey })}
        className="min-h-tap appearance-none rounded-full border border-white/15 bg-panel-2 py-2 pl-9 pr-9 text-[14.5px] font-semibold text-fg focus:border-go focus:outline-none"
      >
        {(Object.keys(sortLabels) as SortKey[]).map((k) => (
          <option key={k} value={k}>
            {sortLabels[k]}
          </option>
        ))}
      </select>
      <Icon name="chevD" className="pointer-events-none absolute right-3 h-4 w-4 text-muted" />
    </label>
  );

  return (
    <div className="container-x pb-8 lg:grid lg:grid-cols-[280px_1fr] lg:gap-10 lg:pt-8">
      {/* Desktop filters */}
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="no-scrollbar sticky top-[calc(var(--header-h)+20px)] max-h-[calc(100vh-var(--header-h)-40px)] overflow-y-auto pb-6 pr-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-sans text-[18px] font-bold tracking-normal">Filters</h2>
            {nActive > 0 && (
              <button type="button" onClick={clearAll} className="min-h-tap px-2 text-[14px] font-semibold text-leaf hover:underline">
                Clear all ({nActive})
              </button>
            )}
          </div>
          <FilterPanel f={f} set={set} all={vehicles} savedCount={saved.length} idp="side" />
        </div>
      </aside>

      <div className="min-w-0">
        {/* Search + filter button — sticky on phones */}
        <div className="sticky top-[var(--header-h)] z-30 -mx-4 border-b border-white/[0.07] bg-night/90 px-4 py-2.5 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <div className="flex gap-2">
            <label className="relative flex-1">
              <span className="sr-only">Search inventory</span>
              <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={f.q}
                onChange={(e) => set({ q: e.target.value })}
                placeholder="Search make or model"
                className="field-input rounded-full pl-11"
                enterKeyHint="search"
              />
            </label>
            <button
              ref={openerRef}
              type="button"
              onClick={() => setSheet(true)}
              className="relative inline-flex min-h-tap shrink-0 items-center gap-2 rounded-full border border-white/15 bg-panel-2 px-4 font-semibold lg:hidden"
              aria-haspopup="dialog"
              aria-expanded={sheet}
              aria-controls="filter-sheet"
              aria-label={`Filter and sort${nActive ? `, ${nActive} active` : ""}`}
            >
              <Icon name="filter" className="h-5 w-5" />
              <span className="hidden xs:inline">Filters</span>
              {nActive > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-go px-1 text-[12px] font-bold text-white">
                  {nActive}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Quick chips */}
        <div className="-mx-4 mt-3 sm:-mx-6 lg:mx-0">
          <ul className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1 sm:px-6 lg:flex-wrap lg:px-0" aria-label="Quick filters">
            {quick.map((c) => (
              <li key={c.label}>
                <button type="button" onClick={c.click} aria-pressed={c.on} className={c.on ? "chip-on" : "chip-off"}>
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[15px] font-semibold text-fg" aria-live="polite">
            {results.length} {results.length === 1 ? "vehicle" : "vehicles"}
            {results.length !== vehicles.length && <span className="font-normal text-muted"> of {vehicles.length}</span>}
          </p>
          {sortSelect("sort-main")}
        </div>

        {activeChips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {activeChips.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={c.clear}
                className="inline-flex min-h-tap items-center gap-1 rounded-full bg-white/[0.07] pl-3.5 pr-2.5 text-[14px] font-semibold text-fg hover:bg-white/[0.12]"
                aria-label={`Remove filter: ${c.label}`}
              >
                {c.label}
                <Icon name="close" className="h-4 w-4 text-muted" />
              </button>
            ))}
            <button type="button" onClick={clearAll} className="min-h-tap px-2 text-[14px] font-semibold text-leaf hover:underline">
              Clear all
            </button>
          </div>
        )}

        {results.length > 0 ? (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((v, i) => (
              <li key={v.slug} className="flex">
                <VehicleCard v={v} headingLevel="h2" className="w-full" priority={i < 2} />
              </li>
            ))}
          </ul>
        ) : f.saved && saved.length === 0 ? (
          <div className="mt-8 rounded-card border border-dashed border-white/15 p-6 text-center">
            <Icon name="heart" className="mx-auto h-8 w-8 text-gold" />
            <h2 className="mt-3 text-[24px] font-semibold">No saved vehicles yet</h2>
            <p className="mt-1 text-muted">Tap the heart on any vehicle to keep it here. Saved on this device only.</p>
            <button type="button" onClick={() => set({ saved: false })} className="btn-go mt-5">
              Browse all vehicles
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <div className="rounded-card border border-dashed border-white/15 bg-panel/60 p-5 sm:p-7">
              <h2 className="text-[26px] font-semibold">Nothing on the lot matches that right now.</h2>
              <p className="mt-2 text-[16.5px] text-muted">
                Inventory turns over fast. Call or text and tell us what you&apos;re after. Got something to trade? Start there.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={clearAll} className="btn-ghost">
                  Clear filters
                </button>
                <a href={telHref} className="btn-go">
                  <Icon name="phone" className="h-5 w-5" />
                  Call {site.phone.display}
                </a>
              </div>
            </div>
            <h2 className="mt-10 text-[26px] font-semibold">Tell us about your trade</h2>
            <p className="mt-1 text-[16px] text-muted">We&apos;ll get back to you.</p>
            <div className="mt-4">
              <TradeForm source="inventory-empty" />
            </div>
          </div>
        )}
      </div>

      {/* Phone/tablet sheet. Sits above the page, below the call bar. */}
      <div
        className={`fixed inset-x-0 top-0 z-[45] lg:hidden ${sheet ? "" : "pointer-events-none"}`}
        style={{ bottom: "calc(var(--callbar-h) + env(safe-area-inset-bottom))" }}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${sheet ? "opacity-100" : "opacity-0"}`}
          onClick={() => setSheet(false)}
          aria-hidden="true"
        />
        <div
          id="filter-sheet"
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="Filter and sort"
          hidden={!sheet}
          className={`absolute inset-x-0 bottom-0 ${sheet ? "flex" : "hidden"} max-h-[88%] animate-sheet-up flex-col rounded-t-[1.5rem] border-t border-white/10 bg-panel shadow-lift md:inset-y-0 md:left-auto md:max-h-none md:w-[420px] md:rounded-none md:border-l md:border-t-0`}
        >
          <div className="relative flex items-center justify-between border-b border-white/[0.08] px-4 pb-2 pt-3">
            <span className="absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-white/20 md:hidden" aria-hidden="true" />
            <h2 className="pt-1 font-sans text-[19px] font-bold tracking-normal">Filter &amp; sort</h2>
            <button
              type="button"
              onClick={() => setSheet(false)}
              className="inline-flex h-tap w-tap items-center justify-center rounded-full hover:bg-white/[0.06]"
              aria-label="Close filters"
            >
              <Icon name="close" className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
            <div className="mb-5 border-b border-white/[0.07] pb-5">
              <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-muted">Sort</p>
              {sortSelect("sort-sheet")}
            </div>
            <FilterPanel f={f} set={set} all={vehicles} savedCount={saved.length} idp="sheet" />
          </div>
          <div className="flex gap-2 border-t border-white/[0.08] bg-panel p-3">
            <button type="button" onClick={clearAll} className="btn-ghost flex-1">
              Clear
            </button>
            <button type="button" onClick={() => setSheet(false)} className="btn-go flex-[2]">
              Show {results.length} {results.length === 1 ? "result" : "results"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
