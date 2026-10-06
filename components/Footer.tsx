import Link from "next/link";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import { site, telHref, smsHref, fullAddress, mapsLink } from "@/content/site";

/** One shared footer. Hours always live here. */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-20 border-t border-white/[0.07] bg-panel">
      <div className="h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      <div className="container-x grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr_0.8fr]">
        <div>
          <Logo badgeClass="h-16 w-auto" wordmarkClass="h-[52px] w-auto" />
          <p className="mt-4 max-w-xs font-display text-[19px] leading-snug text-fg/90">{site.tagline}</p>
          <p className="mt-3 text-[15px] text-muted">
            Family-owned and selling in Greenfield since {site.since.month} {site.since.year}.
          </p>
        </div>

        <div>
          <h2 className="eyebrow">Visit</h2>
          <address className="mt-3 not-italic text-[16px] leading-relaxed">
            {site.address.street}
            <br />
            {site.address.city}, {site.address.region} {site.address.postalCode}
          </address>
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-tap items-center gap-1.5 text-[15px] font-semibold text-leaf hover:underline"
            aria-label={`Directions to ${fullAddress} (opens Google Maps)`}
          >
            <Icon name="pin" className="h-4 w-4" />
            Get directions
          </a>
          <a href={telHref} className="flex min-h-tap items-center gap-2 text-[18px] font-bold hover:text-leaf">
            <Icon name="phone" className="h-[18px] w-[18px] text-muted" />
            {site.phone.display}
          </a>
          <a href={smsHref()} className="flex min-h-tap items-center gap-2 text-[16px] font-semibold text-muted hover:text-fg">
            <Icon name="text" className="h-[18px] w-[18px]" />
            Text {site.textPhone.display}
          </a>
        </div>

        <div>
          <h2 className="eyebrow">Hours</h2>
          <dl className="mt-3 space-y-1.5 text-[16px]">
            {site.hoursSummary.map((h) => (
              <div key={h.label} className="flex justify-between gap-4 md:block">
                <dt className="text-muted">{h.label}</dt>
                <dd className="font-semibold">{h.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <nav aria-label="Footer">
          <h2 className="eyebrow">Pages</h2>
          <ul className="mt-2 grid grid-cols-2 md:grid-cols-1">
            {[{ href: "/", label: "Home" }, ...site.nav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-tap min-w-tap items-center text-[16px] text-fg/80 hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/[0.07]">
        <div className="container-x flex flex-col gap-2 py-5 text-[14px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name} · {site.address.city}, Iowa
          </p>
          <p>
            Listings are also on{" "}
            <a
              href={site.inventorySourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/30 underline-offset-4 hover:text-fg"
            >
              our Carsforsale page
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
