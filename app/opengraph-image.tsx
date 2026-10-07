import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { lockupDataUri, lockupSize } from "@/lib/markSvg";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social card: the standard header lockup (flags + badge + wordmark) on carbon black with a red horizon glow. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "radial-gradient(70% 60% at 80% 0%, rgba(200,16,26,0.38) 0%, rgba(10,10,12,0) 70%), linear-gradient(180deg, #141418 0%, #0A0A0C 100%)",
          color: "#F2F3F5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginLeft: -40, marginTop: -24 }}>
          <img src={lockupDataUri} width={1000} height={Math.round((1000 * lockupSize.h) / lockupSize.w)} alt="" />
        </div>
        <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.1, maxWidth: 1050 }}>{site.tagline}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#C7CCD4" }}>
          <span>
            {site.address.city}, Iowa · Since {site.since.year}
          </span>
          <span style={{ color: "#FF545E", fontWeight: 700 }}>{site.phone.display}</span>
        </div>
      </div>
    ),
    size,
  );
}
