import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { markDataUri } from "@/lib/markSvg";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: 72,
          background: "linear-gradient(165deg, #1F6B3A 0%, #164E2A 75%)",
          color: "#FFFCF7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={markDataUri} width={112} height={112} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 54, fontWeight: 700, letterSpacing: 3 }}>GREENFIELD</div>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 12, color: "#C4A15A" }}>AUTO SALES</div>
          </div>
        </div>
        <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1, maxWidth: 1000 }}>{site.tagline}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#F4EFE4" }}>
          <span>
            {site.address.city}, Iowa · Since {site.since.year}
          </span>
          <span style={{ color: "#C4A15A", fontWeight: 700 }}>{site.phone.display}</span>
        </div>
      </div>
    ),
    size,
  );
}
