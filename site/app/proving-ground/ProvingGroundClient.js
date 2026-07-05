"use client";
import { useState, useEffect, useRef } from "react";
import Nav from "../../components/Nav";
import BottomSection from "../../components/BottomSection";
import HeroBackground from "../../components/HeroBackground";
import Counter from "../../components/Counter";
import { T, playfair, eyebrowSt, containerStyle, navyGrad } from "../../lib/theme";
import Fade from "../../components/Fade";

const CORAL = "#E8593C";

// Section tags hidden from visible pills so cards show content keywords.
const PG_SECTION_TAG_SLUGS = new Set([
  "mind-machine", "mm-mind", "mm-machine",
  "philosophy",
  "policy-lab", "pl-animal-husbandry", "pl-dairy", "pl-fisheries", "pl-elections",
  "proving-ground",
  "late-compiler",
  "lc-ai-fundamentals", "lc-applied-ai", "lc-agentic-ai", "lc-machine-learning", "lc-python",
  "news",
]);

/* ── CSS ──────────────────────────────────────────────────────────── */
const STYLES = `
  .pg-card { text-decoration:none; display:block; border:1px solid rgba(13,13,13,0.08); border-radius:16px; transition:all 0.3s; color:inherit; background:#fff; }
  .pg-card:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,0.07); border-color:${CORAL}25; }
  .pg-row { text-decoration:none; display:flex; align-items:flex-start; gap:14px; padding:18px 22px; background:#fff; border:1px solid rgba(13,13,13,0.07); border-radius:14px; transition:all 0.22s; color:inherit; }
  .pg-row:hover { transform:translateX(4px); box-shadow:0 6px 24px rgba(0,0,0,0.06); border-color:${CORAL}25; }
  .pg-tab { background:none; border:none; cursor:pointer; padding:16px 24px; font-size:14px; font-weight:600; letter-spacing:0.02em; transition:all 0.2s; }
  .pg-tab.active { color:var(--charcoal); border-bottom:2px solid ${CORAL}; }
  .pg-tab.inactive { color:var(--text-muted); border-bottom:2px solid transparent; }
  .pg-tab:hover { color:var(--charcoal); }
  .pg-stat { background:var(--warm-white); border-radius:14px; padding:24px; border:1px solid rgba(13,13,13,0.07); text-align:center; }
  .pg-explore { text-decoration:none; display:flex; align-items:center; gap:14px; padding:20px 24px; background:#fff; border-radius:14px; border:1px solid rgba(13,13,13,0.07); transition:all 0.25s; color:inherit; position:relative; overflow:hidden; }
  .pg-explore:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(0,0,0,0.07); }
  @media(max-width:768px) { .two-col{ grid-template-columns:repeat(2,minmax(0,1fr))!important; gap:12px!important; } .four-col{ grid-template-columns:repeat(2,minmax(0,1fr))!important; gap:10px!important; } .pg-stat{ padding:16px 12px!important; } }
`;

/* ── Fade ─────────────────────────────────────────────────────────── */
/* ── Hero ─────────────────────────────────────────────────────────── */
function Hero() {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 80); return () => clearTimeout(t); }, []);
  const e = (d) => ({ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(22px)", transition: `opacity 0.65s cubic-bezier(.22,1,.36,1) ${d}s, transform 0.65s cubic-bezier(.22,1,.36,1) ${d}s` });
  return (
    <header style={{ position: "relative", overflow: "hidden", paddingTop: 130, paddingBottom: 80 }}>
      <HeroBackground page="proving-ground" />
      <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
      <div className="drift-slow" style={{ position: "absolute", top: "20%", right: "8%", width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle,${CORAL}12 0%,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
        <div style={e(0.1)}>
          <span style={{ ...eyebrowSt, color: CORAL }}>Personal · Official · Accountability</span>
        </div>
        <h1 style={{ ...e(0.2), ...playfair, fontSize: "clamp(34px,4.2vw,52px)", color: "#fff", lineHeight: 1.15, letterSpacing: "-0.025em", margin: "16px 0 20px" }}>
          The Proving Ground
        </h1>
        <p style={{ ...e(0.3), fontSize: 18, lineHeight: 1.75, color: "rgba(255,255,255,0.55)", maxWidth: 600, margin: "0 0 28px" }}>
          Where discipline meets impact. Personal essays on movement and struggle — and the official projects that shaped lives and systems across Uttarakhand.
        </p>
        <div style={{ ...e(0.4), display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Home</a>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>The Proving Ground</span>
        </div>
      </div>
    </header>
  );
}

/* ── Tab bar ──────────────────────────────────────────────────────── */
function TabBar({ active, setActive }) {
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid var(--border)", position: "sticky", top: 64, zIndex: 50 }}>
      <div style={{ ...containerStyle, display: "flex" }}>
        {[["personal", "Personal Essays"], ["official", "Official Impact"], ["tracker", "Accountability Tracker"]].map(([id, label]) => (
          <button key={id} onClick={() => setActive(id)}
            className={`pg-tab ${active === id ? "active" : "inactive"}`}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Personal Essays ──────────────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function PersonalEssays({ posts }) {
  const hasPosts = posts.length > 0;
  return (
    <section style={{ background: "var(--warm-white)", padding: "72px max(1.5rem,calc((100% - 1280px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: `${CORAL}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: CORAL }}>△</span>
            <h2 style={{ ...playfair, fontSize: 28, margin: 0 }}>Personal Essays</h2>
          </div>
          <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 36, maxWidth: 560 }}>
            Movement, struggle, and the examined life. Reflections on discipline, sport, and what it means to keep showing up.
          </p>
        </Fade>

        {!hasPosts ? (
          <div style={{ padding: "32px", background: "#fff", border: `1px dashed ${CORAL}30`, borderRadius: 12, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
            Personal essays coming soon — tag posts with <code style={{ background: "var(--cream)", padding: "2px 6px", borderRadius: 4 }}>proving-ground</code> in Ghost CMS.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {posts.map((post, i) => (
              <Fade key={post.slug} delay={0.04 * i}>
                <a href={`/insights/${post.slug}`} className="pg-row">
                  <div style={{ width: 3, borderRadius: 4, background: CORAL, alignSelf: "stretch", flexShrink: 0, minHeight: 40 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...playfair, fontSize: 16, lineHeight: 1.35, color: "var(--charcoal)", marginBottom: 6 }}>{post.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      {(post.tags || [])
                        .filter(t => t?.slug && !PG_SECTION_TAG_SLUGS.has(t.slug))
                        .slice(0, 4)
                        .map(t => (
                          <span key={t.id || t.slug} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 20, background: `${CORAL}10`, color: CORAL }}>
                            {t.name}
                          </span>
                        ))}
                      <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: "auto" }}>
                        {formatDate(post.published_at)}{post.reading_time ? ` · ${post.reading_time} min` : ""}
                      </span>
                    </div>
                    {post.custom_excerpt && (
                      <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.55, marginTop: 5 }}>
                        {post.custom_excerpt.slice(0, 120)}{post.custom_excerpt.length > 120 ? "…" : ""}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 14, color: CORAL, flexShrink: 0 }}>→</span>
                </a>
              </Fade>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Official Impact ──────────────────────────────────────────────── */
function AchievementCard({ item, i }) {
  return (
    <Fade delay={0.06 * i}>
      <div className="pg-card" style={{ height: "100%", overflow: "hidden" }}>
        <div style={{ height: 4, background: `linear-gradient(90deg,${item.color},${item.color}40)` }} />
        <div style={{ padding: "26px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ width: 44, height: 44, borderRadius: 12, background: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              {item.icon}
            </span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: item.color, letterSpacing: "0.07em", textTransform: "uppercase" }}>{item.period}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{item.role}</div>
            </div>
          </div>
          <h3 style={{ ...playfair, fontSize: 18, margin: "0 0 12px", lineHeight: 1.35 }}>{item.title}</h3>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--text-body)", margin: "0 0 20px" }}>{item.description}</p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {item.metrics.map(m => (
              <div key={m.label}>
                <div style={{ ...playfair, fontSize: 22, color: item.color }}>{m.value}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fade>
  );
}

function OfficialImpact({ achievements }) {
  return (
    <section style={{ background: "var(--warm-white)", padding: "72px max(1.5rem,calc((100% - 1280px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: `${CORAL}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: CORAL }}>◈</span>
            <h2 style={{ ...playfair, fontSize: 28, margin: 0 }}>Official Impact</h2>
          </div>
          <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 36, maxWidth: 560 }}>
            Landmark projects from 25+ years of IAS service — from disaster relief to education reform to farmer welfare.
          </p>
        </Fade>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {achievements.map((item, i) => (
            <AchievementCard key={item.id} item={item} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Mini Charts ──────────────────────────────────────────────────── */
function LineChart({ data, color }) {
  const vals = data.map(Number).filter(v => !isNaN(v));
  if (vals.length < 2) return null;
  const W = 600, H = 140;
  const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * (W - 32) + 16;
    const y = H - 20 - ((v - min) / range) * (H - 40);
    return `${x},${y}`;
  }).join(" ");
  const lastX = (W - 32) + 16, lastY = H - 20 - ((vals[vals.length-1] - min) / range) * (H - 40);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`16,${H - 20} ${pts} ${lastX},${H - 20}`} fill="url(#lg)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {vals.map((v, i) => {
        const x = (i / (vals.length - 1)) * (W - 32) + 16;
        const y = H - 20 - ((v - min) / range) * (H - 40);
        return <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke={color} strokeWidth="2.5" />;
      })}
      {/* Min / Max labels */}
      <text x="16" y={H - 5} fontSize="10" fill="#aaa">{min.toFixed(1)}</text>
      <text x={W - 16} y={H - 5} fontSize="10" fill="#aaa" textAnchor="end">{max.toFixed(1)}</text>
    </svg>
  );
}

function BarChart({ data, color }) {
  const vals = data.map(Number).filter(v => !isNaN(v));
  if (vals.length === 0) return null;
  const W = 600, H = 140;
  const max = Math.max(...vals) || 1;
  const slotW = (W - 20) / vals.length;
  const barW = Math.max(6, slotW - 6);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }} preserveAspectRatio="none">
      {vals.map((v, i) => {
        const x = 10 + i * slotW + (slotW - barW) / 2;
        const h = Math.max(3, ((v / max) * (H - 30)));
        const y = H - 20 - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} rx="3" fill={color} opacity={0.55 + 0.45 * (v / max)} />
            {vals.length <= 12 && (
              <text x={x + barW / 2} y={H - 5} fontSize="9" fill="#aaa" textAnchor="middle">{v}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Accountability Tracker ───────────────────────────────────────── */
const BLUE  = "#3B82F6";
const GREEN = "#10B981";

const TRACKERS = [
  { id: "weight",  label: "Weight",  icon: "⚖️", color: CORAL },
  { id: "running", label: "Running", icon: "🏃", color: BLUE  },
  { id: "hiking",  label: "Hiking",  icon: "🥾", color: GREEN },
];

function computeStats(rows, tab) {
  if (!rows || rows.length === 0) return { stats: [], chartData: [], recent: [] };

  if (tab === "weight") {
    const last  = rows[rows.length - 1];
    const first = rows[0];
    const cur   = parseFloat(last?.["Weight (kg)"])  || 0;
    const tgt   = parseFloat(last?.["Target (kg)"])  || 0;
    const ini   = parseFloat(first?.["Weight (kg)"]) || cur;
    const lost  = Math.max(0, ini - cur);
    const toGo  = Math.max(0, cur - tgt);
    const pct   = tgt && ini > tgt ? Math.min(100, Math.round((lost / (ini - tgt)) * 100)) : 0;
    return {
      stats: [
        { label: "Current",    value: cur.toFixed(1),  unit: "kg" },
        { label: "Target",     value: tgt.toFixed(1),  unit: "kg" },
        { label: "Lost",       value: lost.toFixed(1), unit: "kg" },
        { label: "To Go",      value: toGo.toFixed(1), unit: "kg" },
        { label: "Days Logged",value: `${rows.length}`,unit: ""   },
      ],
      progress: pct,
      chartData: rows.map(r => r["Weight (kg)"]),
      recent: rows.slice(-6).reverse(),
    };
  }
  if (tab === "running") {
    const totalDist = rows.reduce((s, r) => s + (parseFloat(r["Distance (km)"]) || 0), 0);
    const totalMin  = rows.reduce((s, r) => s + (parseFloat(r["Duration (min)"]) || 0), 0);
    const parsePace = v => { if (!v) return 0; const s = String(v); if (s.includes(":")) { const [m, sec] = s.split(":"); return parseFloat(m) + (parseFloat(sec) || 0) / 60; } return parseFloat(s) || 0; };
    const avgPace   = rows.length ? rows.reduce((s, r) => s + parsePace(r["Pace (min/km)"]), 0) / rows.length : 0;
    const best      = Math.max(0, ...rows.map(r => parseFloat(r["Distance (km)"]) || 0));
    return {
      stats: [
        { label: "Total Distance", value: totalDist.toFixed(1), unit: "km"     },
        { label: "Sessions",       value: `${rows.length}`,     unit: ""       },
        { label: "Total Time",     value: `${Math.round(totalMin)}`, unit: "min" },
        { label: "Avg Pace",       value: avgPace.toFixed(1),   unit: "min/km" },
        { label: "Best Run",       value: best.toFixed(1),      unit: "km"     },
      ],
      chartData: rows.map(r => r["Distance (km)"]),
      recent: rows.slice(-6).reverse(),
    };
  }
  if (tab === "hiking") {
    const totalDist = rows.reduce((s, r) => s + (parseFloat(r["Distance (km)"]) || 0), 0);
    const totalElev = rows.reduce((s, r) => s + (parseFloat(r["Elevation (m)"]) || 0), 0);
    const best      = Math.max(0, ...rows.map(r => parseFloat(r["Distance (km)"]) || 0));
    return {
      stats: [
        { label: "Total Hikes",     value: `${rows.length}`,              unit: ""   },
        { label: "Total Distance",  value: totalDist.toFixed(1),          unit: "km" },
        { label: "Total Elevation", value: totalElev.toLocaleString("en-IN"), unit: "m"  },
        { label: "Longest Hike",    value: best.toFixed(1),               unit: "km" },
      ],
      chartData: rows.map(r => r["Distance (km)"]),
      recent: rows.slice(-6).reverse(),
    };
  }
  return { stats: [], chartData: [], recent: [] };
}

/* Quick summary card shown for each tracker at the top */
function SummaryCard({ tracker, rows, configured, active, onClick }) {
  const { color, icon, label, id } = tracker;
  const count = rows?.length || 0;
  // headline can be a number (animated) or a string (static)
  let headline = "—", unit = "", decimals = 0, sub = "No data yet";

  if (count > 0) {
    if (id === "weight") {
      const cur = parseFloat(rows[rows.length - 1]?.["Weight (kg)"]) || 0;
      const tgt = parseFloat(rows[rows.length - 1]?.["Target (kg)"]) || 0;
      headline = cur; unit = "kg"; decimals = 1;
      sub = tgt ? `Target: ${tgt.toFixed(1)} kg` : `${count} entries`;
    } else if (id === "running") {
      const total = rows.reduce((s, r) => s + (parseFloat(r["Distance (km)"]) || 0), 0);
      headline = total; unit = "km"; decimals = 1;
      sub = `${count} sessions`;
    } else {
      const total = rows.reduce((s, r) => s + (parseFloat(r["Distance (km)"]) || 0), 0);
      headline = count; unit = "hikes"; decimals = 0;
      sub = `${total.toFixed(1)} km total`;
    }
  }

  return (
    <button onClick={onClick} style={{
      background: active ? color : "#fff",
      border: `2px solid ${active ? color : "rgba(13,13,13,0.08)"}`,
      borderRadius: 14, padding: "20px 22px", cursor: "pointer", textAlign: "left",
      fontFamily: "inherit", transition: "all 0.2s", flex: 1,
      boxShadow: active ? `0 6px 24px ${color}30` : "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: active ? "rgba(255,255,255,0.75)" : "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
        {!configured && (
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, color: active ? "rgba(255,255,255,0.6)" : "#F59E0B", background: active ? "rgba(255,255,255,0.15)" : "#FFFBEB", padding: "2px 6px", borderRadius: 6 }}>Not set up</span>
        )}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: active ? "#fff" : color, lineHeight: 1.1, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 4 }}>
        {typeof headline === "number" ? (
          <>
            <Counter target={headline} decimals={decimals} />
            {unit && <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 4, opacity: 0.7 }}>{unit}</span>}
          </>
        ) : headline}
      </div>
      <div style={{ fontSize: 12, color: active ? "rgba(255,255,255,0.65)" : "var(--text-muted)" }}>{sub}</div>
    </button>
  );
}

function NotConfigured({ color }) {
  return (
    <div style={{ padding: "32px 24px", background: "var(--warm-white)", borderRadius: 14, border: `1px dashed ${color}40`, textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>📋</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--charcoal)", marginBottom: 6 }}>Sheet not connected</div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
        Paste the Sheet ID in <strong>Admin → Settings → Google Sheets</strong> to activate this tracker.
      </div>
      <a href="/admin/settings" style={{ fontSize: 13, fontWeight: 600, color, textDecoration: "none", background: `${color}12`, padding: "8px 18px", borderRadius: 8, display: "inline-block" }}>
        Go to Admin Settings →
      </a>
    </div>
  );
}

function AccountabilityTracker() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [err,     setErr]     = useState(null);
  const [active,  setActive]  = useState("weight");

  useEffect(() => {
    fetch("/api/progress")
      .then(r => r.json())
      .then(d => { if (d.error) setErr(d.error); else setData(d); })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const tracker  = TRACKERS.find(t => t.id === active);
  const color    = tracker?.color || CORAL;
  const rows     = data?.[active] || [];
  const cfg      = data?.configured || {};
  const { stats, chartData, recent, progress } = computeStats(rows, active);
  const isConfigured = cfg[active] !== false;
  const chartLabel = active === "weight" ? "Weight Trend (kg)" : "Distance per Session (km)";

  return (
    <section style={{ background: "#fff", padding: "72px max(1.5rem,calc((100% - 1280px)/2))" }}>
      <div style={containerStyle}>

        {/* Section header */}
        <Fade>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: `${CORAL}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: CORAL }}>◉</span>
            <h2 style={{ ...playfair, fontSize: 28, margin: 0 }}>Accountability Tracker</h2>
          </div>
          <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 8, maxWidth: 560 }}>
            Live data pulled from Google Sheets I update every morning. No filters. No edits. Just the numbers.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: CORAL, background: `${CORAL}10`, padding: "4px 12px", borderRadius: 20, marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: CORAL, animation: "pulse 2s infinite" }} />
            Live from Google Sheets
          </div>
        </Fade>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
            {TRACKERS.map(t => (
              <div key={t.id} style={{ flex: 1, height: 100, borderRadius: 14, background: "var(--warm-white)", border: "1px solid rgba(13,13,13,0.07)", animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        )}

        {/* API error */}
        {!loading && err && (
          <div style={{ padding: "20px 24px", background: "#FEF2F2", borderRadius: 12, border: "1px solid #FECACA", fontSize: 13, color: "#991B1B", marginBottom: 24 }}>
            ⚠️ {err} — <a href="/admin/settings" style={{ color: "#991B1B", fontWeight: 600 }}>Configure in Admin Settings</a>
          </div>
        )}

        {/* Summary cards — all 3 visible, click to switch */}
        {!loading && data && (
          <>
            <Fade>
              <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
                {TRACKERS.map(t => (
                  <SummaryCard
                    key={t.id}
                    tracker={t}
                    rows={data[t.id]}
                    configured={cfg[t.id] !== false}
                    active={active === t.id}
                    onClick={() => setActive(t.id)}
                  />
                ))}
              </div>
            </Fade>

            {/* Detail panel */}
            <Fade delay={0.1}>
              {!isConfigured ? (
                <NotConfigured color={color} />
              ) : rows.length === 0 ? (
                <div style={{ padding: "32px 24px", background: "var(--warm-white)", borderRadius: 14, border: `1px dashed ${color}40`, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
                  No entries yet — open the sheet and add your first row.
                </div>
              ) : (
                <>
                  {/* Weight progress bar */}
                  {active === "weight" && progress !== undefined && (
                    <div style={{ background: "var(--warm-white)", borderRadius: 14, border: `1px solid ${color}20`, padding: "18px 24px", marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        <span>Progress toward goal</span>
                        <span style={{ color }}>{progress}%</span>
                      </div>
                      <div style={{ height: 10, background: "rgba(13,13,13,0.08)", borderRadius: 20, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${color},${color}cc)`, borderRadius: 20, transition: "width 1s ease" }} />
                      </div>
                    </div>
                  )}

                  {/* Stats tiles */}
                  <div className="four-col" style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length},1fr)`, gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                    {stats.map((s, i) => {
                      // decide decimals from the formatted string
                      const str = String(s.value);
                      const dec = (str.includes(".") ? str.split(".")[1].length : 0);
                      return (
                        <Fade key={s.label} delay={0.05 * i}>
                          <div className="pg-stat" style={{ border: `1px solid ${color}20` }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{s.label}</div>
                            <div style={{ ...playfair, fontSize: 26, color, lineHeight: 1.1 }}>
                              <Counter target={s.value} decimals={dec} />
                              {s.unit && <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "system-ui", fontWeight: 400, marginLeft: 3 }}>{s.unit}</span>}
                            </div>
                          </div>
                        </Fade>
                      );
                    })}
                  </div>

                  {/* Chart */}
                  <Fade delay={0.15}>
                    <div style={{ background: "var(--warm-white)", borderRadius: 14, border: `1px solid ${color}20`, padding: "18px 20px", marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>{chartLabel}</div>
                      <div style={{ background: "#fff", borderRadius: 10, padding: "10px 8px 2px" }}>
                        {active === "weight"
                          ? <LineChart data={chartData} color={color} />
                          : <BarChart  data={chartData} color={color} />}
                      </div>
                    </div>
                  </Fade>

                  {/* Recent entries */}
                  <Fade delay={0.2}>
                    <div style={{ background: "var(--warm-white)", borderRadius: 14, border: `1px solid ${color}20`, overflow: "hidden" }}>
                      <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(13,13,13,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.06em", textTransform: "uppercase" }}>Recent Entries</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Showing last {recent.length} of {rows.length}</span>
                      </div>
                      {recent.map((row, i) => (
                        <div key={i} style={{ padding: "10px 20px", borderBottom: i < recent.length - 1 ? "1px solid rgba(13,13,13,0.05)" : "none", display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, alignItems: "center" }}>
                          <span style={{ fontWeight: 700, color, minWidth: 105, fontSize: 12 }}>{row["Date"]}</span>
                          {Object.entries(row)
                            .filter(([k]) => k !== "Date" && k !== "Notes")
                            .map(([k, v]) => (
                              <span key={k} style={{ color: "var(--text-body)" }}>
                                <span style={{ color: "var(--text-muted)", fontSize: 10 }}>{k} </span>
                                <strong>{v}</strong>
                              </span>
                            ))}
                          {row["Notes"] && (
                            <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: 12, marginLeft: "auto" }}>{row["Notes"]}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </Fade>
                </>
              )}
            </Fade>

            {/* Footer note */}
            <Fade delay={0.3}>
              <div style={{ marginTop: 20, padding: "14px 20px", borderRadius: 12, background: "var(--warm-white)", border: "1px solid rgba(13,13,13,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, fontStyle: "italic" }}>
                  Data refreshes automatically every hour.
                  {data?.updatedAt && ` Last pull: ${new Date(data.updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
                </p>
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
                  Updated every morning from Google Sheets.
                </span>
              </div>
            </Fade>
          </>
        )}
      </div>
    </section>
  );
}

/* ── Explore More ─────────────────────────────────────────────────── */
const EXPLORE = [
  { title: "Mind & Machine", sub: "AI meets philosophy", href: "/mind-and-machine", color: "#3B82F6", icon: "⟐" },
  { title: "The Late Compiler", sub: "Learn AI from zero — 5 tracks", href: "/the-late-compiler", color: "#10B981", icon: "▷" },
  { title: "Philosophy", sub: "Eastern wisdom meets cognitive science", href: "/philosophy", color: "#8B5CF6", icon: "☸" },
];

function ExploreMore() {
  return (
    <section style={{ background: "var(--cream)", padding: "64px max(1.5rem,calc((100% - 1280px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span style={eyebrowSt}>Continue exploring</span>
            <h2 style={{ ...playfair, fontSize: 26, margin: "10px 0 0" }}>More from this site</h2>
          </div>
        </Fade>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {EXPLORE.map((h, i) => (
            <Fade key={h.href} delay={0.06 * i}>
              <a href={h.href} className="pg-explore">
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${h.color},${h.color}40)` }} />
                <span style={{ width: 44, height: 44, borderRadius: 12, background: `${h.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: h.color, flexShrink: 0 }}>{h.icon}</span>
                <div>
                  <div style={{ ...playfair, fontSize: 15 }}>{h.title}</div>
                  <div style={{ fontSize: 12, color: h.color, fontWeight: 600, marginTop: 2 }}>{h.sub}</div>
                </div>
              </a>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function ProvingGroundClient({ posts = [], achievements = [] }) {
  const [tab, setTab] = useState("personal");

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--charcoal)", background: "var(--warm-white)", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{STYLES}</style>
      <Nav />
      <span id="pg-main" />
      <Hero />
      <TabBar active={tab} setActive={setTab} />

      {tab === "personal"  && <PersonalEssays posts={posts} />}
      {tab === "official"  && <OfficialImpact achievements={achievements} />}
      {tab === "tracker"   && <AccountabilityTracker />}

      <ExploreMore />
      <BottomSection variant="general" />
    </div>
  );
}
