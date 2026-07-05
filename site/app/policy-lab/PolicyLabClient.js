"use client";
import { useState, useEffect, useRef } from "react";
import Nav from "../../components/Nav";
import BottomSection from "../../components/BottomSection";
import HeroBackground from "../../components/HeroBackground";

import Icon from "../../components/Icon";
import { T, playfair, eyebrowSt, containerStyle } from "../../lib/theme";
import Fade from "../../components/Fade";
import Reveal from "../../components/Reveal";

/* ── Helpers ────────────────────────────────────────────────────── */
// Section tags hidden from the visible tag pills so cards show content keywords.
const SECTION_TAG_SLUGS = new Set([
  "mind-machine", "mm-mind", "mm-machine",
  "philosophy",
  "policy-lab", "pl-animal-husbandry", "pl-dairy", "pl-fisheries", "pl-elections",
  "proving-ground",
  "late-compiler",
  "lc-ai-fundamentals", "lc-applied-ai", "lc-agentic-ai", "lc-machine-learning", "lc-python",
  "news",
]);

function toRow(post) {
  return {
    title:   post.title || "Untitled",
    sub:     post.primary_tag?.name || "Policy Lab",
    time:    post.reading_time ? `${post.reading_time} min` : "",
    slug:    post.slug,
    excerpt: post.custom_excerpt || "",
    date:    post.published_at || "",
    tags:    post.tags || [],
  };
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

/* ── CSS ────────────────────────────────────────────────────────── */
const STYLES = `
  .article-row { text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; background: #fff; gap: 16px; border: 1px solid rgba(13,13,13,0.08); border-radius: 12px; transition: all 0.25s; color: inherit; }
  .article-row:hover { transform: translateX(4px); box-shadow: 0 6px 24px rgba(0,0,0,0.05); border-color: rgba(13,13,13,0.14); }
  .news-card { text-decoration: none; display: block; background: #fff; border: 1px solid rgba(13,13,13,0.08); border-radius: 14px; overflow: hidden; transition: all 0.3s; color: inherit; }
  .news-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.06); }
  .pill-hover { text-decoration: none; display: inline-block; transition: all 0.2s; }
  .pill-hover:hover { filter: brightness(1.15); }
  .footer-link { display: block; font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; margin-bottom: 8px; transition: color 0.2s; }
  .footer-link:hover { color: #5EEAD4; }
  @media (prefers-reduced-motion: reduce) { .fade-wrapper { opacity: 1 !important; transform: none !important; } }
  @media (max-width: 768px) { .three-col { grid-template-columns: 1fr !important; } .two-col { grid-template-columns: 1fr !important; } }
  @media (max-width: 1024px) and (min-width: 769px) { .three-col { grid-template-columns: 1fr 1fr !important; } }
`;

/* ── Fade ───────────────────────────────────────────────────────── */
/* ── Hero ───────────────────────────────────────────────────────── */
function Hero({ count }) {
  return (
    <header style={{ position: "relative", overflow: "hidden", paddingTop: 130, paddingBottom: 80 }}>
      <HeroBackground page="policy-lab" />
      <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
        <Reveal delay={0.1}><span style={eyebrowSt}>Policy · {count} Articles</span></Reveal>
        <Reveal delay={0.2}><h1 style={{ ...playfair, fontSize: "clamp(34px, 4.2vw, 52px)", color: "#fff", lineHeight: 1.15, letterSpacing: "-0.025em", margin: "16px 0 24px" }}>The Policy Lab</h1></Reveal>
        <Reveal delay={0.3}><p style={{ fontSize: 18, lineHeight: 1.75, color: "rgba(255,255,255,0.55)", maxWidth: 600, margin: 0 }}>Three decades in the IAS — from Kedarnath to NEP 2020. Data-driven policy thinking, field dispatches, and governance analysis from the inside.</p></Reveal>
      </div>
    </header>
  );
}

/* ── Breadcrumb ─────────────────────────────────────────────────── */
function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" style={{ padding: "16px max(1.5rem, calc((100% - 1280px)/2))", background: "var(--warm-white)", borderBottom: "1px solid var(--border)" }}>
      <div style={containerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)" }}>
          <a href="/" className="footer-link" style={{ display: "inline", marginBottom: 0 }}>Home</a>
          <span style={{ color: "var(--border)", fontSize: 11 }}>›</span>
          <span style={{ color: "var(--charcoal)", fontWeight: 600 }}>The Policy Lab</span>
        </div>
      </div>
    </nav>
  );
}

/* ── Article row ────────────────────────────────────────────────── */
function ArticleRow({ article, color }) {
  const kwTags = (article.tags || [])
    .filter(t => t?.slug && !SECTION_TAG_SLUGS.has(t.slug))
    .slice(0, 4);
  return (
    <a href={`/insights/${article.slug}`} className="article-row" style={{ alignItems: "stretch" }}>
      <div style={{ width: 3, alignSelf: "stretch", borderRadius: 4, background: color, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...playfair, fontSize: 16, fontWeight: 600, lineHeight: 1.35, marginBottom: 8 }}>{article.title}</div>
        {kwTags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: article.excerpt ? 8 : 0 }}>
            {kwTags.map(t => (
              <span
                key={t.id || t.slug}
                style={{
                  fontSize: 10.5, fontWeight: 600, letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  padding: "3px 9px", borderRadius: 20,
                  color, background: `color-mix(in srgb, ${color} 12%, transparent)`,
                }}
              >
                {t.name}
              </span>
            ))}
          </div>
        )}
        {article.excerpt && <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{article.excerpt.slice(0, 130)}{article.excerpt.length > 130 ? "…" : ""}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        {article.date && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(article.date)}</span>}
        {article.time && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{article.time}</span>}
        <span style={{ fontSize: 14, color }}>→</span>
      </div>
    </a>
  );
}

/* ── News card ──────────────────────────────────────────────────── */
function NewsCard({ article }) {
  return (
    <a href={`/insights/${article.slug}`} className="news-card">
      <div style={{ padding: "20px 22px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#14B8A6", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>News / Media</div>
        <div style={{ ...playfair, fontSize: 15, fontWeight: 600, lineHeight: 1.4, marginBottom: 8 }}>{article.title}</div>
        {article.excerpt && <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{article.excerpt.slice(0, 100)}…</div>}
        {article.date && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>{formatDate(article.date)}</div>}
      </div>
    </a>
  );
}

/* ── Empty state ────────────────────────────────────────────────── */
function EmptyState({ color, message }) {
  return (
    <div style={{ padding: "32px", background: "#fff", border: `1px dashed ${color}30`, borderRadius: 12, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
      {message}
    </div>
  );
}

/* ── Single sector block (e.g. Animal Husbandry) ───────────────── */
function SectorBlock({ sector }) {
  const rows = (sector.posts || []).map(toRow);
  const accent = sector.color || "#14B8A6";
  return (
    <div style={{ marginBottom: 56 }}>
      <Fade>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <span
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: `color-mix(in srgb, ${accent} 12%, transparent)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: accent,
            }}
            aria-hidden="true"
          >
            <Icon name={sector.icon} size={20} color={accent} />
          </span>
          <h3 style={{ ...playfair, fontSize: 22, margin: 0 }}>{sector.title}</h3>
          <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 4 }}>
            {rows.length === 0 ? "" : `· ${rows.length} ${rows.length === 1 ? "post" : "posts"}`}
          </span>
        </div>
        {sector.description && (
          <p style={{ fontSize: 14.5, color: "var(--text-muted)", margin: "0 0 20px", maxWidth: 640 }}>
            {sector.description}
          </p>
        )}
      </Fade>
      {rows.length === 0 ? (
        <EmptyState
          color={accent}
          message={`No posts yet — tag posts with "${sector.ghostTag}" in Ghost to add them here.`}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((article, i) => (
            <Fade key={article.slug} delay={0.04 * i}>
              <ArticleRow article={article} color={accent} />
            </Fade>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Policy Notes section: general bucket at top, department sectors below ─ */
function PolicyEssays({ sectors = [], generalPosts = [] }) {
  return (
    <section style={{ background: "var(--warm-white)", padding: "80px max(1.5rem, calc((100% - 1280px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: "color-mix(in srgb, var(--gold) 8%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#14B8A6" }} aria-hidden="true">◈</span>
            <h2 style={{ ...playfair, fontSize: 28, margin: 0 }}>Policy Notes</h2>
            {generalPosts.length > 0 && (
              <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 4 }}>· {generalPosts.length} posts</span>
            )}
          </div>
          <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 40, maxWidth: 640 }}>
            Field dispatches, cross-cutting essays, and governance analysis &mdash; both the general body of work and the departments I currently lead.
          </p>
        </Fade>

        {/* General Policy Notes — at the top, no sub-heading (the parent
            "Policy Notes" heading above already names this section). */}
        {generalPosts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 56 }}>
            {generalPosts.map(toRow).map((article, i) => (
              <Fade key={article.slug} delay={0.04 * i}>
                <ArticleRow article={article} color="#14B8A6" />
              </Fade>
            ))}
          </div>
        )}

        {/* Department-specific subdivisions — still useful as sub-sections
            inside the broader Policy Notes umbrella. */}
        {sectors.map((s) => (
          <SectorBlock key={s.id} sector={s} />
        ))}
      </div>
    </section>
  );
}

/* ── News & Media section ───────────────────────────────────────── */
function NewsMedia({ posts }) {
  const rows = posts.map(toRow);
  if (rows.length === 0) return null;
  return (
    <section style={{ background: "#fff", padding: "80px max(1.5rem, calc((100% - 1280px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: "#EF444415", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#EF4444" }} aria-hidden="true">◎</span>
            <h2 style={{ ...playfair, fontSize: 28, margin: 0 }}>News & Media</h2>
          </div>
          <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 36, maxWidth: 560 }}>Press coverage, statements, and media appearances.</p>
        </Fade>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {rows.map((article, i) => (
            <Fade key={article.slug} delay={0.05 * i}>
              <NewsCard article={article} />
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Main export ────────────────────────────────────────────────── */
export default function PolicyLabClient({ sectors = [], generalPosts = [], newsPosts = [] }) {
  const sectorTotal = sectors.reduce((n, s) => n + (s.posts?.length || 0), 0);
  const totalCount = sectorTotal + generalPosts.length + newsPosts.length;

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--charcoal)", background: "var(--warm-white)", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{STYLES}</style>
      <Nav />
      <span id="main" />
      <Hero count={totalCount} />
      <Breadcrumb />
      <PolicyEssays sectors={sectors} generalPosts={generalPosts} />
      <NewsMedia posts={newsPosts} />
      <BottomSection variant="policy" />
    </div>
  );
}
