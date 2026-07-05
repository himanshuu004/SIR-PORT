"use client";
import { useState, useMemo, useEffect } from "react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import NewsletterCTA from "../../components/NewsletterCTA";
import Fade from "../../components/Fade";
import Icon from "../../components/Icon";
import { playfair, eyebrowSt, containerStyle } from "../../lib/theme";

const CARD_GRID_STYLES = `
  .media-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
  @media (max-width: 768px) {
    .media-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .media-card-grid a { padding: 16px !important; border-radius: 14px !important; }
    .media-card-grid h2 { font-size: 15px !important; }
    .media-card-grid p { font-size: 12.5px !important; line-height: 1.55 !important; }
  }
`;

const FILTERS = [
  { key: "all",  label: "All",          icon: "bookText",  color: "var(--cyan)" },
  { key: "web",  label: "Web articles", icon: "bookText",  color: "#D946EF" },
  { key: "pdf",  label: "Clippings",    icon: "newspaper", color: "var(--cyan)" },
];

const ACCENT_BY_KIND = { web: "#D946EF", pdf: "var(--cyan)" };

function fmtDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  } catch { return ""; }
}

function postKind(post) {
  const slugs = (post.tags || []).map((t) => t.slug);
  if (slugs.includes("m-pdf")) return "pdf";
  if (slugs.includes("m-web")) return "web";
  return "web";
}

export default function MediaClient({ posts = [] }) {
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const t = params.get("kind");
    if (t && FILTERS.some((f) => f.key === t)) setFilter(t);
  }, []);

  const enriched = useMemo(() => posts.map((p) => ({ ...p, _kind: postKind(p) })), [posts]);
  const visible = filter === "all" ? enriched : enriched.filter((p) => p._kind === filter);

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--charcoal)", background: "var(--warm-white)", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{CARD_GRID_STYLES}</style>
      <Nav />

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, var(--navy) 0%, var(--navy-light) 100%)", padding: "140px max(1.5rem, calc((100% - 1280px)/2)) 90px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)", backgroundSize: "48px 48px" }} aria-hidden="true" />
        <div style={{ maxWidth: 800, position: "relative", zIndex: 1 }}>
          <span style={{ ...eyebrowSt, letterSpacing: "0.12em", display: "block", marginBottom: 20 }}>In the Media</span>
          <h1 style={{ ...playfair, fontSize: "clamp(32px, 4vw, 52px)", color: "#fff", lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 24px" }}>
            Press mentions, interviews, and clippings.
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.8, color: "rgba(255,255,255,0.65)", maxWidth: 640, margin: 0 }}>
            A running archive of online articles and scanned print coverage. Each entry carries a short note on the context and a link to the original source or the scanned page.
          </p>
        </div>
      </section>

      {/* Filter chips + grid */}
      <section style={{ padding: "60px max(1.5rem, calc((100% - 1280px)/2)) 80px" }}>
        <div style={containerStyle}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }} role="tablist" aria-label="Filter by type">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.key)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "10px 18px",
                    borderRadius: 999,
                    border: active ? `1.5px solid ${f.color}` : "1px solid var(--border)",
                    background: active ? `${f.color}14` : "#fff",
                    color: active ? f.color : "var(--charcoal)",
                    fontSize: 13.5, fontWeight: 700, letterSpacing: "0.02em",
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                >
                  <Icon name={f.icon} size={15} color={active ? f.color : "var(--text-muted)"} strokeWidth={2} />
                  {f.label}
                  {f.key !== "all" && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: active ? f.color : "var(--text-muted)", opacity: 0.7 }}>
                      {enriched.filter((p) => p._kind === f.key).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {visible.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: "64px 32px", textAlign: "center", border: "1px dashed var(--border)", maxWidth: 720, margin: "0 auto" }}>
              <p style={{ ...playfair, fontSize: 22, color: "var(--charcoal)", margin: "0 0 12px", fontWeight: 700 }}>
                {filter === "all" ? "No press mentions yet." : `No ${filter === "pdf" ? "clippings" : "web articles"} logged yet.`}
              </p>
              <p style={{ fontSize: 15, color: "var(--text-body)", margin: 0, lineHeight: 1.7 }}>
                Tag a Ghost post with <code style={{ background: "var(--cream)", padding: "2px 6px", borderRadius: 4 }}>media</code> plus one of <code style={{ background: "var(--cream)", padding: "2px 6px", borderRadius: 4 }}>m-web</code> / <code style={{ background: "var(--cream)", padding: "2px 6px", borderRadius: 4 }}>m-pdf</code> to publish into this section.
              </p>
            </div>
          ) : (
            <div className="media-card-grid">
              {visible.map((post, i) => {
                const accent = ACCENT_BY_KIND[post._kind] || "#D946EF";
                const kindLabel = post._kind === "pdf" ? "Clipping" : "Article";
                const iconName = post._kind === "pdf" ? "newspaper" : "bookText";
                const ctaText = post._kind === "pdf" ? "Open clipping →" : "Read article →";
                return (
                  <Fade key={post.slug || i} delay={Math.min(i * 0.04, 0.2)} style={{ height: "100%" }}>
                    <a
                      href={`/insights/${post.slug}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        background: `linear-gradient(180deg, ${accent}10 0%, #ffffff 60%)`,
                        borderRadius: 16,
                        borderTop: `4px solid ${accent}`,
                        padding: "28px",
                        boxShadow: "var(--shadow-card)",
                        height: "100%",
                        textDecoration: "none",
                        color: "var(--charcoal)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                        <span style={{ width: 40, height: 40, borderRadius: 10, background: `${accent}1a`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden="true">
                          <Icon name={iconName} size={20} color={accent} strokeWidth={1.9} />
                        </span>
                        <div style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          {kindLabel} &middot; {fmtDate(post.published_at)}
                        </div>
                      </div>
                      <h2 style={{ ...playfair, fontSize: 18, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.35, color: "var(--charcoal)" }}>{post.title}</h2>
                      <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--text-body)", margin: "0 0 16px", flex: 1, fontWeight: 500 }}>{post.custom_excerpt || ""}</p>
                      <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>{ctaText}</span>
                    </a>
                  </Fade>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <NewsletterCTA variant="general" />
      <Footer />
    </div>
  );
}
