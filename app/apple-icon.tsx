import { ImageResponse } from "next/og";
import { markDataUri } from "@/lib/markSvg";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the compact speed badge on carbon black. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0C",
        }}
      >
        <img src={markDataUri} width={136} height={150} alt="" />
      </div>
    ),
    size,
  );
}
