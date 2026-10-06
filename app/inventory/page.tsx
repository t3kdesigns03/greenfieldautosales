import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import InventoryBrowser from "@/components/InventoryBrowser";
import VehicleCard from "@/components/VehicleCard";
import { liveVehicles } from "@/lib/inventory";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Used Trucks, SUVs, Vans & Cars for Sale",
  description:
    "Every used truck, SUV, van and car on the Greenfield Auto Sales lot in Greenfield, Iowa, with photos, asking price and miles. Filter by type, make, price, year, miles and drivetrain.",
  alternates: { canonical: "/inventory" },
  openGraph: { url: "/inventory" },
};

export default function InventoryPage() {
  const vehicles = liveVehicles();
  return (
    <>
      <PageHeader eyebrow={`${vehicles.length} on the lot · Greenfield, Iowa`} title="Shop the lot" compact>
        <p>
          Asking prices and real miles. Questions about any of them? Call{" "}
          <span className="whitespace-nowrap font-semibold text-fg">{site.phone.display}</span> or text{" "}
          <span className="whitespace-nowrap font-semibold text-fg">{site.textPhone.display}</span>.
        </p>
      </PageHeader>
      {/* Fallback = the full unfiltered grid (also what crawlers and no-JS visitors see). */}
      <Suspense
        fallback={
          <div className="container-x py-8">
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((v) => (
                <li key={v.slug} className="flex">
                  <VehicleCard v={v} headingLevel="h2" className="w-full" />
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <InventoryBrowser vehicles={vehicles} />
      </Suspense>
    </>
  );
}
