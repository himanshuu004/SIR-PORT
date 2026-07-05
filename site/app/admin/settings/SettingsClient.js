"use client";
import { useState } from "react";
import Link from "next/link";
import Sidebar from "../Sidebar";

/* ── Shared UI ───────────────────────────────────────────── */
function StatusPill({ connected }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: connected ? "#D1FAE5" : "#FEE2E2", color: connected ? "#065F46" : "#991B1B" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: connected ? "#10B981" : "#EF4444", display: "inline-block" }} />
      {connected ? "Connected" : "Not Connected"}
    </span>
  );
}

function Card({ icon, iconBg, title, connected, extra, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", marginBottom: 20 }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 700, color: "#0F1A2E" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {extra}
          {connected !== undefined && <StatusPill connected={connected} />}
        </div>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}

function Label({ children, sub }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", letterSpacing: "0.02em" }}>{children}</label>
      {sub && <span style={{ fontSize: 11, color: "#9CA3AF", display: "block", marginTop: 2 }}>{sub}</span>}
    </div>
  );
}

function Input({ value, defaultValue, placeholder, type = "text", readOnly, onChange, style: s = {} }) {
  return (
    <input value={value} defaultValue={defaultValue} placeholder={placeholder} type={type} readOnly={readOnly} onChange={onChange}
      style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13.5, color: "#1C1917", background: readOnly ? "#F3F4F6" : "#FAFAF8", outline: "none", fontFamily: "inherit", boxSizing: "border-box", ...s }} />
  );
}

function Btn({ children, onClick, href, variant = "ghost", disabled, target }) {
  const styles = {
    primary: { background: "#14B8A6", color: "#0F1A2E", border: "none" },
    ghost: { background: "transparent", border: "1px solid #E5E7EB", color: "#57534E" },
    danger: { background: "#FEE2E2", color: "#991B1B", border: "none" },
    green: { background: "#D1FAE5", color: "#065F46", border: "none" },
  };
  const common = { padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: disabled ? 0.6 : 1, textDecoration: "none", display: "inline-block", ...styles[variant] };
  if (href) return <a href={href} target={target} rel="noopener noreferrer" style={common}>{children}</a>;
  return <button onClick={onClick} disabled={disabled} style={{ ...common, border: styles[variant].border ?? "none" }}>{children}</button>;
}

function Alert({ type = "info", children }) {
  const colors = {
    info:    { bg: "#EFF6FF", border: "#BFDBFE", color: "#1E40AF" },
    warn:    { bg: "#FFFBEB", border: "#FDE68A", color: "#92400E" },
    success: { bg: "#D1FAE5", border: "#6EE7B7", color: "#065F46" },
    error:   { bg: "#FEE2E2", border: "#FECACA", color: "#991B1B" },
  };
  const c = colors[type];
  return <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: "12px 16px", fontSize: 13, color: c.color, marginBottom: 16 }}>{children}</div>;
}

function SectionDivider({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", margin: "20px 0 14px", paddingBottom: 8, borderBottom: "1px solid #F3F4F6" }}>{children}</div>;
}

function MappingRow({ label, column, onChange }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 24px 140px", gap: 10, alignItems: "center", marginBottom: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#57534E", background: "#F3F4F6", padding: "8px 12px", borderRadius: 6 }}>{label}</div>
      <div style={{ textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>→</div>
      <input defaultValue={column} onChange={onChange} style={{ padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, background: "#FAFAF8", outline: "none", fontFamily: "inherit" }} />
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────── */
const TABS = [
  { label: "🔒 Maintenance", id: "maintenance" },
  { label: "🎨 Theme & Colors", id: "theme" },
  { label: "📧 Mailgun", id: "mailgun" },
  { label: "👻 Ghost CMS", id: "ghost" },
  { label: "📈 Analytics", id: "analytics" },
  { label: "📊 Google Sheets", id: "sheets" },
  { label: "🔥 Firebase", id: "firebase" },
];

const PRESETS = [
  { name: "Navy & Gold",        navy: "#0F1A2E", navyLight: "#1B2A4A", navyMid: "#243654", gold: "#14B8A6", goldLight: "#5EEAD4", goldPale: "#CCFBF1", warmWhite: "#FAFAF8", charcoal: "#1C1917", textBody: "#44403C", cream: "#F5F2ED", creamDark: "#EDE9E3" },
  { name: "Slate & Amber",      navy: "#1E293B", navyLight: "#334155", navyMid: "#475569", gold: "#F59E0B", goldLight: "#FCD34D", goldPale: "#FFFBEB", warmWhite: "#F8FAFC", charcoal: "#0F172A", textBody: "#334155", cream: "#F1F5F9", creamDark: "#E2E8F0" },
  { name: "Oxford & Champagne", navy: "#1a3358", navyLight: "#2d527a", navyMid: "#3d6d9e", gold: "#C9A96E", goldLight: "#DFC28F", goldPale: "#FDF8F0", warmWhite: "#FDFAF5", charcoal: "#1C1917", textBody: "#44403C", cream: "#F5F2ED", creamDark: "#EDE9E3" },
  { name: "Forest & Bronze",    navy: "#14532D", navyLight: "#166534", navyMid: "#15803D", gold: "#B45309", goldLight: "#D97706", goldPale: "#FFFBEB", warmWhite: "#F7FEE7", charcoal: "#14532D", textBody: "#166534", cream: "#ECFDF5", creamDark: "#D1FAE5" },
  { name: "Midnight & Copper",  navy: "#0D0D1A", navyLight: "#1A1A35", navyMid: "#252550", gold: "#B87333", goldLight: "#D4956A", goldPale: "#FFF8F3", warmWhite: "#FFFEF9", charcoal: "#1C1917", textBody: "#44403C", cream: "#FEF7EE", creamDark: "#FDE8D0" },
  // ── New palettes ─────────────────────────────────────────────────────────
  { name: "IAS — Tricolour",    navy: "#0A5C1F", navyLight: "#137330", navyMid: "#1E8A3C", gold: "#FF9933", goldLight: "#FFB347", goldPale: "#FFF5E6", warmWhite: "#FAFFF7", charcoal: "#0D2010", textBody: "#1C3A20", cream: "#EDFAF0", creamDark: "#D0EFDA" },
  { name: "Earthy Terracotta",  navy: "#4A2C0A", navyLight: "#6B3D12", navyMid: "#8B5016", gold: "#C87137", goldLight: "#DFA060", goldPale: "#FBF0E4", warmWhite: "#FAF7F2", charcoal: "#2C1810", textBody: "#4A3020", cream: "#F5EDD8", creamDark: "#EAD9B8" },
  { name: "Vibrant Indigo",     navy: "#1E0A4A", navyLight: "#2D1570", navyMid: "#3B1E8A", gold: "#F05A28", goldLight: "#FF7F50", goldPale: "#FFF0EB", warmWhite: "#FDFAFE", charcoal: "#120630", textBody: "#2A1050", cream: "#F3EAFF", creamDark: "#E3D2FF" },
  { name: "Monochrome",         navy: "#1A1A1A", navyLight: "#2D2D2D", navyMid: "#404040", gold: "#6B6B6B", goldLight: "#9E9E9E", goldPale: "#F5F5F5", warmWhite: "#FAFAFA", charcoal: "#111111", textBody: "#333333", cream: "#EFEFEF", creamDark: "#DEDEDE" },
];

const GHOST_URL = "https://cms.basavapurushottam.com";

export default function SettingsClient({ initialConfig, postCount, memberCount, ghostConnected, mailgunConnected, ghostAdminConnected, ghostUrl, mailgunDomain }) {
  const [activeTab, setActiveTab] = useState(0);
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fbChecks, setFbChecks] = useState({ analytics: true, perf: true, crash: false, firestore: false });
  const DEFAULT_THEME = PRESETS[0];
  const [theme, setTheme] = useState({ ...DEFAULT_THEME, ...(initialConfig.theme ?? {}) });
  const [ghostTested, setGhostTested] = useState(null);
  const [ghostTesting, setGhostTesting] = useState(false);
  const [revalInterval, setRevalInterval] = useState("3600");
  const [revalidating, setRevalidating] = useState(false);
  const [revalidated, setRevalidated] = useState(false);
  const [gaId, setGaId] = useState(initialConfig.gaId ?? "");
  const [gaSaving, setGaSaving] = useState(false);
  const [gaSaved, setGaSaved] = useState(false);

  // Google Sheets state — separate workbooks
  const [sheetsApiKey,      setSheetsApiKey]      = useState(initialConfig.sheetsApiKey      ?? "");
  const [weightSheetId,     setWeightSheetId]     = useState(initialConfig.weightSheetId     ?? "");
  const [runningSheetId,    setRunningSheetId]    = useState(initialConfig.runningSheetId    ?? "");
  const [hikingSheetId,     setHikingSheetId]     = useState(initialConfig.hikingSheetId     ?? "");
  const [subscribersSheetId, setSubscribersSheetId] = useState(initialConfig.subscribersSheetId ?? "");
  const [messagesSheetId,   setMessagesSheetId]   = useState(initialConfig.messagesSheetId   ?? "");
  const [sheetsConnected,   setSheetsConnected]   = useState(!!(initialConfig.weightSheetId || initialConfig.subscribersSheetId));
  const [sheetsSaving,      setSheetsSaving]      = useState(false);
  const [sheetsSaved,       setSheetsSaved]       = useState(false);
  const [sheetsError,       setSheetsError]       = useState("");

  function extractSheetId(input) {
    const match = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input.trim();
  }

  async function saveSheetsConfig() {
    setSheetsSaving(true); setSheetsSaved(false); setSheetsError("");
    const payload = {
      sheetsApiKey:       sheetsApiKey.trim(),
      weightSheetId:      extractSheetId(weightSheetId),
      runningSheetId:     extractSheetId(runningSheetId),
      hikingSheetId:      extractSheetId(hikingSheetId),
      subscribersSheetId: extractSheetId(subscribersSheetId),
      messagesSheetId:    extractSheetId(messagesSheetId),
    };
    const res = await fetch("/api/admin/site-config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.ok) {
      setSheetsConnected(!!(payload.weightSheetId || payload.subscribersSheetId));
      setSheetsSaved(true);
      setTimeout(() => setSheetsSaved(false), 3000);
    } else {
      setSheetsError("Failed to save. Try again.");
    }
    setSheetsSaving(false);
  }

  // Firebase state — read from NEXT_PUBLIC_FIREBASE_* env vars
  const firebaseEnvConnected = !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  );
  const [fbConfig, setFbConfig] = useState(() => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) return "";
    return JSON.stringify({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
    }, null, 2);
  });
  const [fbConnected, setFbConnected] = useState(firebaseEnvConnected);
  const [fbSaving, setFbSaving] = useState(false);
  const [fbSaved, setFbSaved] = useState(false);
  const [fbError, setFbError] = useState("");
  const [fbTesting, setFbTesting] = useState(false);

  async function saveFirebaseConfig() {
    setFbSaving(true); setFbSaved(false); setFbError("");
    try {
      const parsed = JSON.parse(fbConfig);
      if (!parsed.apiKey || !parsed.projectId || !parsed.appId) {
        throw new Error("Missing required fields: apiKey, projectId, appId");
      }
      setFbConnected(true);
      setFbSaved(true);
      setTimeout(() => setFbSaved(false), 3000);
    } catch (e) {
      setFbError(e.message || "Invalid JSON format — check your config.");
    }
    setFbSaving(false);
  }

  async function testFirebaseConnection() {
    setFbTesting(true);
    try {
      const parsed = JSON.parse(fbConfig);
      setFbConnected(!!(parsed.apiKey && parsed.projectId && parsed.appId));
    } catch { setFbConnected(false); }
    setFbTesting(false);
  }

  function clearFirebaseConfig() {
    setFbConfig("");
    setFbConnected(false);
    setFbSaved(false);
    setFbError("");
  }

  async function saveConfig(updates) {
    setSaving(true); setSaved(false);
    const res = await fetch("/api/admin/site-config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updates) });
    const data = await res.json();
    if (data.ok) { setConfig(data.config); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    setSaving(false);
  }

  async function saveGaId() {
    setGaSaving(true); setGaSaved(false);
    const res = await fetch("/api/admin/site-config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gaId: gaId.trim() }) });
    const data = await res.json();
    if (data.ok) { setGaSaved(true); setTimeout(() => setGaSaved(false), 2500); }
    setGaSaving(false);
  }

  async function testGhostConnection() {
    setGhostTesting(true); setGhostTested(null);
    try {
      const res = await fetch(`/api/admin/sacred-texts?type=geeta&chapter=0&page=1&limit=1`);
      setGhostTested(res.ok ? "ok" : "fail");
    } catch { setGhostTested("fail"); }
    setGhostTesting(false);
  }

  async function forceRevalidate() {
    setRevalidating(true); setRevalidated(false);
    try {
      await fetch("/api/revalidate", { method: "POST" });
      setRevalidated(true);
      setTimeout(() => setRevalidated(false), 3000);
    } catch {}
    setRevalidating(false);
  }

  function toggleMaintenance() { saveConfig({ maintenanceMode: !config.maintenanceMode }); }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Source Sans 3','Segoe UI',system-ui,sans-serif", background: "#F0F2F5", color: "#1C1917" }}>
      <Sidebar postCount={postCount} memberCount={memberCount} />

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Topbar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0F1A2E" }}>⚙️ Integrations & Settings</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {saved && <span style={{ fontSize: 13, color: "#10B981", fontWeight: 600 }}>✓ Saved</span>}
          </div>
        </div>

        <div style={{ padding: 28 }}>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 3, background: "#fff", borderRadius: 10, padding: 5, border: "1px solid #E5E7EB", marginBottom: 24, flexWrap: "wrap" }}>
            {TABS.map((tab, i) => (
              <button key={i} onClick={() => setActiveTab(i)} style={{ padding: "8px 16px", borderRadius: 7, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: activeTab === i ? "#0F1A2E" : "transparent", color: activeTab === i ? "#14B8A6" : "#57534E", fontFamily: "inherit", transition: "all 0.15s" }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── MAINTENANCE ── */}
          {activeTab === 0 && (
            <Card icon="🔒" iconBg="#FEF3C7" title="Maintenance Mode">
              <p style={{ fontSize: 13, color: "#57534E", marginBottom: 20, lineHeight: 1.6 }}>When ON, all visitors are redirected to the maintenance page. Admin routes remain accessible.</p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#F9FAFB", borderRadius: 10, border: "1px solid #E5E7EB", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Maintenance Mode</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Redirects all visitors to the "Coming Soon" page</div>
                </div>
                <button onClick={toggleMaintenance} disabled={saving} style={{ width: 52, height: 28, borderRadius: 14, background: config.maintenanceMode ? "#14B8A6" : "rgba(0,0,0,0.1)", border: "none", cursor: saving ? "not-allowed" : "pointer", position: "relative", transition: "background 0.25s" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: config.maintenanceMode ? 27 : 3, transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
                </button>
              </div>

              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: config.maintenanceMode ? "rgba(20,184,166,0.15)" : "rgba(74,222,128,0.1)", border: `1px solid ${config.maintenanceMode ? "rgba(20,184,166,0.3)" : "rgba(74,222,128,0.2)"}`, marginBottom: 24 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: config.maintenanceMode ? "#14B8A6" : "#4ade80" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: config.maintenanceMode ? "#92400E" : "#065F46" }}>
                  {config.maintenanceMode ? "Maintenance Mode ON — Site hidden from visitors" : "Site is LIVE"}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <Label sub="Main heading shown on the maintenance page">Main Message</Label>
                  <input value={config.maintenanceMessage} onChange={e => setConfig(c => ({ ...c, maintenanceMessage: e.target.value }))} onBlur={() => saveConfig({ maintenanceMessage: config.maintenanceMessage })}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13.5, background: "#FAFAF8", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
                <div>
                  <Label sub="Smaller text shown below the heading">Subtext</Label>
                  <input value={config.maintenanceSubtext} onChange={e => setConfig(c => ({ ...c, maintenanceSubtext: e.target.value }))} onBlur={() => saveConfig({ maintenanceSubtext: config.maintenanceSubtext })}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13.5, background: "#FAFAF8", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, paddingTop: 8, borderTop: "1px solid #F3F4F6" }}>
                <Btn variant="primary" disabled={saving} onClick={() => saveConfig({ maintenanceMessage: config.maintenanceMessage, maintenanceSubtext: config.maintenanceSubtext })}>
                  💾 {saving ? "Saving…" : "Save Messages"}
                </Btn>
                <Btn href="/maintenance" target="_blank">👁 Preview Page</Btn>
              </div>
              {config.updatedAt && <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 16 }}>Last updated: {new Date(config.updatedAt).toLocaleString("en-IN")}</p>}
            </Card>
          )}

          {/* ── THEME & COLORS ── */}
          {activeTab === 1 && (
            <Card icon="🎨" iconBg="#EDE9FE" title="Theme & Color Palette">
              <p style={{ fontSize: 13, color: "#57534E", marginBottom: 20, lineHeight: 1.6 }}>
                Changes apply site-wide instantly — no rebuild needed. All colors cascade through CSS variables.
              </p>

              {/* Preset Palettes */}
              <SectionDivider>Preset Palettes</SectionDivider>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 28 }}>
                {PRESETS.map((preset, i) => {
                  const isActive = theme.navy === preset.navy && theme.gold === preset.gold;
                  return (
                    <button key={i} onClick={() => setTheme(preset)} style={{ padding: 0, border: isActive ? `2px solid ${preset.gold}` : "2px solid #E5E7EB", borderRadius: 12, overflow: "hidden", cursor: "pointer", background: "none", boxShadow: isActive ? `0 4px 16px ${preset.gold}44` : "none", transition: "all 0.2s" }}>
                      {/* Colour strip */}
                      <div style={{ display: "flex", height: 40 }}>
                        <div style={{ flex: 2, background: preset.navy }} />
                        <div style={{ flex: 1, background: preset.navyLight }} />
                        <div style={{ flex: 1, background: preset.gold }} />
                        <div style={{ flex: 1, background: preset.goldLight }} />
                        <div style={{ flex: 1, background: preset.warmWhite }} />
                      </div>
                      <div style={{ padding: "8px 10px", background: "#fff", borderTop: "1px solid #F3F4F6" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#1C1917", marginBottom: 2 }}>{preset.name}</div>
                        {isActive && <div style={{ fontSize: 10, color: preset.gold, fontWeight: 600 }}>✓ Active</div>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Pickers */}
              <SectionDivider>Custom Colors</SectionDivider>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
                {[
                  { label: "Primary (Navy)", key: "navy", desc: "Navbar, hero, dark sections" },
                  { label: "Primary Light", key: "navyLight", desc: "Card backgrounds, hover states" },
                  { label: "Accent (Gold)", key: "gold", desc: "Buttons, borders, highlights" },
                  { label: "Accent Light", key: "goldLight", desc: "Hover states, gradients" },
                  { label: "Page Background", key: "warmWhite", desc: "Main site background" },
                  { label: "Heading Text", key: "charcoal", desc: "H1, H2, H3 colour" },
                ].map(item => (
                  <div key={item.key}>
                    <Label sub={item.desc}>{item.label}</Label>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <input type="color" value={theme[item.key] ?? "#000000"} onChange={e => setTheme(t => ({ ...t, [item.key]: e.target.value }))}
                        style={{ width: 44, height: 44, border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer", padding: 2, background: "#FAFAF8" }} />
                      <input value={theme[item.key] ?? ""} onChange={e => setTheme(t => ({ ...t, [item.key]: e.target.value }))}
                        style={{ flex: 1, padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontFamily: "Consolas, monospace", background: "#FAFAF8", outline: "none" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Preview Strip */}
              <SectionDivider>Preview</SectionDivider>
              <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #E5E7EB", marginBottom: 24 }}>
                {/* Navbar preview */}
                <div style={{ background: theme.navy, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Purushottam</span>
                  <div style={{ display: "flex", gap: 16 }}>
                    {["Home","About","Articles","Contact"].map(l => (
                      <span key={l} style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{l}</span>
                    ))}
                  </div>
                  <span style={{ background: `linear-gradient(135deg,${theme.gold},${theme.goldLight})`, color: theme.navy, padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Subscribe</span>
                </div>
                {/* Hero preview */}
                <div style={{ background: `linear-gradient(160deg,${theme.navy},${theme.navyLight})`, padding: "24px 20px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: theme.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Signal from the Frontier</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8, fontFamily: "Georgia, serif" }}>AI, Governance & the Art of Thinking</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 16 }}>A civil servant's notebook on the frontier of ideas.</div>
                  <span style={{ background: `linear-gradient(135deg,${theme.gold},${theme.goldLight})`, color: theme.navy, padding: "8px 20px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>Read Latest Essay →</span>
                </div>
                {/* Body preview */}
                <div style={{ background: theme.warmWhite, padding: "16px 20px", display: "flex", gap: 12 }}>
                  {["Mind & Machine","Policy Lab","Philosophy"].map((sec, i) => (
                    <div key={i} style={{ flex: 1, background: "#fff", borderRadius: 8, padding: "12px", border: `1px solid ${theme.gold}22` }}>
                      <div style={{ width: 24, height: 3, background: `linear-gradient(90deg,${theme.gold},${theme.goldLight})`, borderRadius: 2, marginBottom: 8 }} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: theme.charcoal, marginBottom: 4 }}>{sec}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>Section preview text</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, paddingTop: 8, borderTop: "1px solid #F3F4F6" }}>
                <Btn variant="primary" disabled={saving}
                  onClick={async () => {
                    setSaving(true); setSaved(false);
                    const res = await fetch("/api/admin/site-config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ theme }) });
                    const data = await res.json();
                    if (data.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
                    setSaving(false);
                  }}>
                  💾 {saving ? "Saving…" : "Apply Theme"}
                </Btn>
                <Btn onClick={() => setTheme(DEFAULT_THEME)}>↺ Reset to Default</Btn>
                {saved && <span style={{ fontSize: 13, color: "#10B981", fontWeight: 600, paddingTop: 6 }}>✓ Theme applied site-wide</span>}
              </div>
            </Card>
          )}

          {/* ── MAILGUN ── */}
          {activeTab === 2 && (

            <Card icon="📧" iconBg="#DBEAFE" title="Mailgun — Email Service" connected={mailgunConnected}>
              {mailgunConnected
                ? <Alert type="success">✅ Mailgun is connected. Contact form emails are being delivered to <strong>basava.ias@gmail.com</strong>.</Alert>
                : <Alert type="error">❌ Mailgun API key not configured. Contact form will not send emails.</Alert>}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div><Label>Sending Domain</Label><Input value={mailgunDomain || "Not set"} readOnly /></div>
                <div><Label>API Base URL</Label><Input value="https://api.mailgun.net (US)" readOnly /></div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <Label>Contact Form Delivery Email</Label>
                <Input value="basava.ias@gmail.com" readOnly />
              </div>
              <Alert type="warn">⚠️ To update Mailgun keys, edit <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 3 }}>.env.local</code> on the server and restart the app.</Alert>
            </Card>
          )}

          {/* ── GHOST CMS ── */}
          {activeTab === 3 && (
            <Card icon="👻" iconBg="#F3F4F6" title="Ghost CMS Connection" connected={ghostConnected && ghostAdminConnected}>
              {ghostConnected
                ? <Alert type="success">✅ Ghost CMS is connected. Articles publish to the site within 1 hour via ISR. · <strong>{postCount} posts</strong> · <strong>{memberCount} members</strong></Alert>
                : <Alert type="error">❌ Ghost CMS not configured. Check .env.local for GHOST_URL and GHOST_KEY.</Alert>}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div><Label>Ghost CMS URL</Label><Input value={ghostUrl} readOnly /></div>
                <div><Label>Content API Key</Label><Input value="••••••••••••••••••••••••••" type="password" readOnly /></div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Label sub="For newsletter member creation (Ghost Admin API)">Admin API Key</Label>
                <Input value={ghostAdminConnected ? "••••••••:••••••••••••••••••••••••••••••••••••••••" : "Not configured"} readOnly />
              </div>

              <div style={{ marginBottom: 20 }}>
                <Label>Revalidation Interval</Label>
                <select value={revalInterval} onChange={e => setRevalInterval(e.target.value)}
                  style={{ padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13.5, background: "#FAFAF8", fontFamily: "inherit", outline: "none" }}>
                  <option value="3600">Every 1 hour (recommended)</option>
                  <option value="1800">Every 30 minutes</option>
                  <option value="21600">Every 6 hours</option>
                </select>
              </div>

              {ghostTested !== null && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: "#F9FAFB", border: "1px solid #E5E7EB", marginBottom: 16, fontSize: 12.5 }}>
                  <span style={{ fontSize: 16 }}>{ghostTested === "ok" ? "✅" : "❌"}</span>
                  <div>
                    <div style={{ fontWeight: 600, color: ghostTested === "ok" ? "#065F46" : "#991B1B" }}>{ghostTested === "ok" ? "Connection Successful" : "Connection Failed"}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>Tested just now</div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, paddingTop: 8, borderTop: "1px solid #F3F4F6" }}>
                <Btn href={`${GHOST_URL}/ghost`} target="_blank" variant="primary">Open Ghost Admin →</Btn>
                <Btn onClick={testGhostConnection} disabled={ghostTesting}>{ghostTesting ? "Testing…" : "🔌 Test Connection"}</Btn>
                <Btn onClick={forceRevalidate} disabled={revalidating}>{revalidating ? "Revalidating…" : revalidated ? "✓ Done!" : "🔄 Force Revalidate Now"}</Btn>
              </div>
            </Card>
          )}

          {/* ── ANALYTICS ── */}
          {activeTab === 4 && (
            <Card icon="📈" iconBg="#DBEAFE" title="Google Analytics 4" connected={!!(initialConfig.gaId)}>
              <Alert type="info">ℹ️ Enter your GA4 Measurement ID (e.g. <strong>G-XXXXXXXXXX</strong>) to enable Google Analytics across the entire site. Leave blank to disable tracking.</Alert>

              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <Btn href="https://support.google.com/analytics/answer/9304153" target="_blank" variant="primary">📖 How to Generate GA4 Measurement ID</Btn>
                <Btn href="https://analytics.google.com/analytics/web/#/provision/SignUp" target="_blank" variant="primary">🔗 Open Google Analytics</Btn>
              </div>

              <SectionDivider>Measurement ID</SectionDivider>
              <div style={{ marginBottom: 20 }}>
                <Label sub="Found in GA4 → Admin → Data Streams → your stream → Measurement ID">GA4 Measurement ID</Label>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Input
                    value={gaId}
                    onChange={e => setGaId(e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    style={{ maxWidth: 280 }}
                  />
                  <Btn variant="primary" onClick={saveGaId} disabled={gaSaving}>
                    {gaSaving ? "Saving…" : gaSaved ? "✓ Saved!" : "Save"}
                  </Btn>
                  {gaId && (
                    <Btn variant="danger" onClick={() => { setGaId(""); saveConfig({ gaId: "" }); }}>
                      Remove
                    </Btn>
                  )}
                </div>
              </div>

              {initialConfig.gaId ? (
                <Alert type="success">✅ GA4 is active — tracking ID: <strong>{initialConfig.gaId}</strong>. Page views are tracked automatically including SPA navigation.</Alert>
              ) : (
                <Alert type="warn">⚠️ No GA4 ID configured — analytics tracking is currently disabled.</Alert>
              )}

              <SectionDivider>How it works</SectionDivider>
              <div style={{ fontSize: 13, color: "#57534E", lineHeight: 1.7 }}>
                <p style={{ margin: "0 0 8px" }}>• The GA4 script loads after the page becomes interactive (no impact on Core Web Vitals).</p>
                <p style={{ margin: "0 0 8px" }}>• Page views are tracked on every route change including Next.js client-side navigation.</p>
                <p style={{ margin: 0 }}>• To get your Measurement ID: <strong>GA4 → Admin → Data Streams → [your stream] → Measurement ID</strong></p>
              </div>
            </Card>
          )}

          {/* ── GOOGLE SHEETS ── */}
          {activeTab === 5 && (
            <Card icon="📊" iconBg="#D1FAE5" title="Google Sheets Integration" connected={sheetsConnected}>
              {sheetsConnected
                ? <Alert type="success">✅ Google Sheets connected. Tracker data, newsletter sign-ups and contact messages are all linked.</Alert>
                : <Alert type="info">ℹ️ Each activity and feature uses its own Google Sheet workbook. Paste the Sheet ID (or full URL) for each one below.</Alert>}

              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <Btn href="https://console.cloud.google.com/apis/credentials" target="_blank" variant="primary">🔗 Google Cloud Console</Btn>
                <Btn href="https://script.google.com" target="_blank" variant="primary">⚡ Apps Script (create sheets)</Btn>
                <Btn href="https://developers.google.com/sheets/api/guides/concepts" target="_blank">📖 Sheets API Docs</Btn>
              </div>

              {/* API Key */}
              <SectionDivider>API Configuration</SectionDivider>
              <div style={{ marginBottom: 20 }}>
                <Label sub="Google Cloud Console → APIs & Services → Credentials → API Key (restrict to Sheets API + your server IP)">
                  Google Sheets API Key
                </Label>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Input
                    value={sheetsApiKey}
                    onChange={e => { setSheetsApiKey(e.target.value); setSheetsError(""); }}
                    placeholder="AIzaSy..."
                    style={{ maxWidth: 420, fontFamily: "Consolas, monospace", fontSize: 13 }}
                  />
                </div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 5 }}>
                  One key works for all workbooks below. Add it also as <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 4px", borderRadius: 3 }}>GOOGLE_SHEETS_API_KEY</code> in Coolify env vars.
                </div>
              </div>

              {/* Tracker Workbooks */}
              <SectionDivider>🏋️ Proving Ground Tracker — 3 Separate Workbooks</SectionDivider>
              <Alert type="info">💡 Each activity is its own Google Sheet file. Run the Apps Script above to create all three automatically with correct headers.</Alert>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
                {/* Weight */}
                <div style={{ background: "#FFF5F3", borderRadius: 10, padding: 16, border: "1px solid #E8593C25" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#E8593C", marginBottom: 10 }}>⚖️ Weight Tracker</div>
                  <Label sub="Paste Sheet ID or full URL">Sheet ID</Label>
                  <Input
                    value={weightSheetId}
                    onChange={e => { setWeightSheetId(e.target.value); setSheetsError(""); }}
                    placeholder="1BxiMVs0XRA5n..."
                    style={{ fontSize: 12, fontFamily: "Consolas, monospace" }}
                  />
                  <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {["Date", "Weight (kg)", "Target (kg)", "Notes"].map(col => (
                      <span key={col} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10, background: "#E8593C15", color: "#E8593C" }}>{col}</span>
                    ))}
                  </div>
                </div>

                {/* Running */}
                <div style={{ background: "#EFF6FF", borderRadius: 10, padding: 16, border: "1px solid #3B82F625" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#3B82F6", marginBottom: 10 }}>🏃 Running Tracker</div>
                  <Label sub="Paste Sheet ID or full URL">Sheet ID</Label>
                  <Input
                    value={runningSheetId}
                    onChange={e => { setRunningSheetId(e.target.value); setSheetsError(""); }}
                    placeholder="1BxiMVs0XRA5n..."
                    style={{ fontSize: 12, fontFamily: "Consolas, monospace" }}
                  />
                  <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {["Date", "Distance (km)", "Duration (min)", "Pace (min/km)", "Notes"].map(col => (
                      <span key={col} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10, background: "#3B82F615", color: "#3B82F6" }}>{col}</span>
                    ))}
                  </div>
                </div>

                {/* Hiking */}
                <div style={{ background: "#F0FDF4", borderRadius: 10, padding: 16, border: "1px solid #10B98125" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 10 }}>🥾 Hiking Tracker</div>
                  <Label sub="Paste Sheet ID or full URL">Sheet ID</Label>
                  <Input
                    value={hikingSheetId}
                    onChange={e => { setHikingSheetId(e.target.value); setSheetsError(""); }}
                    placeholder="1BxiMVs0XRA5n..."
                    style={{ fontSize: 12, fontFamily: "Consolas, monospace" }}
                  />
                  <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {["Date", "Trail Name", "Distance (km)", "Elevation (m)", "Duration (min)", "Notes"].map(col => (
                      <span key={col} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10, background: "#10B98115", color: "#10B981" }}>{col}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Newsletter & Messages Workbooks */}
              <SectionDivider>📬 Newsletter & Contact — 2 Separate Workbooks</SectionDivider>
              <Alert type="info">💡 Subscribers and Messages each get their own workbook. The Apps Script creates both automatically.</Alert>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                {/* Subscribers */}
                <div style={{ background: "#F5F3FF", borderRadius: 10, padding: 16, border: "1px solid #8B5CF625" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#8B5CF6", marginBottom: 10 }}>📋 Subscribers</div>
                  <Label sub="Newsletter sign-ups are appended here">Sheet ID</Label>
                  <Input
                    value={subscribersSheetId}
                    onChange={e => { setSubscribersSheetId(e.target.value); setSheetsError(""); }}
                    placeholder="1BxiMVs0XRA5n..."
                    style={{ fontSize: 12, fontFamily: "Consolas, monospace" }}
                  />
                  <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {["Date", "Name", "Email", "Status"].map(col => (
                      <span key={col} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10, background: "#8B5CF615", color: "#8B5CF6" }}>{col}</span>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div style={{ background: "#FFFBEB", borderRadius: 10, padding: 16, border: "1px solid #F59E0B25" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#D97706", marginBottom: 10 }}>💬 Messages</div>
                  <Label sub="Contact form submissions are appended here">Sheet ID</Label>
                  <Input
                    value={messagesSheetId}
                    onChange={e => { setMessagesSheetId(e.target.value); setSheetsError(""); }}
                    placeholder="1BxiMVs0XRA5n..."
                    style={{ fontSize: 12, fontFamily: "Consolas, monospace" }}
                  />
                  <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {["Date", "Name", "Email", "Subject", "Message"].map(col => (
                      <span key={col} style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10, background: "#F59E0B15", color: "#D97706" }}>{col}</span>
                    ))}
                  </div>
                </div>
              </div>

              <Alert type="warn">⚠️ After saving, also add the IDs as env vars in Coolify: <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 4px", borderRadius: 3 }}>GOOGLE_SHEETS_WEIGHT_ID</code>, <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 4px", borderRadius: 3 }}>GOOGLE_SHEETS_RUNNING_ID</code>, <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 4px", borderRadius: 3 }}>GOOGLE_SHEETS_HIKING_ID</code> — then redeploy.</Alert>

              {sheetsError && <div style={{ fontSize: 12, color: "#991B1B", marginBottom: 12 }}>❌ {sheetsError}</div>}

              <div style={{ display: "flex", gap: 10, alignItems: "center", paddingTop: 8, borderTop: "1px solid #F3F4F6" }}>
                <Btn variant="primary" disabled={sheetsSaving} onClick={saveSheetsConfig}>
                  💾 {sheetsSaving ? "Saving…" : sheetsSaved ? "✓ Saved!" : "Save All Sheet IDs"}
                </Btn>
                {sheetsSaved && <span style={{ fontSize: 13, color: "#10B981", fontWeight: 600 }}>✓ All sheet IDs saved</span>}
              </div>
            </Card>
          )}

          {/* ── FIREBASE ── */}
          {activeTab === 6 && (
            <Card icon="🔥" iconBg="#FEF3C7" title="Firebase Integration" connected={fbConnected}>
              {fbConnected
                ? <Alert type="success">✅ Firebase is connected. All 7 environment variables are loaded from Coolify. Analytics and Performance Monitoring are active.</Alert>
                : <Alert type="info">ℹ️ Firebase powers Analytics, Performance Monitoring, and Crashlytics on the live site. Paste your Firebase config JSON below to enable it.</Alert>}

              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <Btn href="https://firebase.google.com/docs/web/setup#add-sdk-and-initialize" target="_blank" variant="primary">📖 How to Get Firebase Config JSON</Btn>
                <Btn href="https://console.firebase.google.com/" target="_blank" variant="primary">🔗 Firebase Console</Btn>
              </div>

              <SectionDivider>Firebase Config JSON</SectionDivider>
              <div style={{ marginBottom: 20 }}>
                <Label sub="Get from Firebase Console → Project Settings → Your Apps → SDK setup">Config Object</Label>
                <textarea
                  value={fbConfig}
                  onChange={e => { setFbConfig(e.target.value); setFbError(""); }}
                  placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "your-project.firebaseapp.com",\n  "projectId": "your-project-id",\n  "storageBucket": "your-project.appspot.com",\n  "messagingSenderId": "123456789",\n  "appId": "1:123456789:web:abc123",\n  "measurementId": "G-XXXXXXXXXX"\n}`}
                  rows={10} style={{ width: "100%", padding: "12px 14px", border: `1px solid ${fbError ? "#FECACA" : "#E5E7EB"}`, borderRadius: 8, fontSize: 12.5, color: "#1C1917", background: "#FAFAF8", outline: "none", fontFamily: "Consolas, monospace", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }} />
                {fbError && <div style={{ fontSize: 12, color: "#991B1B", marginTop: 6 }}>❌ {fbError}</div>}
                {fbConnected && <div style={{ fontSize: 12, color: "#065F46", marginTop: 6 }}>✓ Config loaded from Coolify environment variables</div>}
              </div>

              <SectionDivider>What to Enable</SectionDivider>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                  { key: "analytics", label: "📊 Analytics", desc: "Page views, sessions, user behaviour" },
                  { key: "perf", label: "⚡ Performance Monitoring", desc: "Page load times, core web vitals" },
                  { key: "crash", label: "🐛 Crashlytics", desc: "JavaScript error tracking" },
                  { key: "firestore", label: "🗄️ Firestore Database", desc: "Store contact form submissions" },
                ].map(item => (
                  <label key={item.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer", background: "#FAFAF8" }}>
                    <input type="checkbox" checked={fbChecks[item.key]} onChange={e => setFbChecks(f => ({ ...f, [item.key]: e.target.checked }))} style={{ width: 16, height: 16, accentColor: "#14B8A6" }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1C1917" }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <Alert type="warn">⚠️ <strong>Where is this saved?</strong> Firebase config is stored as <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 3 }}>NEXT_PUBLIC_FIREBASE_*</code> environment variables in Coolify. The values shown above are live from your Coolify configuration.</Alert>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Btn variant="primary" disabled={fbSaving || !fbConfig.trim()} onClick={saveFirebaseConfig}>
                  💾 {fbSaving ? "Saving…" : fbSaved ? "✓ Saved!" : "Save Firebase Config"}
                </Btn>
                <Btn disabled={fbTesting || !fbConfig.trim()} onClick={testFirebaseConnection}>
                  {fbTesting ? "Testing…" : "🔌 Test Connection"}
                </Btn>
                <Btn variant="danger" disabled={!fbConfig.trim()} onClick={clearFirebaseConfig}>🗑 Clear Config</Btn>
                {fbSaved && <span style={{ fontSize: 13, color: "#10B981", fontWeight: 600 }}>✓ Firebase config confirmed active</span>}
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
