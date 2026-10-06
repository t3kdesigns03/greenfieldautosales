"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type DragEvent, type ReactNode } from "react";
import { prepareImage } from "@/components/admin/prepareImage";
import { vehicleSlug, isValidSlug } from "@/lib/slug";
import { BODIES, DRIVETRAINS, FUELS, MAX_PHOTOS, STATUSES } from "@/lib/vehicleRecord";

export type EditorFields = {
  year: string;
  make: string;
  model: string;
  trim: string;
  body: string;
  price: string;
  callForPrice: boolean;
  miles: string;
  drivetrain: string;
  fuel: string;
  origin: string;
  highlights: string;
  caveat: string;
  status: string;
  carsForSaleUrl: string;
};

export type ExistingPhoto = { index: number; src: string; width: number; height: number };

type Item =
  | { key: string; kind: "existing"; index: number; src: string }
  | {
      key: string;
      kind: "new";
      name: string;
      src: string; // object URL of the resized WebP
      state: "working" | "ready" | "error";
      error?: string;
      blob?: Blob;
      width?: number;
      height?: number;
      blur?: string;
      uploadedId?: string;
      uploadedFor?: string;
    };

const BLANK: EditorFields = {
  year: "",
  make: "",
  model: "",
  trim: "",
  body: "truck",
  price: "",
  callForPrice: false,
  miles: "",
  drivetrain: "",
  fuel: "",
  origin: "",
  highlights: "",
  caveat: "",
  status: "available",
  carsForSaleUrl: "",
};

const bodyName: Record<string, string> = { truck: "Truck", suv: "SUV", van: "Van", car: "Car" };
const statusName: Record<string, string> = { available: "Available", pending: "Sale pending", sold: "Sold" };

let keySeq = 0;
const nextKey = () => `p${++keySeq}`;

export default function VehicleEditor({
  mode,
  slug: initialSlug = "",
  initial,
  photos: initialPhotos = [],
  takenSlugs = [],
  cliPhotoCount = 0,
}: {
  mode: "create" | "update";
  slug?: string;
  initial?: Partial<EditorFields>;
  photos?: ExistingPhoto[];
  takenSlugs?: string[];
  /** Photos this vehicle has from `npm run photos` (shown until photos are added here). */
  cliPhotoCount?: number;
}) {
  const router = useRouter();
  const [f, setF] = useState<EditorFields>({ ...BLANK, ...initial });
  const [slug, setSlug] = useState(initialSlug);
  const [slugTouched, setSlugTouched] = useState(mode === "update");
  const [items, setItems] = useState<Item[]>(() =>
    initialPhotos.map((p) => ({ key: nextKey(), kind: "existing", index: p.index, src: p.src })),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [dropping, setDropping] = useState(false);
  const dragKey = useRef<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());

  // Slug follows year-make-model-trim until someone edits it by hand.
  const autoSlug = useMemo(() => vehicleSlug(f), [f]);
  useEffect(() => {
    if (!slugTouched) setSlug(autoSlug);
  }, [autoSlug, slugTouched]);

  // Free object URLs when the editor goes away.
  const itemsRef = useRef(items);
  itemsRef.current = items;
  useEffect(
    () => () => itemsRef.current.forEach((it) => it.kind === "new" && URL.revokeObjectURL(it.src)),
    [],
  );

  const set = <K extends keyof EditorFields>(k: K, v: EditorFields[K]) => setF((p) => ({ ...p, [k]: v }));
  const slugTaken = mode === "create" && takenSlugs.includes(slug);

  // ---- photos ----
  function addFiles(files: FileList | File[]) {
    const list = [...files].filter((x) => x.size > 0);
    const room = MAX_PHOTOS - itemsRef.current.length;
    if (room <= 0) return setFormError(`Up to ${MAX_PHOTOS} photos per vehicle.`);
    const forceWasm = new URLSearchParams(window.location.search).has("wasmwebp");
    for (const file of list.slice(0, room)) {
      const key = nextKey();
      setItems((p) => [...p, { key, kind: "new", name: file.name, src: "", state: "working" }]);
      // One at a time keeps memory sane with 40 big phone photos.
      queue.current = queue.current.then(async () => {
        try {
          const out = await prepareImage(file, { forceWasm });
          const src = URL.createObjectURL(out.blob);
          setItems((p) => p.map((it) => (it.key === key ? { ...it, ...out, src, state: "ready" } : it)));
        } catch (err) {
          setItems((p) =>
            p.map((it) => (it.key === key ? { ...it, state: "error", error: (err as Error).message } : it)),
          );
        }
      });
    }
  }

  const move = (from: number, to: number) =>
    setItems((p) => {
      if (to < 0 || to >= p.length || from === to) return p;
      const next = [...p];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return next;
    });

  const remove = (key: string) =>
    setItems((p) => {
      const it = p.find((x) => x.key === key);
      if (it?.kind === "new" && it.src) URL.revokeObjectURL(it.src);
      return p.filter((x) => x.key !== key);
    });

  const isFileDrag = (e: DragEvent) => [...e.dataTransfer.types].includes("Files");

  // ---- save ----
  async function save() {
    setFormError(null);
    setErrors({});
    if (!isValidSlug(slug)) return setErrors({ slug: "Use lowercase letters, numbers and dashes." });
    if (slugTaken) return setErrors({ slug: "Already used by another vehicle." });
    if (items.some((it) => it.kind === "new" && it.state === "working")) {
      return setFormError("Photos are still being prepared. Give it a second.");
    }
    if (items.some((it) => it.kind === "new" && it.state === "error")) {
      return setFormError("Remove the photos marked with an error first.");
    }

    try {
      // 1. Upload new photos one at a time (each is a small WebP).
      const pending = items.filter(
        (it): it is Extract<Item, { kind: "new" }> => it.kind === "new" && !(it.uploadedId && it.uploadedFor === slug),
      );
      for (let i = 0; i < pending.length; i++) {
        setBusy(`Uploading photo ${i + 1} of ${pending.length}…`);
        const it = pending[i];
        const res = await fetch(`/api/admin/uploads?slug=${encodeURIComponent(slug)}`, {
          method: "POST",
          headers: { "content-type": "image/webp" },
          body: it.blob,
        });
        const json = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: string; error?: string };
        if (!res.ok || !json.id) throw new Error(json.error ?? `Upload failed (${res.status}).`);
        it.uploadedId = json.id;
        it.uploadedFor = slug;
      }
      setItems((p) => [...p]);

      // 2. Save the record + final photo order.
      setBusy("Saving…");
      const fields = {
        year: f.year,
        make: f.make,
        model: f.model,
        trim: f.trim,
        body: f.body,
        price: f.callForPrice ? "call" : f.price,
        miles: f.miles,
        drivetrain: f.drivetrain,
        fuel: f.fuel,
        origin: f.origin,
        highlights: f.highlights,
        caveat: f.caveat,
        status: f.status,
        carsForSaleUrl: f.carsForSaleUrl,
      };
      const photos = items.map((it) =>
        it.kind === "existing"
          ? { kind: "existing", index: it.index }
          : { kind: "upload", id: it.uploadedId, width: it.width, height: it.height, blur: it.blur },
      );
      const res = await fetch(`/api/admin/vehicles/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, fields, photos }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: Record<string, string> };
      if (!res.ok) {
        if (json.errors) setErrors(json.errors);
        throw new Error(json.error ?? `Save failed (${res.status}).`);
      }
      router.push(`/admin?saved=${encodeURIComponent(slug)}`);
      router.refresh();
    } catch (err) {
      setFormError((err as Error).message);
      setBusy(null);
    }
  }

  const err = (k: string) => errors[k];
  const readyCount = items.filter((it) => it.kind === "existing" || it.state === "ready").length;

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
      noValidate
    >
      <section className="card space-y-5 p-5 sm:p-6" aria-labelledby="ve-basics">
        <h2 id="ve-basics" className="text-[22px] font-semibold">
          Vehicle
        </h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field id="ve-year" label="Year" error={err("year")} className="sm:col-span-1">
            <input id="ve-year" className="field-input" inputMode="numeric" maxLength={4} value={f.year} onChange={(e) => set("year", e.target.value.replace(/\D/g, ""))} required />
          </Field>
          <Field id="ve-make" label="Make" error={err("make")} className="sm:col-span-1">
            <input id="ve-make" className="field-input" value={f.make} onChange={(e) => set("make", e.target.value)} placeholder="Ford" required />
          </Field>
          <Field id="ve-model" label="Model" error={err("model")} className="sm:col-span-1">
            <input id="ve-model" className="field-input" value={f.model} onChange={(e) => set("model", e.target.value)} placeholder="F-250 Super Duty" required />
          </Field>
          <Field id="ve-trim" label="Trim" hint="Optional" error={err("trim")} className="sm:col-span-1">
            <input id="ve-trim" className="field-input" value={f.trim} onChange={(e) => set("trim", e.target.value)} placeholder="XL" />
          </Field>
        </div>

        <Field
          id="ve-web-address-slug"
          label="Web address (slug)"
          hint={mode === "update" ? "Fixed once saved" : "Made from year-make-model-trim. Edit before saving if you like."}
          error={err("slug") ?? (slugTaken ? "Already used by another vehicle." : undefined)}
        >
          <div className="flex items-center gap-2">
            <span className="hidden shrink-0 text-[15px] text-muted sm:inline">/inventory/</span>
            <input
              id="ve-web-address-slug"
              className="field-input font-mono text-[15px]"
              value={slug}
              readOnly={mode === "update"}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
              }}
              onBlur={() => setSlug((s) => s.replace(/-+/g, "-").replace(/^-|-$/g, ""))}
                          />
            {mode === "create" && slugTouched && slug !== autoSlug && (
              <button type="button" className="btn-ghost shrink-0 px-3 text-[14px]" onClick={() => setSlugTouched(false)}>
                Reset
              </button>
            )}
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="ve-body" label="Body" error={err("body")}>
            <select id="ve-body" className="field-input" value={f.body} onChange={(e) => set("body", e.target.value)}>
              {BODIES.map((b) => (
                <option key={b} value={b}>
                  {bodyName[b]}
                </option>
              ))}
            </select>
          </Field>
          <Field id="ve-price" label="Price" error={err("price")}>
            <div className="space-y-2">
              <input
                id="ve-price"
                className="field-input"
                inputMode="numeric"
                value={f.callForPrice ? "" : f.price}
                disabled={f.callForPrice}
                onChange={(e) => set("price", e.target.value.replace(/[^\d]/g, ""))}
                placeholder={f.callForPrice ? "Call for price" : "15900"}
              />
              <label className="flex min-h-tap items-center gap-2 text-[15px]">
                <input type="checkbox" className="h-5 w-5 accent-go" checked={f.callForPrice} onChange={(e) => set("callForPrice", e.target.checked)} />
                Call for price
              </label>
            </div>
          </Field>
          <Field id="ve-miles" label="Miles" hint="Blank if unknown" error={err("miles")}>
            <input id="ve-miles" className="field-input" inputMode="numeric" value={f.miles} onChange={(e) => set("miles", e.target.value.replace(/[^\d]/g, ""))} placeholder="98000" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <Field id="ve-drivetrain" label="Drivetrain" error={err("drivetrain")}>
            <select id="ve-drivetrain" className="field-input" value={f.drivetrain} onChange={(e) => set("drivetrain", e.target.value)}>
              <option value="">—</option>
              {DRIVETRAINS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field id="ve-fuel" label="Fuel" error={err("fuel")}>
            <select id="ve-fuel" className="field-input" value={f.fuel} onChange={(e) => set("fuel", e.target.value)}>
              <option value="">—</option>
              {FUELS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Field id="ve-came-from" label="Came from" hint="Two-letter state, optional" error={err("origin")}>
            <input
              id="ve-came-from"
              className="field-input uppercase"
              maxLength={2}
              value={f.origin}
              onChange={(e) => set("origin", e.target.value.replace(/[^a-z]/gi, "").toUpperCase())}
              placeholder="TX"
            />
          </Field>
          <Field id="ve-status" label="Status" error={err("status")}>
            <select id="ve-status" className="field-input" value={f.status} onChange={(e) => set("status", e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusName[s]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field id="ve-highlights" label="Highlights" hint="One per line. Only what's true from the listing." error={err("highlights")}>
          <textarea id="ve-highlights" className="field-input min-h-[120px]" value={f.highlights} onChange={(e) => set("highlights", e.target.value)} placeholder={"One owner\nNew tires"} />
        </Field>
        <Field id="ve-caveat" label="Caveat" hint="Optional. A condition note shown plainly on the page." error={err("caveat")}>
          <textarea id="ve-caveat" className="field-input min-h-[80px]" value={f.caveat} onChange={(e) => set("caveat", e.target.value)} placeholder="This one does have rust." />
        </Field>
        <Field id="ve-carsforsale-listing-link" label="Carsforsale listing link" hint="Optional" error={err("carsForSaleUrl")}>
          <input id="ve-carsforsale-listing-link" className="field-input" type="url" value={f.carsForSaleUrl} onChange={(e) => set("carsForSaleUrl", e.target.value)} placeholder="https://www.greenfieldautosales.net/details/…" />
        </Field>
      </section>

      <section className="card space-y-4 p-5 sm:p-6" aria-labelledby="ve-photos">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="ve-photos" className="text-[22px] font-semibold">
              Photos
            </h2>
            <p className="text-[14.5px] text-muted">
              First photo is the cover. Drag to reorder, or use the arrows. Photos are resized to 1600px WebP before upload.
            </p>
          </div>
          <span className="text-[14px] text-muted">
            {readyCount} / {MAX_PHOTOS}
          </span>
        </div>
        {cliPhotoCount > 0 && items.length === 0 && (
          <p className="rounded-xl bg-white/[0.05] p-3 text-[14.5px] text-muted">
            This vehicle has {cliPhotoCount} photos from <code>npm run photos</code>. They keep showing until you add photos here.
          </p>
        )}

        <div
          onDragOver={(e) => {
            if (!isFileDrag(e)) return;
            e.preventDefault();
            setDropping(true);
          }}
          onDragLeave={() => setDropping(false)}
          onDrop={(e) => {
            if (!isFileDrag(e)) return;
            e.preventDefault();
            setDropping(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`rounded-card border-2 border-dashed p-4 transition-colors ${dropping ? "border-go bg-go/10" : "border-white/15"}`}
        >
          {items.length > 0 && (
            <ol className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-label="Photos in display order">
              {items.map((it, i) => (
                <li
                  key={it.key}
                  draggable
                  onDragStart={(e) => {
                    dragKey.current = it.key;
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", it.key);
                  }}
                  onDragOver={(e) => {
                    if (isFileDrag(e) || !dragKey.current) return;
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    if (isFileDrag(e) || !dragKey.current) return;
                    e.preventDefault();
                    e.stopPropagation();
                    const from = items.findIndex((x) => x.key === dragKey.current);
                    dragKey.current = null;
                    move(from, i);
                  }}
                  onDragEnd={() => (dragKey.current = null)}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-panel-2"
                >
                  <div className="relative aspect-[4/3] cursor-grab active:cursor-grabbing">
                    {it.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.src} alt="" className="h-full w-full object-cover" draggable={false} />
                    ) : (
                      <div className="shimmer h-full w-full" />
                    )}
                    {i === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-go px-2 py-0.5 text-[12px] font-bold text-on-go">Cover</span>
                    )}
                    {it.kind === "new" && it.state === "working" && (
                      <span className="absolute inset-x-2 bottom-2 rounded-md bg-night/80 px-2 py-1 text-center text-[12.5px]">Resizing…</span>
                    )}
                    {it.kind === "new" && it.state === "error" && (
                      <span className="absolute inset-0 flex items-center justify-center bg-rust/85 p-2 text-center text-[13px] font-semibold">
                        {it.error}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1 p-1.5">
                    <div className="flex">
                      <IconBtn label={`Move photo ${i + 1} earlier`} disabled={i === 0} onClick={() => move(i, i - 1)}>
                        ←
                      </IconBtn>
                      <IconBtn label={`Move photo ${i + 1} later`} disabled={i === items.length - 1} onClick={() => move(i, i + 1)}>
                        →
                      </IconBtn>
                    </div>
                    {i !== 0 && (
                      <button type="button" className="min-h-tap px-2 text-[13px] font-semibold text-muted hover:text-fg" onClick={() => move(i, 0)}>
                        Make cover
                      </button>
                    )}
                    <IconBtn label={`Delete photo ${i + 1}`} onClick={() => remove(it.key)}>
                      ✕
                    </IconBtn>
                  </div>
                </li>
              ))}
            </ol>
          )}
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <p className="text-[16px] font-semibold">Drop photos here</p>
            <p className="text-[14px] text-muted">JPG, PNG, WebP. Several at once is fine.</p>
            <button type="button" className="btn-ghost mt-1" onClick={() => fileInput.current?.click()}>
              Choose photos
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      </section>

      {formError && (
        <p role="alert" className="rounded-xl border border-rust-fg/50 bg-rust/20 p-3 text-[15px] text-rust-fg">
          {formError}
        </p>
      )}

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 bg-night/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-card sm:border">
        {busy && (
          <span className="mr-auto text-[15px] text-muted" aria-live="polite">
            {busy}
          </span>
        )}
        <a href="/admin" className="btn-ghost">
          Cancel
        </a>
        <button type="submit" className="btn-go" disabled={Boolean(busy)}>
          {mode === "create" ? "Save vehicle" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  hint,
  error,
  className = "",
  children,
}: {
  label: string;
  id: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {hint && <span className="ml-2 font-normal text-muted">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-[14px] font-semibold text-rust-fg">
          {error}
        </p>
      )}
    </div>
  );
}

function IconBtn({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-tap w-tap items-center justify-center rounded-lg text-[16px] text-fg hover:bg-white/[0.08] disabled:opacity-25"
    >
      {children}
    </button>
  );
}
