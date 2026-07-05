"use client";
import { useState, useEffect, useRef } from "react";
import Nav from "../../components/Nav";
import Icon from "../../components/Icon";
import BottomSection from "../../components/BottomSection";
import HeroBackground from "../../components/HeroBackground";

import { T, playfair, eyebrowSt, containerStyle } from "../../lib/theme";
import Fade from "../../components/Fade";
import Reveal from "../../components/Reveal";

/* ── Helpers ────────────────────────────────────────────────────── */
// Section tag slugs that organise content into pages — filtered out of the
// visible tag pills so cards surface meaningful content keywords instead.
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
    sub:     post.primary_tag?.name || "Mind & Machine",
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

/* ── CSS ─────────────────────────────────────────────────────────── */
const STYLES = `
  /* ── Article row ── */
  .mm-row {
    text-decoration: none;
    display: flex;
    align-items: stretch;
    background: #fff;
    border: 1px solid rgba(28,25,23,0.07);
    border-radius: 12px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    color: inherit;
    overflow: hidden;
  }
  .mm-row:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.07);
    border-color: rgba(28,25,23,0.13);
  }
  .mm-row:focus-visible {
    outline: 2px solid #4338CA;
    outline-offset: 2px;
  }

  /* ── Article row body ── */
  .mm-row-body {
    flex: 1;
    min-width: 0;
    padding: 18px 20px;
  }

  /* ── Article row meta ── */
  .mm-row-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    padding: 18px 20px 18px 0;
  }

  /* ── Tag chip ── */
  .mm-tag {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 20px;
    border: 1px solid transparent;
  }

  /* ── Reading time badge ── */
  .mm-time {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--text-muted);
    white-space: nowrap;
    padding: 4px 10px;
    background: rgba(28,25,23,0.04);
    border-radius: 20px;
  }

  /* ── Arrow ── */
  .mm-arrow {
    font-size: 16px;
    transition: transform 0.2s ease;
    display: flex;
    align-items: center;
    line-height: 1;
  }
  .mm-row:hover .mm-arrow { transform: translateX(4px); }

  /* ── CTA button ── */
  .mm-cta-btn {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    background: #10B981;
    padding: 13px 26px;
    border-radius: 10px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }
  .mm-cta-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(16,185,129,0.32);
  }

  /* ── Thin horizontal rule ── */
  .mm-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(28,25,23,0.07) 20%, rgba(28,25,23,0.07) 80%, transparent);
    margin: 0;
    border: none;
  }

  /* ── Footer links ── */
  .footer-link { display: block; font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; margin-bottom: 8px; transition: color 0.2s; }
  .footer-link:hover { color: #5EEAD4; }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .mm-row-meta { padding: 14px 14px 14px 0; gap: 8px; }
    .mm-row-body { padding: 14px; }
    .mm-time { display: none; }
    .mm-intro, .mm-other-intro { padding-left: 0 !important; }
    .mm-cta-wrap { padding: 24px 20px !important; }
  }
  @media (max-width: 768px) {
    .three-col { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 12px !important; }
    .two-col   { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 12px !important; }
  }
  @media (max-width: 1024px) and (min-width: 769px) {
    .three-col { grid-template-columns: 1fr 1fr !important; }
  }
  @media (prefers-reduced-motion: reduce) {
    .mm-row, .mm-row:hover { transform: none; transition: none; }
    .mm-arrow, .mm-row:hover .mm-arrow { transform: none; transition: none; }
    .mm-cta-btn, .mm-cta-btn:hover { transform: none; box-shadow: none; transition: none; }
  }
`;

/* ── Breadcrumb ─────────────────────────────────────────────────── */
function Breadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        background: "#fff",
        borderBottom: "1px solid rgba(28,25,23,0.06)",
        padding: "0 max(1.5rem, calc((100% - 1280px)/2))",
      }}
    >
      <div style={{ ...containerStyle, padding: "13px 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
          <a
            href="/"
            className="footer-link"
            style={{ display: "inline", marginBottom: 0, color: "var(--text-muted)", fontSize: 13 }}
          >
            Home
          </a>
          <span style={{ color: "rgba(28,25,23,0.25)", fontSize: 11 }}>›</span>
          <span style={{ color: "var(--charcoal)", fontWeight: 600, fontSize: 13 }}>Mind &amp; Machine</span>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero ───────────────────────────────────────────────────────── */
function Hero({ count }) {
  return (
    <header
      style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: 140,
        paddingBottom: 100,
      }}
    >
      <HeroBackground page="mind-and-machine" />
      {/* Dot texture */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />
      {/* Indigo ambient glow */}
      <div style={{
        position: "absolute", top: -120, right: -80,
        width: 520, height: 520,
        background: "radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Purple accent from the bottom-left */}
      <div style={{
        position: "absolute", bottom: -80, left: -60,
        width: 380, height: 380,
        background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Indigo accent line along the bottom edge */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 3,
        background: "linear-gradient(90deg, transparent 0%, #4338CA 25%, #6366F1 55%, transparent 100%)",
      }} />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
        {/* Eyebrow pill */}
        <Reveal delay={0.1}>
          <div style={{ marginBottom: 22 }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontWeight: 700,
              color: "#A5B4FC",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "6px 14px",
              borderRadius: 20,
              border: "1px solid rgba(99,102,241,0.3)",
              background: "rgba(99,102,241,0.1)",
            }}>
              Essays · {count} Articles
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <h1 style={{
            ...playfair,
            fontSize: "clamp(38px, 5vw, 58px)",
            color: "#fff",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            margin: "0 0 24px",
          }}>
            Mind &amp; Machine
          </h1>
        </Reveal>

        <Reveal delay={0.3}>
          <p style={{
            fontSize: "clamp(16px, 1.8vw, 18px)",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.52)",
            maxWidth: 600,
            margin: 0,
          }}>
            From neural networks to neural pathways, from the Gita to GPT — exploring intelligence at every level. Essays on AI foundations, cognitive science, philosophy, and the examined life.
          </p>
        </Reveal>
      </div>
    </header>
  );
}

/* ── Article row ────────────────────────────────────────────────── */
function ArticleRow({ article, color }) {
  const kwTags = (article.tags || [])
    .filter(t => t?.slug && !SECTION_TAG_SLUGS.has(t.slug))
    .slice(0, 4);

  return (
    <a href={`/insights/${article.slug}`} className="mm-row">
      {/* Left accent bar */}
      <div style={{
        width: 4,
        alignSelf: "stretch",
        flexShrink: 0,
        background: color,
        borderRadius: 0,
      }} />
      <div className="mm-row-body">
        <div style={{
          ...playfair,
          fontSize: 15.5,
          fontWeight: 700,
          lineHeight: 1.4,
          marginBottom: (kwTags.length > 0 || article.excerpt) ? 8 : 0,
          color: "var(--charcoal)",
        }}>
          {article.title}
        </div>
        {kwTags.length > 0 && (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 5,
            marginBottom: article.excerpt ? 8 : 0,
          }}>
            {kwTags.map(t => (
              <span
                key={t.id || t.slug}
                className="mm-tag"
                style={{
                  color,
                  background: `color-mix(in srgb, ${color} 10%, transparent)`,
                  borderColor: `color-mix(in srgb, ${color} 22%, transparent)`,
                }}
              >
                {t.name}
              </span>
            ))}
          </div>
        )}
        {article.excerpt && (
          <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
            {article.excerpt.slice(0, 130)}{article.excerpt.length > 130 ? "…" : ""}
          </div>
        )}
      </div>
      <div className="mm-row-meta">
        {article.time && <span className="mm-time">{article.time}</span>}
        <span className="mm-arrow" style={{ color }}>→</span>
      </div>
    </a>
  );
}

/* ── Empty state ────────────────────────────────────────────────── */
function EmptyState({ color, message }) {
  return (
    <div style={{
      padding: "40px 32px",
      background: "#fff",
      border: `1px dashed color-mix(in srgb, ${color} 28%, transparent)`,
      borderRadius: 12,
      textAlign: "center",
      color: "var(--text-muted)",
      fontSize: 14,
      lineHeight: 1.65,
    }}>
      {message}
    </div>
  );
}

/* ── Single section block (Mind or Machine) ─────────────────────── */
function SectionBlock({ section, background }) {
  const rows = (section.posts || []).map(toRow);
  const accent = section.color || "#14B8A6";

  return (
    <section style={{ background, padding: "0 max(1.5rem, calc((100% - 1280px)/2))" }}>
      <hr className="mm-divider" />
      <div style={{ ...containerStyle, paddingTop: 80, paddingBottom: 80 }}>
        {/* Section header */}
        <Fade>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 0 }}>
            {/* Icon box */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `color-mix(in srgb, ${accent} 10%, transparent)`,
                border: `1px solid color-mix(in srgb, ${accent} 22%, transparent)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 4,
              }}
              aria-hidden="true"
            >
              <Icon name={section.icon} size={22} color={accent} />
            </div>
            <div>
              <h2 style={{
                ...playfair,
                fontSize: "clamp(26px, 3vw, 32px)",
                margin: "0 0 5px",
                letterSpacing: "-0.02em",
              }}>
                {section.title}
              </h2>
              {section.subtitle && (
                <p style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: accent,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  margin: 0,
                }}>
                  {section.subtitle}
                </p>
              )}
            </div>
          </div>

          {section.intro && (
            <p className="mm-intro" style={{
              fontSize: 16.5,
              lineHeight: 1.8,
              color: "var(--text-body)",
              margin: "28px 0 40px",
              maxWidth: 740,
              paddingLeft: 64,
            }}>
              {section.intro}
            </p>
          )}
        </Fade>

        {/* Article list */}
        {rows.length === 0 ? (
          <EmptyState
            color={accent}
            message={`No posts yet — tag posts with "${section.ghostTag}" in Ghost to add them here.`}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rows.map((article, i) => (
              <Fade key={article.slug} delay={0.04 * i}>
                <ArticleRow article={article} color={accent} />
              </Fade>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Optional bucket: posts tagged mind-machine but no sub-section ── */
function OtherEssays({ posts }) {
  if (!posts?.length) return null;
  const rows = posts.map(toRow);
  const accent = "#14B8A6";

  return (
    <section style={{ background: "var(--warm-white)", padding: "0 max(1.5rem, calc((100% - 1280px)/2))" }}>
      <hr className="mm-divider" />
      <div style={{ ...containerStyle, paddingTop: 64, paddingBottom: 64 }}>
        <Fade>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `color-mix(in srgb, ${accent} 10%, transparent)`,
              border: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: accent,
              flexShrink: 0,
            }} aria-hidden="true">◆</div>
            <div>
              <h3 style={{ ...playfair, fontSize: 22, margin: "0 0 2px" }}>Other Mind &amp; Machine Essays</h3>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>· {posts.length} posts</span>
            </div>
          </div>
          <p className="mm-other-intro" style={{
            fontSize: 14.5,
            color: "var(--text-muted)",
            margin: "0 0 24px",
            maxWidth: 640,
            paddingLeft: 52,
            lineHeight: 1.65,
          }}>
            Earlier or cross-cutting posts that don't fit neatly into either subsection.
          </p>
        </Fade>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map((article, i) => (
            <Fade key={article.slug} delay={0.04 * i}>
              <ArticleRow article={article} color={accent} />
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Main export ────────────────────────────────────────────────── */
export default function MindAndMachineClient({ sections = [], generalPosts = [] }) {
  const sectionTotal = sections.reduce((n, s) => n + (s.posts?.length || 0), 0);
  const totalCount = sectionTotal + generalPosts.length;

  return (
    <div style={{
      fontFamily: "'Source Sans 3', 'Source Sans Pro', system-ui, sans-serif",
      color: "var(--charcoal)",
      background: "var(--warm-white)",
      minHeight: "100vh",
      overflowX: "hidden",
    }}>
      <style>{STYLES}</style>
      <Nav />
      <span id="main" />
      <Hero count={totalCount} />
      <Breadcrumb />

      {sections.map((s, i) => (
        <SectionBlock
          key={s.id}
          section={s}
          background={i % 2 === 0 ? "var(--warm-white)" : "#fff"}
        />
      ))}

      <OtherEssays posts={generalPosts} />

      {/* Late Compiler CTA */}
      <section style={{ background: "#fff", padding: "0 max(1.5rem, calc((100% - 1280px)/2))" }}>
        <hr className="mm-divider" />
        <div style={{ ...containerStyle, paddingTop: 56, paddingBottom: 56 }}>
          <Fade>
            <div className="mm-cta-wrap" style={{
              background: "linear-gradient(135deg, #0A1220 0%, #0F1A2E 50%, #1B2A4A 100%)",
              border: "1px solid rgba(99,102,241,0.18)",
              borderRadius: 16,
              padding: "32px 36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 20,
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Subtle glow accents */}
              <div style={{
                position: "absolute", top: -60, right: -60,
                width: 260, height: 260,
                background: "radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", bottom: -40, left: 60,
                width: 180, height: 180,
                background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{
                  ...playfair,
                  fontSize: 18,
                  marginBottom: 7,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                }}>
                  New to these topics?
                </div>
                <div style={{
                  fontSize: 14.5,
                  color: "rgba(255,255,255,0.58)",
                  lineHeight: 1.65,
                  maxWidth: 420,
                }}>
                  The Late Compiler teaches AI, Python, and machine learning from zero — with hands-on exercises every week.
                </div>
              </div>
              <a href="/the-late-compiler" className="mm-cta-btn">
                Start learning →
              </a>
            </div>
          </Fade>
        </div>
      </section>

      <BottomSection variant="mind" />
    </div>
  );
}
