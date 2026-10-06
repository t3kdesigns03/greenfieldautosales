import { site, fullAddress } from "@/content/site";
import type { LiveVehicle } from "@/lib/inventory";

/** LocalBusiness (AutoDealer) JSON-LD — address, phone, hours, geo. */
export function localBusinessSchema() {
  const byHours = new Map<string, string[]>();
  for (const h of site.hours) {
    if (!h.open || !h.close) continue;
    const key = `${h.open}-${h.close}`;
    byHours.set(key, [...(byHours.get(key) ?? []), h.name]);
  }
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: site.url,
    telephone: site.phone.e164,
    image: `${site.url}/opengraph-image`,
    logo: `${site.url}/icon.svg`,
    foundingDate: "2008-07",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
    openingHoursSpecification: [...byHours.entries()].map(([key, days]) => {
      const [opens, closes] = key.split("-");
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: days.map((d) => `https://schema.org/${d}`),
        opens,
        closes,
      };
    }),
    sameAs: ["https://www.greenfieldautosales.net/"],
  };
}

/** schema.org Car for a detail page. Offer only when there's a real price. */
export function vehicleSchema(v: LiveVehicle) {
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: v.title,
    url: `${site.url}/inventory/${v.slug}`,
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    vehicleModelDate: String(v.year),
    itemCondition: "https://schema.org/UsedCondition",
    ...(v.vin && { vehicleIdentificationNumber: v.vin }),
    ...(v.images.length && { image: v.images.slice(0, 8).map((i) => `${site.url}${i.src}`) }),
    ...(v.engine && { vehicleEngine: { "@type": "EngineSpecification", name: v.engine } }),
    ...(v.transmission && { vehicleTransmission: v.transmission }),
    bodyType: v.bodyStyle ?? v.body,
    ...(v.miles !== null && {
      mileageFromOdometer: { "@type": "QuantitativeValue", value: v.miles, unitCode: "SMI" },
    }),
    ...(v.exterior && { color: v.exterior }),
    ...(v.drivetrain && { driveWheelConfiguration: v.drivetrain }),
    ...(v.fuel && { fuelType: v.fuel }),
    ...(typeof v.price === "number" && {
      offers: {
        "@type": "Offer",
        price: v.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        seller: { "@id": `${site.url}/#business` },
      },
    }),
  };
}
