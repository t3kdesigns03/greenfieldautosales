import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import HoursTable from "@/components/HoursTable";
import OpenStatus from "@/components/OpenStatus";
import Icon from "@/components/Icon";
import { site, telHref, smsHref, mapsLink, mapsEmbed, fullAddress } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact, Hours & Directions",
  description:
    "Greenfield Auto Sales, 503 NE 6th St, Greenfield, IA 50849. Call (641) 329-6186. Open Mon–Fri 9:30am–5:30pm, Sat 9:30am–2:00pm, closed Sunday.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Call, text, or stop by">
        <p>The fastest way to an answer is a phone call. {site.ownerFirst} picks up.</p>
      </PageHeader>

      <div className="container-x grid gap-6 py-8 md:grid-cols-2 md:gap-8 md:py-12">
        <div className="space-y-6">
          <section className="card p-5 sm:p-6" aria-labelledby="call-title">
            <h2 id="call-title" className="text-[24px] font-semibold">
              Phone
            </h2>
            <a
              href={telHref}
              className="mt-2 flex min-h-tap items-center gap-2 font-display text-[32px] font-bold text-leaf hover:text-leaf"
            >
              <Icon name="phone" className="h-7 w-7" />
              {site.phone.display}
            </a>
            <div className="mt-4 grid gap-2.5 xs:grid-cols-2">
              <a href={telHref} className="btn-go">
                <Icon name="phone" className="h-5 w-5" />
                Call
              </a>
              <a href={smsHref()} className="btn-ghost">
                <Icon name="text" className="h-5 w-5" />
                Text
              </a>
            </div>
            <p className="mt-3 text-[14px] text-muted">Texts go to {site.textPhone.display}.</p>
          </section>

          <section className="card p-5 sm:p-6" aria-labelledby="hours-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="hours-title" className="text-[24px] font-semibold">
                Hours
              </h2>
              <OpenStatus />
            </div>
            <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
              <HoursTable />
            </div>
          </section>
        </div>

        <section className="card overflow-hidden" aria-labelledby="map-title">
          <div className="p-5 sm:p-6">
            <h2 id="map-title" className="text-[24px] font-semibold">
              Find the lot
            </h2>
            <address className="mt-2 flex items-start gap-2 text-[18px] not-italic">
              <Icon name="pin" className="mt-1 h-5 w-5 shrink-0 text-leaf" />
              <span>
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postalCode}
              </span>
            </address>
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="btn-go mt-4 w-full xs:w-auto">
              Get directions
              <Icon name="external" className="h-[18px] w-[18px]" />
            </a>
          </div>
          <div className="relative aspect-[4/3] w-full bg-panel md:aspect-auto md:h-[420px]">
            <iframe
              title={`Map of ${site.name}, ${fullAddress}`}
              src={mapsEmbed}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>
      </div>
    </>
  );
}
