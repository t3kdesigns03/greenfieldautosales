import { redirect } from "next/navigation";
import VehicleEditor from "@/components/admin/VehicleEditor";
import { isAdmin } from "@/lib/adminAuth";
import { adminInventory } from "@/lib/inventoryData";

export const dynamic = "force-dynamic";

export default async function NewVehicle() {
  if (!(await isAdmin())) redirect("/admin");
  const { vehicles } = await adminInventory();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-[30px] font-semibold">New vehicle</h1>
      <VehicleEditor mode="create" takenSlugs={vehicles.map((r) => r.v.slug)} />
    </div>
  );
}
