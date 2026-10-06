import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CallBar from "@/components/CallBar";
import JsonLd from "@/components/JsonLd";
import { site } from "@/content/site";
import { localBusinessSchema } from "@/lib/schema";

/*
 * Fonts are self-hosted (app/fonts, SIL Open Font License) so builds never
 * depend on reaching Google Fonts. Fraunces = wordmark + headlines,
 * Source Sans 3 = UI and body.
 */
const display = localFont({
  src: [
    { path: "./fonts/fraunces-latin-opsz-normal.woff2", style: "normal", weight: "100 900" },
    { path: "./fonts/fraunces-latin-opsz-italic.woff2", style: "italic", weight: "100 900" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const sans = localFont({
  src: [
    { path: "./fonts/source-sans-3-latin-wght-normal.woff2", style: "normal", weight: "200 900" },
    { path: "./fonts/source-sans-3-latin-wght-italic.woff2", style: "italic", weight: "200 900" },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Used Cars & Trucks in Greenfield, Iowa`,
    template: `%s | ${site.name}`,
  },
  description:
    "Family-owned used car and truck lot in Greenfield, Iowa since 2008. Straight prices, low-rust out-of-state vehicles, and Luke answers the phone.",
  applicationName: site.name,
  formatDetection: { telephone: true, address: true },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#164E2A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets reveal-on-scroll hide content only when JS is actually running */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <JsonLd data={localBusinessSchema()} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CallBar />
      </body>
    </html>
  );
}
