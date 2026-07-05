import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Dr. B.V.R.C. Purushottam — AI, Governance & Philosophy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0F1A2E 0%, #1B2A4A 60%, #243654 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: "64px 80px",
        position: "relative",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* Subtle grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Gold top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: "linear-gradient(90deg, #14B8A6, #5EEAD4)",
        }}
      />

      {/* Eyebrow */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#14B8A6",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 24,
          display: "flex",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        IAS · AI · Governance · Philosophy
      </div>

      {/* Name */}
      <div
        style={{
          fontSize: 58,
          fontWeight: 700,
          color: "#FFFFFF",
          lineHeight: 1.1,
          marginBottom: 20,
          display: "flex",
        }}
      >
        Dr. B.V.R.C. Purushottam
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 24,
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.55,
          maxWidth: 760,
          display: "flex",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        A civil servant&apos;s notebook on AI, philosophy of mind, and the
        art of governing 1.4 billion people.
      </div>

      {/* Domain */}
      <div
        style={{
          marginTop: 44,
          fontSize: 18,
          color: "#14B8A6",
          fontWeight: 600,
          letterSpacing: "0.04em",
          display: "flex",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        basavapurushottam.com
      </div>
    </div>,
    size
  );
}
