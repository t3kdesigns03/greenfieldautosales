/**
 * content/site.ts — the business facts. Edit here, not in components.
 *
 * Phone number: change `phone.display` and `phone.e164` together.
 * Everything else (header, call bar, footer, JSON-LD, buttons) reads from here.
 */

export type DayHours = {
  /** Short label used in tables */
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  /** Full name, also used for schema.org */
  name: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  /** 24h "HH:MM", or null when closed */
  open: string | null;
  close: string | null;
};

export const site = {
  name: "Greenfield Auto Sales",
  shortName: "Greenfield Auto",
  /** Selling cars since July 2008 */
  since: { year: 2008, month: "July" },

  /** The new site's canonical origin. Change this when the domain is pointed here. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://greenfieldautosales.netlify.app",

  /** Inventory system of record (Carsforsale). Not replaced in phase 1. */
  inventorySourceUrl: "https://www.greenfieldautosales.net/cars-for-sale",

  /** Lot line. Every "Call" button uses this. */
  phone: {
    display: "(641) 329-6186",
    /** Used for tel: links. Keep in sync with display. */
    e164: "+16413296186",
  },

  /** Text line. Same number as the lot line. Every "Text" button uses this. */
  textPhone: {
    display: "(641) 329-6186",
    e164: "+16413296186",
  },

  /**
   * Sold listings on Carsforsale as of 2026-10-05 (572 total, 11 live).
   * Shown as "560+ sold". Update now and then, or set to null to hide.
   */
  soldCount: 561 as number | null,

  address: {
    street: "503 NE 6th St",
    city: "Greenfield",
    region: "IA",
    postalCode: "50849",
    country: "US",
  },

  /** Map pin. From public listing data — confirm against Google Maps before cutover. */
  geo: { lat: 41.3094335, lng: -94.4530149 },

  hours: [
    { day: "Mon", name: "Monday", open: "09:30", close: "17:30" },
    { day: "Tue", name: "Tuesday", open: "09:30", close: "17:30" },
    { day: "Wed", name: "Wednesday", open: "09:30", close: "17:30" },
    { day: "Thu", name: "Thursday", open: "09:30", close: "17:30" },
    { day: "Fri", name: "Friday", open: "09:30", close: "17:30" },
    { day: "Sat", name: "Saturday", open: "09:30", close: "14:00" },
    { day: "Sun", name: "Sunday", open: null, close: null },
  ] satisfies DayHours[],

  /** Compact hours for the footer. Keep in sync with `hours` above. */
  hoursSummary: [
    { label: "Mon–Fri", value: "9:30am – 5:30pm" },
    { label: "Saturday", value: "9:30am – 2:00pm" },
    { label: "Sunday", value: "Closed" },
  ],

  tagline: "Quality used cars, trucks and SUVs in Greenfield, Iowa.",

  /**
   * Hero lot photo. Drop a real photo of the lot in /public (e.g. /public/lot.jpg,
   * ~1600px wide, landscape) and set this to "/lot.jpg". While null, the hero
   * shows an illustrated placeholder.
   */
  lotPhoto: null as string | null,

  nav: [
    { href: "/inventory", label: "Inventory" },
    { href: "/trade", label: "Trade-in" },
    { href: "/financing", label: "Financing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

export const telHref = `tel:${site.phone.e164}`;
export const smsHref = (body?: string) =>
  `sms:${site.textPhone.e164}${body ? `?&body=${encodeURIComponent(body)}` : ""}`;

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.name}, ${fullAddress}`,
)}`;

export const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

export const yearsSelling = () => new Date().getFullYear() - site.since.year;

/** "9:30am" from "09:30" */
export function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}
