import { ImageResponse } from "next/og";

export const alt = "Daphne's Portfolio — a first birthday keepsake";
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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #FFF0EB 0%, #FDDDD4 100%)",
          position: "relative",
        }}
      >
        {/* soft corner accents */}
        <div style={{ position: "absolute", top: 48, left: 64, width: 26, height: 26, borderRadius: 13, background: "#C5B3E0", opacity: 0.6 }} />
        <div style={{ position: "absolute", top: 110, right: 90, width: 18, height: 18, borderRadius: 9, background: "#9FC8EE", opacity: 0.6 }} />
        <div style={{ position: "absolute", bottom: 90, left: 120, width: 20, height: 20, borderRadius: 10, background: "#A6DEC0", opacity: 0.6 }} />
        <div style={{ position: "absolute", bottom: 60, right: 140, width: 24, height: 24, borderRadius: 12, background: "#F9C5BC", opacity: 0.8 }} />

        <svg width="110" height="110" viewBox="0 0 24 24" style={{ marginBottom: 28 }}>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#F4846A"
          />
        </svg>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#3D2C2C" }}>
          Daphne&apos;s Portfolio
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#7A5C5C", marginTop: 18 }}>
          A first birthday keepsake · watching it grow since June 12, 2026
        </div>
      </div>
    ),
    { ...size }
  );
}
