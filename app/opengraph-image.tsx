import { ImageResponse } from "next/og";

export const alt = "AUXDROP — Beatmakers. Go head-to-head.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Icon reproduced inline from design/assets/auxdrop_original_icon.svg,
// recolored white to match how it's used on dark backgrounds elsewhere
// (next/og's renderer can't load an external/relative SVG file).
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "#050506",
        }}
      >
        <svg width="96" height="96" viewBox="0 0 1254 1254" fill="none">
          <path
            fill="#F7F7F5"
            fillRule="evenodd"
            d="M285 841 L389 840 L465 676 L510 655 L626 453 L742 655 L786 675 L863 841 L968 841 L674 346 L654 345 L579 346 Z"
          />
          <rect x="489" y="707" width="38" height="103" rx="19" fill="#F7F7F5" />
          <rect x="547" y="645" width="40" height="214" rx="20" fill="#F7F7F5" />
          <rect x="605" y="576" width="43" height="335" rx="21.5" fill="#F7F7F5" />
          <rect x="666" y="645" width="40" height="214" rx="20" fill="#F7F7F5" />
          <rect x="726" y="707" width="38" height="103" rx="19" fill="#F7F7F5" />
        </svg>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: -1,
            color: "#F7F7F5",
          }}
        >
          AUXDROP
        </div>
        <div style={{ fontSize: 28, fontWeight: 500, color: "#A1A1AA" }}>
          Beatmakers. Go head-to-head.
        </div>
      </div>
    ),
    { ...size },
  );
}
