import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Coming Soon — Dr. B.V.R.C. Purushottam",
  robots: "noindex",
};

function getConfig() {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "data", "site-config.json"), "utf8"));
  } catch {
    return {
      maintenanceMessage: "We are working on something great. Back soon.",
      maintenanceSubtext: "Thank you for your patience.",
    };
  }
}

export default function MaintenancePage() {
  const config = getConfig();
  return <MaintenanceUI config={config} />;
}

export function MaintenanceUI({ config }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, var(--navy) 0%, #162236 40%, #1a2a40 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Source Sans 3', system-ui, sans-serif",
      color: "#fff",
      padding: "40px 24px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background glow */}
      <div style={{
        position: "absolute", top: "-20%", right: "-10%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", left: "-10%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(67,99,212,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Gold top line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
      }} />

      {/* Content */}
      <div style={{ textAlign: "center", maxWidth: 560, position: "relative", zIndex: 1 }}>

        {/* Logo */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--gold), #f0c84a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 32px",
          fontSize: 28, fontWeight: 800, color: "#0F1A2E",
          boxShadow: "0 8px 32px rgba(20,184,166,0.3)",
          fontFamily: "Georgia, serif",
        }}>BP</div>

        {/* Eyebrow */}
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "#14B8A6", marginBottom: 20,
        }}>
          basavapurushottam.com
        </div>

        {/* Divider */}
        <div style={{
          width: 48, height: 2,
          background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
          margin: "0 auto 28px",
        }} />

        {/* Heading */}
        <h1 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
          fontWeight: 700, color: "#fff",
          lineHeight: 1.25, letterSpacing: "-0.02em",
          margin: "0 0 20px",
        }}>
          {config.maintenanceMessage}
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize: 17, color: "rgba(255,255,255,0.55)",
          lineHeight: 1.7, margin: "0 0 48px",
        }}>
          {config.maintenanceSubtext}
        </p>

        {/* Decorative dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 48 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: i === 1 ? 24 : 8, height: 6, borderRadius: 3,
              background: i === 1 ? "#14B8A6" : "rgba(20,184,166,0.3)",
            }} />
          ))}
        </div>

        {/* Contact */}
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>
          For urgent enquiries —{" "}
          <a href="mailto:basava.ias@gmail.com" style={{ color: "rgba(20,184,166,0.7)", textDecoration: "none" }}>
            basava.ias@gmail.com
          </a>
        </p>
      </div>

      {/* Bottom */}
      <div style={{
        position: "absolute", bottom: 24,
        fontSize: 11, color: "rgba(255,255,255,0.18)", letterSpacing: "0.04em",
      }}>
        Dr. B.V.R.C. Purushottam, IAS
      </div>
    </div>
  );
}
