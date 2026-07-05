"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Fade from "../../components/Fade";
import Reveal from "../../components/Reveal";
import { Stagger, StaggerItem } from "../../components/Stagger";
import MotionCard from "../../components/MotionCard";

import { T, playfair } from "../../lib/theme";

/* ── Section grouping ─────────────────────────────────────────────
 * Posts are grouped into top-level sections in the order requested
 * by the site owner. Each post is assigned to the FIRST section in
 * this list whose tag slug appears on the post, so a post tagged with
 * both `mind-machine` and `philosophy` lands under Mind & Machine.
 * Posts with no matching tag fall through to "Other".
 */
const SECTION_ORDER = [
  { key: "mind-machine",   name: "Mind & Machine",     color: "#3B82F6" },
  { key: "philosophy",     name: "Philosophy",          color: "#8B5CF6" },
  { key: "policy-lab",     name: "The Policy Lab",     color: "#14B8A6" },
  { key: "proving-ground", name: "The Proving Ground", color: "#E8593C" },
  { key: "late-compiler",  name: "The Late Compiler",  color: "#10B981" },
  { key: "reading",        name: "Reading",             color: "#D946EF" },
  { key: "media",          name: "In the Media",       color: "#F59E0B" },
  { key: "__other__",      name: "Other",               color: "#6B7280" },
];

function sectionFor(post) {
  const tagSlugs = new Set((post.tags || []).map((t) => t.slug));
  for (const s of SECTION_ORDER) {
    if (s.key !== "__other__" && tagSlugs.has(s.key)) return s.key;
  }
  return "__other__";
}

function sectionMeta(key) {
  return SECTION_ORDER.find((s) => s.key === key) || { key, name: key, color: "#6B7280" };
}

function catColor(key) {
  const meta = sectionMeta(key);
  return { bg: `${meta.color}18`, text: meta.color, label: meta.name };
}

/* ── Helpers ─────────────────────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function groupBySection(posts) {
  const map = new Map();
  SECTION_ORDER.forEach((s) => map.set(s.key, { key: s.key, name: s.name, posts: [] }));
  for (const post of posts) {
    const key = sectionFor(post);
    map.get(key).posts.push(post);
  }
  // Return in SECTION_ORDER, skipping empty sections.
  return SECTION_ORDER
    .map((s) => map.get(s.key))
    .filter((g) => g.posts.length > 0);
}

/* ── CSS ─────────────────────────────────────────────────────────── */
const STYLES = `
  .ap-row { display:flex; align-items:flex-start; gap:14px; padding:14px 18px; background:#fff; border:1px solid rgba(13,13,13,0.07); border-radius:10px; text-decoration:none; color:inherit; transition:all 0.2s; }
  .ap-row:hover { transform:translateX(4px); box-shadow:0 4px 20px rgba(0,0,0,0.05); border-color:rgba(13,13,13,0.14); }
  .ap-pill { display:inline-block; font-size:10px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; padding:3px 9px; border-radius:20px; }
  .ap-search { width:100%; padding:10px 16px; border:1px solid rgba(13,13,13,0.12); border-radius:8px; font-size:14px; outline:none; background:#fff; transition:border-color 0.2s; }
  .ap-search:focus { border-color:var(--gold); box-shadow:0 0 0 3px color-mix(in srgb, var(--gold) 10%, transparent); }
  .ap-layout { display:grid; grid-template-columns: 240px 1fr; gap:40px; align-items:start; max-width:1180px; margin:0 auto; padding:24px 1.5rem 80px; }
  .ap-sidebar { position:sticky; top:80px; max-height:calc(100vh - 100px); overflow-y:auto; padding:4px 4px 4px 0; }
  .ap-sidebar-title { font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-muted); margin-bottom:12px; padding:0 4px; }
  .ap-sidebar-list { display:flex; flex-direction:column; gap:4px; }
  .ap-cat-item { display:flex; align-items:center; justify-content:space-between; gap:8px; width:100%; padding:8px 12px; border-radius:8px; border:1px solid transparent; background:transparent; cursor:pointer; font-size:13.5px; font-weight:500; color:var(--charcoal); text-align:left; transition:all 0.15s; font-family:inherit; }
  .ap-cat-item:hover { background:rgba(13,13,13,0.04); }
  .ap-cat-item.active { background:color-mix(in srgb, var(--accent, var(--gold)) 8%, transparent); border-color:color-mix(in srgb, var(--accent, var(--gold)) 30%, transparent); color:var(--accent, var(--gold)); font-weight:600; }
  .ap-cat-count { font-size:11px; font-weight:600; color:var(--text-muted); padding:2px 8px; border-radius:10px; background:rgba(13,13,13,0.06); }
  .ap-cat-item.active .ap-cat-count { background:color-mix(in srgb, var(--accent, var(--gold)) 14%, transparent); color:var(--accent, var(--gold)); }
  @media(max-width:900px){
    .ap-layout { grid-template-columns: 1fr; gap:20px; }
    .ap-sidebar { position:static; max-height:none; order:2; padding:0; }
  }
  @media(max-width:640px){ .ap-row { flex-direction:column; gap:8px; } }
`;

/* ── Article row ─────────────────────────────────────────────────── */
function PostRow({ post }) {
  // Use the section the post falls into for the accent colour + the
  // big pill, so the row's identity matches the section header above.
  const sectionKey = sectionFor(post);
  const cc         = catColor(sectionKey);
  const sectionName = sectionMeta(sectionKey).name;

  // Secondary tag chips: skip the section tags themselves (they're
  // already represented by the section header + the big pill), then
  // sort alphabetically.
  const SECTION_SLUGS = new Set(SECTION_ORDER.map((s) => s.key));
  const allTags = (post.tags || [])
    .filter((t) => !SECTION_SLUGS.has(t.slug))
    .sort((a, b) => (a.name || "").localeCompare(b.name || "", "en", { sensitivity: "base" }))
    .slice(0, 4);

  return (
    <MotionCard as="a" href={`/insights/${post.slug}`} className="ap-row" lift={-2}>
      {/* number / accent strip */}
      <div style={{ width: 3, alignSelf: "stretch", borderRadius: 4, background: cc.text, flexShrink: 0, minHeight: 40 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* title */}
        <div style={{ ...playfair, fontSize: 15, lineHeight: 1.35, color: "var(--charcoal)", marginBottom: 6 }}>
          {post.title}
        </div>

        {/* meta row */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          {/* primary section pill */}
          <span className="ap-pill" style={{ background: cc.bg, color: cc.text }}>{sectionName}</span>

          {/* secondary tags */}
          {allTags.map(t => (
            <span key={t.id} className="ap-pill" style={{ background: "rgba(13,13,13,0.05)", color: "var(--text-muted)" }}>
              {t.name}
            </span>
          ))}

          {/* date + reading time */}
          <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: "auto" }}>
            {formatDate(post.published_at)}{post.reading_time ? ` · ${post.reading_time} min` : ""}
          </span>
        </div>

        {/* excerpt */}
        {post.custom_excerpt && (
          <div style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.55, marginTop: 6 }}>
            {post.custom_excerpt.slice(0, 130)}{post.custom_excerpt.length > 130 ? "…" : ""}
          </div>
        )}
      </div>

      <span style={{ fontSize: 16, color: cc.text, flexShrink: 0, marginTop: 2 }}>→</span>
    </MotionCard>
  );
}

/* ── Category section ────────────────────────────────────────────── */
function CategorySection({ group }) {
  const cc = catColor(group.key);
  return (
    <Fade as="section" id={`cat-${group.key}`} style={{ marginBottom: 40 }}>
      {/* category header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 10, borderBottom: `2px solid ${cc.text}22` }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: cc.text, flexShrink: 0 }} />
        <h2 style={{ ...playfair, fontSize: 20, margin: 0, color: "var(--charcoal)" }}>{group.name}</h2>
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, marginLeft: 4 }}>
          {group.posts.length} {group.posts.length === 1 ? "article" : "articles"}
        </span>
      </div>
      <Stagger style={{ display: "flex", flexDirection: "column", gap: 8 }} stagger={0.12} delayChildren={0.08}>
        {group.posts.map((p, i) => (
          <StaggerItem key={p.id}>
            <PostRow post={p} />
          </StaggerItem>
        ))}
      </Stagger>
    </Fade>
  );
}

/* ── Main ────────────────────────────────────────────────────────── */
export default function AllPostsClient({ posts = [], usingFallback = false }) {
  const [query, setQuery]         = useState("");
  const [activeFilter, setFilter] = useState("all");
  const searchRef                 = useRef(null);

  // Posts grouped by section, in the specified section order.
  const categories = useMemo(() => groupBySection(posts), [posts]);

  // filtered + searched posts
  const filteredGroups = useMemo(() => {
    const q = query.toLowerCase().trim();
    return categories
      .map(group => {
        let ps = group.posts;
        if (activeFilter !== "all") ps = ps.filter(p => sectionFor(p) === activeFilter);
        if (q) ps = ps.filter(p =>
          p.title?.toLowerCase().includes(q) ||
          p.custom_excerpt?.toLowerCase().includes(q) ||
          p.plaintext?.toLowerCase().includes(q) ||
          p.tags?.some(t => t.name.toLowerCase().includes(q))
        );
        return { ...group, posts: ps };
      })
      .filter(g => g.posts.length > 0);
  }, [categories, query, activeFilter]);

  const totalShown = filteredGroups.reduce((n, g) => n + g.posts.length, 0);

  // keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--charcoal)", background: "var(--warm-white)", minHeight: "100vh" }}>
      <style>{STYLES}</style>
      <Nav />

      {/* ── Header ── */}
      <header style={{ background: "linear-gradient(165deg, var(--navy) 0%, var(--navy-light) 100%)", paddingTop: 110, paddingBottom: 56 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem" }}>
          <Reveal delay={0.1}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#14B8A6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Content Library
          </div>
          </Reveal>
          <Reveal delay={0.2}>
          <h1 style={{ ...playfair, fontSize: "clamp(28px,4vw,44px)", color: "#fff", margin: "0 0 12px", lineHeight: 1.2 }}>
            All Posts &amp; Articles
          </h1>
          </Reveal>
          <Reveal delay={0.3}>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", margin: "0 0 28px" }}>
            {posts.length} articles across {categories.length} categories — your complete content library
          </p>
          </Reveal>

          {/* stats pills */}
          <Stagger style={{ display: "flex", flexWrap: "wrap", gap: 10 }} stagger={0.1} delayChildren={0.08}>
            {categories.slice(0, 6).map(g => {
              const cc = catColor(g.key);
              return (
                <StaggerItem key={g.key}>
                <span style={{ fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 20, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  {g.name} · {g.posts.length}
                </span>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </header>

      <main id="main" className="ap-layout">

        {usingFallback && (
          <div
            style={{
              gridColumn: "1 / -1",
              background: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 13,
              color: "#92400E",
              marginBottom: 4,
            }}
          >
            Showing sample articles — connect Ghost CMS to load live content. Copy{" "}
            <code style={{ fontSize: 12, background: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 4 }}>
              env.local.example
            </code>{" "}
            to <code style={{ fontSize: 12, background: "rgba(0,0,0,0.06)", padding: "1px 5px", borderRadius: 4 }}>.env.local</code>{" "}
            and add your <strong>GHOST_KEY</strong>.
          </div>
        )}

        {/* ── Sidebar: category filters (LEFT) ── */}
        <aside className="ap-sidebar" aria-label="Category filters">
          <div className="ap-sidebar-title">Categories</div>
          <div className="ap-sidebar-list">
            <button
              className={`ap-cat-item${activeFilter === "all" ? " active" : ""}`}
              style={{ "--accent": "#14B8A6" }}
              onClick={() => setFilter("all")}
            >
              <span>All</span>
              <span className="ap-cat-count">{posts.length}</span>
            </button>
            {categories.map(g => {
              const cc = catColor(g.key);
              const isActive = activeFilter === g.key;
              return (
                <button
                  key={g.key}
                  className={`ap-cat-item${isActive ? " active" : ""}`}
                  style={{ "--accent": cc.text }}
                  onClick={() => setFilter(isActive ? "all" : g.key)}
                >
                  <span>{g.name}</span>
                  <span className="ap-cat-count">{g.posts.length}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Main column: search + results ── */}
        <div>
          {/* Sticky search bar */}
          <div style={{ position: "sticky", top: 64, zIndex: 40, background: "var(--warm-white)", paddingTop: 12, paddingBottom: 14, marginBottom: 20, borderBottom: "1px solid var(--border)" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "var(--text-muted)", pointerEvents: "none" }}>🔍</span>
              <input
                ref={searchRef}
                className="ap-search"
                style={{ paddingLeft: 36 }}
                type="search"
                placeholder='Search by title, tag, or keyword… (press "/" to focus)'
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label="Search articles"
              />
              {query && (
                <button onClick={() => setQuery("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--text-muted)" }}>✕</button>
              )}
            </div>
          </div>

          {/* Results count */}
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
            {query || activeFilter !== "all"
              ? `Showing ${totalShown} of ${posts.length} articles`
              : `${posts.length} articles in ${categories.length} categories`}
          </div>

          {/* Content */}
          {filteredGroups.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              {query || activeFilter !== "all" ? (
                <>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>No articles match &ldquo;{query}&rdquo;</div>
                  <div style={{ fontSize: 14, marginTop: 6 }}>Try a different keyword or clear the search</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>No articles yet</div>
                  <div style={{ fontSize: 14, marginTop: 6 }}>
                    Publish posts in Ghost CMS or configure <code>.env.local</code> with your Content API key.
                  </div>
                </>
              )}
            </div>
          ) : (
            filteredGroups.map(group => <CategorySection key={group.key} group={group} />)
          )}

          {/* Back to top */}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{ fontSize: 13, color: "var(--text-muted)", background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 18px", cursor: "pointer", transition: "all 0.2s" }}
            >
              ↑ Back to top
            </button>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
