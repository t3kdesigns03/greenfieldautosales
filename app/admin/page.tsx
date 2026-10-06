import Link from "next/link";
import LoginForm from "@/components/admin/LoginForm";
import { StatusButton } from "@/components/admin/AdminActions";
import { adminConfigured, isAdmin } from "@/lib/adminAuth";
import { adminInventory, type ResolvedVehicle } from "@/lib/inventoryData";
import { formatPrice, shortMiles } from "@/lib/inventory";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ saved?: string }> };

const titleOf = (r: ResolvedVehicle) => [r.v.year, r.v.make, r.v.model, r.v.trim].filter(Boolean).join(" ");

export default async function AdminHome({ searchParams }: Props) {
  if (!adminConfigured()) {
    return (
      <div className="card mx-auto mt-16 max-w-lg p-6">
        <h1 className="text-[24px] font-semibold">Admin is turned off</h1>
        <p className="mt-2 text-muted">
          Set <code>ADMIN_PASSWORD</code> (8 or more characters) in Netlify → Site configuration → Environment variables, then redeploy.
        </p>
      </div>
    );
  }
  if (!(await isAdmin())) return <LoginForm />;

  const { saved } = await searchParams;
  const { vehicles, blobsError, storeKind } = await adminInventory();
  const live = vehicles.filter((r) => r.v.status !== "sold").sort((a, b) => b.v.listingId - a.v.listingId);
  const sold = vehicles.filter((r) => r.v.status === "sold").sort((a, b) => b.v.listingId - a.v.listingId);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-semibold">Inventory</h1>
          <p className="text-muted">
            {live.length} on the lot · {sold.length} sold
            {storeKind === "local-files" && " · local test storage (.data/)"}
          </p>
        </div>
        <Link href="/admin/new" className="btn-go">
          + New vehicle
        </Link>
      </div>

      {saved && (
        <p role="status" className="rounded-xl border border-signal/40 bg-signal/10 p-3 text-[15px]">
          Saved. <Link className="font-semibold underline" href={`/inventory/${saved}`} target="_blank">See it on the site</Link> (it may
          take a few seconds to show everywhere).
        </p>
      )}
      {blobsError && (
        <p role="alert" className="rounded-xl border border-rust-fg/50 bg-rust/20 p-3 text-[15px] text-rust-fg">
          Couldn&apos;t reach Netlify Blobs: {blobsError}. Showing vehicles from content files only. Saving won&apos;t work until this is fixed.
        </p>
      )}

      <section aria-labelledby="live-title">
        <h2 id="live-title" className="sr-only">
          On the lot
        </h2>
        <VehicleTable rows={live} />
      </section>

      {sold.length > 0 && (
        <details className="card p-4 sm:p-5">
          <summary className="min-h-tap cursor-pointer text-[18px] font-semibold">Sold ({sold.length})</summary>
          <div className="mt-4">
            <VehicleTable rows={sold} sold />
          </div>
        </details>
      )}
    </div>
  );
}

function VehicleTable({ rows, sold = false }: { rows: ResolvedVehicle[]; sold?: boolean }) {
  if (!rows.length) return <p className="card p-6 text-muted">Nothing here yet.</p>;
  return (
    <ul className="divide-y divide-white/[0.07] overflow-hidden rounded-card border border-white/[0.07] bg-panel">
      {rows.map((r) => {
        const cover = r.images[0];
        return (
          <li key={r.v.slug} className="flex flex-wrap items-center gap-4 p-3 sm:p-4">
            <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-panel-2">
              {cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover.src} alt="" className="h-full w-full object-cover" loading="lazy" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{titleOf(r)}</p>
              <p className="text-[14px] text-muted">
                {formatPrice(r.v.price)} · {shortMiles(r.v.miles)} · {r.images.length} photo{r.images.length === 1 ? "" : "s"}
                {r.v.status === "pending" && " · sale pending"}
              </p>
              <p className="text-[12.5px] text-muted">
                {r.source === "blobs" ? (r.overridesContent ? "Admin (replaces content file)" : "Admin") : "Content file"} · /inventory/{r.v.slug}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {!sold && (
                <a href={`/inventory/${r.v.slug}`} target="_blank" rel="noopener noreferrer" className="btn-ghost px-4 text-[14px]">
                  View
                </a>
              )}
              {(r.source === "blobs" || !sold) && (
                <Link href={`/admin/vehicles/${r.v.slug}`} className="btn-ghost px-4 text-[14px]">
                  Edit
                </Link>
              )}
              {sold ? (
                r.source === "blobs" && <StatusButton slug={r.v.slug} to="available" label="Relist" />
              ) : (
                <StatusButton slug={r.v.slug} to="sold" label="Mark sold" confirmLabel="Yes, it sold" />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
