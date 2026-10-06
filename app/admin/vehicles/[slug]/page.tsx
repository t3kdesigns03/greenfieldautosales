import { notFound, redirect } from "next/navigation";
import VehicleEditor from "@/components/admin/VehicleEditor";
import { isAdmin } from "@/lib/adminAuth";
import { adminInventory, recordImages } from "@/lib/inventoryData";
import { photos as cliPhotos } from "@/content/photos.generated";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function EditVehicle({ params }: Props) {
  if (!(await isAdmin())) redirect("/admin");
  const { slug } = await params;
  const { vehicles } = await adminInventory();
  const r = vehicles.find((x) => x.v.slug === slug);
  if (!r) notFound();
  const v = r.v;
  const own = r.record ? recordImages(r.record) : [];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-[30px] font-semibold">
        Edit {v.year} {v.make} {v.model}
      </h1>
      {r.source === "content" && (
        <p className="mb-2 mt-1 text-[15px] text-muted">
          This vehicle comes from a content file. Saving here stores it in the admin, and the admin copy is what the site shows from then on.
        </p>
      )}
      <div className="mt-6">
        <VehicleEditor
          mode="update"
          slug={v.slug}
          cliPhotoCount={own.length ? 0 : (cliPhotos[v.slug]?.length ?? 0)}
          photos={own.map((p, index) => ({ index, src: p.src, width: p.width, height: p.height }))}
          initial={{
            year: String(v.year),
            make: v.make,
            model: v.model,
            trim: v.trim ?? "",
            body: v.body,
            price: v.price === "call" ? "" : String(v.price),
            callForPrice: v.price === "call",
            miles: v.miles === null ? "" : String(v.miles),
            drivetrain: v.drivetrain ?? "",
            fuel: v.fuel ?? "",
            origin: v.origin ?? "",
            highlights: (v.highlights ?? []).join("\n"),
            caveat: v.caveat ?? "",
            status: v.status,
            carsForSaleUrl: v.carsForSaleUrl ?? "",
          }}
        />
      </div>
    </div>
  );
}
