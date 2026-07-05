"use client";
import { useState, useEffect, useRef } from "react";
import Nav from "../../components/Nav";
import BottomSection from "../../components/BottomSection";
import HeroBackground from "../../components/HeroBackground";
import { T, playfair, eyebrowSt, containerStyle, navyGrad } from "../../lib/theme";
import Fade from "../../components/Fade";

const GREEN = "#10B981";

// Section tags hidden from visible pills so cards show content keywords.
const LC_SECTION_TAG_SLUGS = new Set([
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
  .lc-card { text-decoration:none; display:block; border:1px solid rgba(13,13,13,0.08); border-radius:14px; background:#fff; transition:all 0.25s; color:inherit; }
  .lc-card:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,0,0,0.07); }
  .lc-video { text-decoration:none; display:flex; gap:12px; padding:14px 18px; background:var(--warm-white); border-radius:12px; border:1px solid rgba(13,13,13,0.07); transition:all 0.2s; color:inherit; }
  .lc-video:hover { box-shadow:0 4px 16px rgba(0,0,0,0.06); transform:translateY(-1px); }
  .lc-explore { text-decoration:none; display:flex; align-items:center; gap:14px; padding:20px 24px; background:#fff; border-radius:14px; border:1px solid rgba(13,13,13,0.07); transition:all 0.25s; color:inherit; position:relative; overflow:hidden; }
  .lc-explore:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(0,0,0,0.07); }
  .lc-track-row { border:1px solid rgba(13,13,13,0.08); border-radius:16px; overflow:hidden; background:#fff; transition:border-color 0.25s; }
  @media(max-width:768px) { .two-col{ grid-template-columns:repeat(2,minmax(0,1fr))!important; gap:12px!important; } .three-col{ grid-template-columns:repeat(2,minmax(0,1fr))!important; gap:12px!important; } .stat-row{ grid-template-columns:repeat(2,minmax(0,1fr))!important; } }
`;

/* ── Fade ─────────────────────────────────────────────────────────── */
/* ── Hero ─────────────────────────────────────────────────────────── */
/* The Late Compiler hero — code-editor-inspired layout to signal
   "this is the technical learning hub". Differentiates this page from
   the standard navy-gradient + dotted-bg + serif-h1 pattern that the
   other section pages share.

   Visual ingredients:
     • Darker slate background (no radial-dot grid)
     • Terminal-window chrome at the top (3 colored dots + a path)
     • Faint vertical line-number gutter on the left edge
     • Monospace prompt as the eyebrow (`~/late-compiler $ npm run learn`)
     • Heading wrapped in code-bracket syntax: <The Late Compiler />
     • Blinking caret cursor at the end of the prompt
     • Stats line styled in monospace
   The brand serif (Playfair) and green accent stay — it still belongs
   to the site, just in a different room. */
const MONO = "'JetBrains Mono','Fira Code','SF Mono',Consolas,monospace";

function Hero({ totalArticles }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 80); return () => clearTimeout(t); }, []);
  const e = (d) => ({ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(24px)", transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${d}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${d}s` });

  return (
    <header style={{ position: "relative", overflow: "hidden", paddingTop: 130, paddingBottom: 88 }}>
      <HeroBackground page="the-late-compiler" />
      {/* faint left-edge line-number gutter */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 60, opacity: 0.06, fontFamily: MONO, fontSize: 11, color: "#fff", lineHeight: "26px", paddingTop: 130, textAlign: "right", paddingRight: 12, pointerEvents: "none", userSelect: "none" }} aria-hidden="true">
        {Array.from({ length: 20 }, (_, i) => <div key={i}>{String(i + 1).padStart(2, "0")}</div>)}
      </div>
      {/* subtle scanline overlay */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)", pointerEvents: "none" }} aria-hidden="true" />
      {/* soft green glow on the right */}
      <div className="drift-slow" style={{ position: "absolute", top: "10%", right: "6%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle,${GREEN}10 0%,transparent 65%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
        {/* terminal window chrome */}
        <div style={{ ...e(0.1), display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
          </div>
          <span style={{ fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.02em" }}>
            ~/late-compiler &mdash; bash &mdash; 80&times;24
          </span>
        </div>

        {/* monospace prompt line — the eyebrow, reimagined */}
        <div style={{ ...e(0.18), fontFamily: MONO, fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 22 }}>
          <span style={{ color: GREEN }}>basava</span>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>@</span>
          <span style={{ color: "#FEBC2E" }}>vps</span>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>:</span>
          <span style={{ color: "#5EEAD4" }}>~/late-compiler</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>$ </span>
          <span style={{ color: "#fff" }}>npm run learn</span>
          <span className="caret" style={{ display: "inline-block", width: 8, height: 16, background: GREEN, marginLeft: 6, verticalAlign: "middle", animation: "blink 1s steps(2) infinite" }} />
          <style>{`@keyframes blink{50%{opacity:0}}`}</style>
        </div>

        {/* heading wrapped in code-bracket syntax */}
        <h1 style={{ ...e(0.26), ...playfair, fontSize: "clamp(36px,4.5vw,56px)", color: "#fff", lineHeight: 1.12, letterSpacing: "-0.025em", margin: "0 0 18px" }}>
          <span style={{ fontFamily: MONO, fontWeight: 400, color: "rgba(255,255,255,0.3)", fontSize: "0.7em" }}>&lt;</span>
          The Late <span style={{ color: GREEN }}>Compiler</span>
          <span style={{ fontFamily: MONO, fontWeight: 400, color: "rgba(255,255,255,0.3)", fontSize: "0.7em" }}> /&gt;</span>
        </h1>

        <p style={{ ...e(0.32), fontSize: 20, lineHeight: 1.75, color: "rgba(255,255,255,0.6)", maxWidth: 620, margin: "0 0 10px" }}>
          It&rsquo;s never too late to learn to think like a machine.
        </p>

        {/* subtitle styled as a monospace comment */}
        <p style={{ ...e(0.38), fontFamily: MONO, fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.4)", maxWidth: 620, margin: "0 0 36px" }}>
          <span style={{ color: GREEN }}>{"// "}</span>
          AI, machine learning, Python, and agentic systems &mdash; explained for people who came to technology later in life. Applied, not theoretical: use these tools, not just understand them.
        </p>

        {/* stats line in monospace */}
        <div style={{ ...e(0.46), display: "flex", gap: 32, flexWrap: "wrap" }}>
          {[["5", "tracks"], [totalArticles > 0 ? totalArticles : "~50", "lessons"], ["1/wk", "cadence"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: MONO, fontSize: 28, fontWeight: 600, color: GREEN }}>{n}</div>
              <div style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ── Philosophy quote ─────────────────────────────────────────────── */
function PhilosophyBanner() {
  return (
    <section style={{ background: "var(--cream)", padding: "56px max(1.5rem,calc((100% - 820px)/2))" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <Fade>
          <p style={{ ...playfair, fontSize: 20, fontWeight: 400, fontStyle: "italic", color: "var(--charcoal)", lineHeight: 1.75, margin: "0 0 16px" }}>
            "A compiler translates human language into machine language. Some of us just started the translation a little later than others. That doesn't make the output any less powerful."
          </p>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>— Dr. B.V.R.C. Purushottam, IAS</p>
        </Fade>
      </div>
    </section>
  );
}

/* ── Track Accordion ──────────────────────────────────────────────── */
function TrackAccordion({ tracks }) {
  const [open, setOpen] = useState(null);
  const toggle = (id) => setOpen(open === id ? null : id);

  return (
    <section style={{ background: "var(--warm-white)", padding: "80px max(1.5rem,calc((100% - 1280px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <div style={{ marginBottom: 8 }}>
            <span style={eyebrowSt}>5 Learning Tracks</span>
            <h2 style={{ ...playfair, fontSize: 28, margin: "10px 0 8px" }}>Choose your path</h2>
            <p style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 540, marginBottom: 36 }}>
              Each track is independent. Start anywhere, go at your pace. Articles from Ghost CMS load automatically when published.
            </p>
          </div>
        </Fade>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tracks.map((track, i) => {
            const isOpen = open === track.id;
            const articleCount = track.articles?.length ?? 0;
            const videoCount = track.videos?.length ?? 0;

            return (
              <Fade key={track.id} delay={0.05 * i}>
                <div className="lc-track-row" style={{ borderColor: isOpen ? `${track.color}35` : "rgba(13,13,13,0.08)" }}>
                  {/* Header row */}
                  <button
                    onClick={() => toggle(track.id)}
                    aria-expanded={isOpen}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 20, padding: "22px 28px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                  >
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${track.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ ...playfair, fontSize: 18, color: track.color }}>{track.icon}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...playfair, fontSize: 19, marginBottom: 2, color: "var(--charcoal)" }}>{track.title}</div>
                      <div style={{ fontSize: 14, color: track.color, fontWeight: 600 }}>{track.tagline}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{articleCount + videoCount} items</span>
                      {articleCount > 0 && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: GREEN, background: `${GREEN}12`, padding: "2px 8px", borderRadius: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          {articleCount} live
                        </span>
                      )}
                      <span style={{ fontSize: 18, color: "var(--text-subtle)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}>⌄</span>
                    </div>
                  </button>

                  {/* Expanded body */}
                  {isOpen && (
                    <div style={{ padding: "0 28px 28px", borderTop: "1px solid var(--border)" }}>
                      <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-body)", margin: "20px 0 24px" }}>{track.description}</p>

                      {/* Ghost articles */}
                      {articleCount > 0 ? (
                        <div style={{ marginBottom: 20 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: track.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Articles</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {track.articles.map(a => {
                              const kwTags = (a.tags || [])
                                .filter(t => t?.slug && !LC_SECTION_TAG_SLUGS.has(t.slug))
                                .slice(0, 4);
                              return (
                                <a key={a.slug} href={`/insights/${a.slug}`} className="lc-card" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "14px 18px", gap: 12 }}>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ ...playfair, fontSize: 15, lineHeight: 1.35, marginBottom: 6 }}>{a.title}</div>
                                    {kwTags.length > 0 && (
                                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
                                        {kwTags.map(t => (
                                          <span key={t.id || t.slug} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 20, background: `${track.color}12`, color: track.color }}>
                                            {t.name}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                      {a.reading_time ? `${a.reading_time} min read` : ""}
                                      {a.published_at ? ` · ${new Date(a.published_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}` : ""}
                                    </div>
                                  </div>
                                  <span style={{ fontSize: 14, color: track.color, flexShrink: 0 }}>→</span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div style={{ marginBottom: 20, padding: "12px 16px", background: `${track.color}06`, borderRadius: 10, border: `1px dashed ${track.color}20`, fontSize: 13, color: "var(--text-muted)" }}>
                          Articles coming soon — tag posts with <code style={{ background: "rgba(0,0,0,0.05)", padding: "1px 5px", borderRadius: 3 }}>{track.ghostTag}</code> in Ghost CMS
                        </div>
                      )}

                      {/* Videos */}
                      {videoCount > 0 && (
                        <div style={{ marginBottom: 20 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: track.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Video Lessons</div>
                          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            {track.videos.map(v => (
                              <a key={v.title} href={v.url} target="_blank" rel="noopener noreferrer" className="lc-video" aria-label={`Watch: ${v.title}`}>
                                <div style={{ width: 38, height: 38, borderRadius: 10, background: v.source === "own" ? `${track.color}14` : "color-mix(in srgb, var(--text-subtle) 8%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <span style={{ fontSize: 13, color: v.source === "own" ? track.color : "var(--text-muted)" }}>▶</span>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--charcoal)", lineHeight: 1.35 }}>{v.title}</div>
                                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                                    {v.author} · {v.duration}
                                    {v.source === "own" && <span style={{ marginLeft: 6, color: track.color, fontWeight: 700 }}>★ Dr. Purushottam</span>}
                                  </div>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Deep dive link */}
                      {track.deepDive && (
                        <div style={{ padding: "12px 16px", borderRadius: 10, background: "#3B82F608", border: "1px solid #3B82F618", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                          <span style={{ fontSize: 13, color: "var(--text-body)" }}>{track.deepDive.text}</span>
                          <a href={track.deepDive.link} style={{ fontSize: 13, fontWeight: 600, color: "#3B82F6", textDecoration: "none" }}>{track.deepDive.label} →</a>
                        </div>
                      )}

                      <div style={{ padding: "12px 16px", borderRadius: 10, background: `${track.color}06`, border: `1px solid ${track.color}18`, fontSize: 13, color: track.color, fontWeight: 600 }}>
                        Subscribe to get notified when new lessons drop →
                      </div>
                    </div>
                  )}
                </div>
              </Fade>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Who is this for ──────────────────────────────────────────────── */
function WhoIsThisFor() {
  const personas = [
    { label: "The curious Civil Servant", desc: "You've heard about AI in governance but never had time to learn the fundamentals.", color: "#14B8A6" },
    { label: "The 50-year-old professional", desc: "Your colleagues use ChatGPT. You want to understand what's actually happening under the hood.", color: "#3B82F6" },
    { label: "The parent or grandparent", desc: "Your children talk about machine learning. You want to talk back — intelligently.", color: "#8B5CF6" },
    { label: "The career switcher", desc: "You're pivoting into tech or AI-adjacent roles and need a structured starting point.", color: GREEN },
  ];
  return (
    <section style={{ background: "#fff", padding: "72px max(1.5rem,calc((100% - 1280px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <span style={eyebrowSt}>Who this is for</span>
          <h2 style={{ ...playfair, fontSize: 28, margin: "10px 0 36px" }}>You belong here if…</h2>
        </Fade>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {personas.map((p, i) => (
            <Fade key={p.label} delay={0.06 * i}>
              <div style={{ padding: "26px", borderRadius: 14, border: "1px solid var(--border)", background: "var(--warm-white)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, marginBottom: 14 }} />
                <h3 style={{ ...playfair, fontSize: 17, margin: "0 0 8px" }}>{p.label}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--text-muted)", margin: 0 }}>{p.desc}</p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How it works ─────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: "01", title: "Pick a track", desc: "Choose based on what you want to do — use AI tools, write code, build models, or understand agents." },
    { n: "02", title: "Do first, understand second", desc: "Every lesson starts with a hands-on task. Theory arrives as explanation, not prerequisite." },
    { n: "03", title: "Go at your pace", desc: "No deadlines, no exams, no judgment. One article a week. Revisit as often as you need." },
    { n: "04", title: "Build a real portfolio", desc: "By the end of each track you'll have built something — a working script, a trained model, a tool you actually use." },
  ];
  return (
    <section style={{ background: "var(--cream)", padding: "72px max(1.5rem,calc((100% - 1280px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <span style={eyebrowSt}>How it works</span>
          <h2 style={{ ...playfair, fontSize: 28, margin: "10px 0 36px", textAlign: "center" }}>Learn by doing, not by reading</h2>
        </Fade>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 820, margin: "0 auto" }}>
          {steps.map((s, i) => (
            <Fade key={s.n} delay={0.06 * i}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ ...playfair, fontSize: 40, color: `${GREEN}22`, lineHeight: 1, flexShrink: 0 }}>{s.n}</div>
                <div>
                  <h3 style={{ ...playfair, fontSize: 16, margin: "0 0 6px" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--text-muted)", margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Closing note ─────────────────────────────────────────────────── */
function ClosingNote() {
  return (
    <section style={{ background: navyGrad, padding: "80px max(1.5rem,calc((100% - 820px)/2))" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Fade>
          <span style={{ ...eyebrowSt, display: "block", marginBottom: 20 }}>A note from the teacher</span>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: "rgba(255,255,255,0.72)", margin: "0 0 20px" }}>
            At 49, I started learning machine learning and wrote my first Python script — now continuing that journey through a Postgraduate Certificate in Applied AI and Agentic AI from IIIT Bangalore via upGrad.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: "rgba(255,255,255,0.72)", margin: "0 0 20px" }}>
            I learned by doing, not by studying. That's the philosophy of The Late Compiler: every lesson is built around something you'll actually use. You won't sit through hours of theory before touching a real tool. You'll open ChatGPT in lesson one. You'll write working Python by lesson two.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: "rgba(255,255,255,0.72)", margin: 0 }}>
            The only prerequisite is <span style={{ color: "#14B8A6", fontWeight: 600 }}>curiosity</span>.
          </p>
        </Fade>
      </div>
    </section>
  );
}

/* ── Community ────────────────────────────────────────────────────── */
function Community() {
  return (
    <section style={{ background: "#fff", padding: "48px max(1.5rem,calc((100% - 1280px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <div style={{ background: "var(--warm-white)", borderRadius: 16, border: "1px solid var(--border)", padding: "28px 32px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#25D36612", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>💬</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ ...playfair, fontSize: 17, marginBottom: 4 }}>Join the learning community</div>
              <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 }}>Weekly discussions, doubt-clearing, and peer support on WhatsApp. 200+ learners and growing.</div>
            </div>
            <a href="https://chat.whatsapp.com/" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 14, fontWeight: 600, color: "#fff", background: "#25D366", padding: "12px 24px", borderRadius: 8, textDecoration: "none" }}>
              Join on WhatsApp
            </a>
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ── Explore More ─────────────────────────────────────────────────── */
const EXPLORE = [
  { title: "Mind & Machine", sub: "AI meets philosophy — essays", href: "/mind-and-machine", color: "#3B82F6", icon: "⟐" },
  { title: "The Proving Ground", sub: "Discipline & official impact", href: "/proving-ground", color: "#E8593C", icon: "△" },
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
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {EXPLORE.map((h, i) => (
            <Fade key={h.href} delay={0.06 * i}>
              <a href={h.href} className="lc-explore">
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
export default function LateCompilerClient({ tracks = [], allPosts = [] }) {
  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--charcoal)", background: "var(--warm-white)", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{STYLES}</style>
      <Nav />
      <span id="lc-main" />
      <Hero totalArticles={allPosts.length} />
      <PhilosophyBanner />
      <TrackAccordion tracks={tracks} />
      <WhoIsThisFor />
      <HowItWorks />
      <ClosingNote />
      <Community />
      <ExploreMore />
      <BottomSection variant="mind" />
    </div>
  );
}
