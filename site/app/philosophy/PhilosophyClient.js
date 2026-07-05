"use client";
import { useState, useEffect, useRef } from "react";
import Nav from "../../components/Nav";
import BottomSection from "../../components/BottomSection";
import HeroBackground from "../../components/HeroBackground";
import { T, playfair, eyebrowSt, containerStyle, navyGrad } from "../../lib/theme";
import Fade from "../../components/Fade";
import Reveal from "../../components/Reveal";

const PURPLE = "#8B5CF6";
const INDIGO = "#4338CA";

/* ── Helpers ─────────────────────────────────────────────────────── */
function toRow(post) {
  return {
    title:   post.title   || "Untitled",
    sub:     post.primary_tag?.name || "Philosophy",
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
  .ph-row { text-decoration:none; display:flex; align-items:flex-start; gap:16px; padding:18px 22px; background:#fff; border:1px solid rgba(28,25,23,0.07); border-radius:12px; transition:all 0.25s; color:inherit; }
  .ph-row:hover { transform:translateX(4px); box-shadow:0 6px 24px rgba(0,0,0,0.05); border-color:rgba(139,92,246,0.2); }
  .sacred-card { text-decoration:none; display:block; border-radius:18px; overflow:hidden; transition:all 0.3s; color:inherit; position:relative; }
  .sacred-card:hover { transform:translateY(-4px); box-shadow:0 16px 48px rgba(0,0,0,0.12); }
  .sacred-card:hover .sacred-arrow { transform:translateX(4px); }
  .sacred-arrow { transition:transform 0.2s; display:inline-block; }
  .ph-tag { display:inline-block; font-size:10px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; padding:3px 9px; border-radius:20px; background:rgba(139,92,246,0.08); color:${PURPLE}; }
  .footer-link { display:block; font-size:13px; color:rgba(255,255,255,0.5); text-decoration:none; margin-bottom:8px; transition:color 0.2s; }
  .footer-link:hover { color:#5EEAD4; }
  @media(prefers-reduced-motion:reduce){ .fade-wrap{ opacity:1!important; transform:none!important; } }
  @media(max-width:768px){ .two-col{ grid-template-columns:repeat(2,minmax(0,1fr))!important; gap:14px!important; } .sacred-card{ border-radius:14px!important; } .sacred-card h3{ font-size:15px!important; } }
`;

/* ── Fade ────────────────────────────────────────────────────────── */
/* ── Hero ────────────────────────────────────────────────────────── */
function Hero({ count }) {
  return (
    <header style={{ position: "relative", overflow: "hidden", paddingTop: 130, paddingBottom: 80 }}>
      <HeroBackground page="philosophy" />
      {/* subtle dot grid */}
      <div className="drift-slow" style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.8) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      {/* purple glow */}
      <div className="drift-slow" style={{ position: "absolute", top: "30%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${PURPLE}18 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
        <Reveal delay={0.1}>
          <span style={{ ...eyebrowSt, color: PURPLE }}>Philosophy · {count} Essays</span>
        </Reveal>
        <Reveal delay={0.2}>
        <h1 style={{ ...playfair, fontSize: "clamp(34px,4.2vw,52px)", color: "#fff", lineHeight: 1.15, letterSpacing: "-0.025em", margin: "16px 0 24px" }}>
          The Examined <em style={{ color: PURPLE, fontStyle: "italic" }}>Life</em>
        </h1>
        </Reveal>
        <Reveal delay={0.3}>
        <p style={{ fontSize: 18, lineHeight: 1.75, color: "rgba(255,255,255,0.55)", maxWidth: 620, margin: "0 0 32px" }}>
          Eastern wisdom meets cognitive science — from the Gita to Gödel. Interactive verse-by-verse commentaries, essays on consciousness, and the philosophy of a decision-maker.
        </p>
        </Reveal>
        {/* breadcrumb */}
        <Reveal delay={0.4}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <a href="/" className="footer-link" style={{ display: "inline", marginBottom: 0, color: "rgba(255,255,255,0.4)" }}>Home</a>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Philosophy</span>
        </div>
        </Reveal>
      </div>
    </header>
  );
}

/* ── Sacred Texts card ───────────────────────────────────────────── */
function SacredCard({ title, subtitle, description, verse, href, color, icon, ready }) {
  return (
    <a href={href} className="sacred-card" style={{ background: `linear-gradient(140deg, ${color}0A 0%, ${color}18 100%)`, border: `1px solid ${color}30` }}>
      {!ready && (
        <div style={{ position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: `${color}20`, color, padding: "3px 10px", borderRadius: 20, border: `1px solid ${color}30` }}>
          Coming Soon
        </div>
      )}
      <div style={{ padding: "32px 28px" }}>
        {/* icon */}
        <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}15`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 20 }}>
          {icon}
        </div>
        {/* eyebrow */}
        <div style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
          Sacred Texts · Interactive Reader
        </div>
        {/* title */}
        <h3 style={{ ...playfair, fontSize: 22, color: "#1C1917", margin: "0 0 4px" }}>{title}</h3>
        <div style={{ fontSize: 13, color, fontWeight: 600, marginBottom: 14 }}>{subtitle}</div>
        {/* description */}
        <p style={{ fontSize: 14, color: "#78716C", lineHeight: 1.65, margin: "0 0 20px" }}>{description}</p>
        {/* sample verse */}
        <div style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", borderLeft: `3px solid ${color}`, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontStyle: "italic", color: "#44403C", lineHeight: 1.7 }}>{verse}</div>
        </div>
        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color }}>
          {ready ? "Open Reader" : "Notify me when live"}
          <span className="sacred-arrow">→</span>
        </div>
      </div>
    </a>
  );
}

/* ── Article row ─────────────────────────────────────────────────── */
function ArticleRow({ article }) {
  const secTags = article.tags.filter(t => t.slug !== "philosophy").slice(0, 3);
  return (
    <a href={`/insights/${article.slug}`} className="ph-row">
      <div style={{ width: 3, alignSelf: "stretch", borderRadius: 4, background: PURPLE, flexShrink: 0, minHeight: 40 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...playfair, fontSize: 15, lineHeight: 1.35, color: "#1C1917", marginBottom: 6 }}>
          {article.title}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
          {secTags.map(t => (
            <span key={t.id} className="ph-tag">{t.name}</span>
          ))}
          <span style={{ fontSize: 12, color: "#78716C", marginLeft: "auto" }}>
            {formatDate(article.date)}{article.time ? ` · ${article.time}` : ""}
          </span>
        </div>
        {article.excerpt && (
          <div style={{ fontSize: 13, color: "#78716C", lineHeight: 1.55, marginTop: 6 }}>
            {article.excerpt.slice(0, 120)}{article.excerpt.length > 120 ? "…" : ""}
          </div>
        )}
      </div>
      <span style={{ fontSize: 14, color: PURPLE, flexShrink: 0 }}>→</span>
    </a>
  );
}

/* ── Main ────────────────────────────────────────────────────────── */
export default function PhilosophyClient({ posts = [] }) {
  const rows = posts.map(toRow);

  return (
    <div style={{ fontFamily: "'Source Sans 3','Source Sans Pro',system-ui,sans-serif", color: "#1C1917", background: "#FAFAF8", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{STYLES}</style>
      <Nav />
      <span id="main" />
      <Hero count={posts.length} />

      {/* ── Sacred Texts section ── */}
      <section style={{ background: "#fff", padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
        <div style={containerStyle}>
          <Fade>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ width: 40, height: 40, borderRadius: 10, background: `${INDIGO}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: INDIGO }} aria-hidden="true">☸</span>
              <h2 style={{ ...playfair, fontSize: 28, margin: 0 }}>Sacred Texts</h2>
            </div>
            <p style={{ fontSize: 15, color: "#78716C", marginBottom: 36, maxWidth: 560 }}>
              Verse-by-verse interactive commentaries — read the original Sanskrit, transliteration, translation, and Basava's personal reflections side by side.
            </p>
          </Fade>

          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Fade delay={0.05}>
              <SacredCard
                title="Bhagavad Gita"
                subtitle="18 Chapters · 700 Verses"
                description="The dialogue between Arjuna and Krishna on the battlefield of Kurukshetra — a guide to duty, action, and the nature of the self."
                verse="कर्मण्येवाधिकारस्ते मा फलेषु कदाचन — You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions."
                icon="🪷"
                color={INDIGO}
                href="/philosophy/geeta"
                ready={true}
              />
            </Fade>
            <Fade delay={0.1}>
              <SacredCard
                title="Patanjali Yoga Sutras"
                subtitle="4 Padas · 196 Sutras"
                description="The foundational text of classical yoga philosophy — a precise map of the mind, consciousness, and the path to liberation."
                verse="योगश्चित्तवृत्तिनिरोधः — Yoga is the cessation of the fluctuations of the mind."
                icon="🧘"
                color={PURPLE}
                href="/philosophy/pys"
                ready={true}
              />
            </Fade>
          </div>
        </div>
      </section>

      {/* ── Philosophy Articles section ── */}
      <section style={{ background: "#FAFAF8", padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
        <div style={containerStyle}>
          <Fade>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ width: 40, height: 40, borderRadius: 10, background: `${PURPLE}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: PURPLE }} aria-hidden="true">◉</span>
              <h2 style={{ ...playfair, fontSize: 28, margin: 0 }}>Philosophy Essays</h2>
            </div>
            <p style={{ fontSize: 15, color: "#78716C", marginBottom: 36, maxWidth: 560 }}>
              Nietzsche, Pascal, Sartre, Jung — and the ancient Indian traditions. Essays on consciousness, meaning, and the architecture of human thought.
            </p>
          </Fade>

          {rows.length === 0 ? (
            <div style={{ padding: "32px", background: "#fff", border: `1px dashed ${PURPLE}30`, borderRadius: 12, textAlign: "center", color: "#78716C", fontSize: 14 }}>
              Philosophy articles coming soon — tag posts with 'Philosophy' in Ghost CMS.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {rows.map((article, i) => (
                <Fade key={article.slug} delay={0.04 * i}>
                  <ArticleRow article={article} />
                </Fade>
              ))}
            </div>
          )}
        </div>
      </section>

      <BottomSection variant="mind" />
    </div>
  );
}
