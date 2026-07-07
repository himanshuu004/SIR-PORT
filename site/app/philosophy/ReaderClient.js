"use client";
import { useState, useEffect, useRef } from "react";
import Nav from "../../components/Nav";
import BottomSection from "../../components/BottomSection";
import HeroBackground from "../../components/HeroBackground";
import { T, playfair, eyebrowSt, containerStyle } from "../../lib/theme";

/* ── Dynamic CSS (accent colour injected) ────────────────────────── */
function buildStyles(C) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600&family=Kalam:wght@400;700&display=swap');

    .rc-chapter-card {
      border-radius:20px; overflow:hidden; background:#fff;
      border:1px solid rgba(13,13,13,0.07); cursor:pointer;
      transition:all 0.35s cubic-bezier(.22,1,.36,1);
      position:relative; display:block; color:inherit; text-decoration:none;
    }
    .rc-chapter-card:hover {
      transform:translateY(-7px);
      box-shadow:0 24px 64px rgba(0,0,0,0.13), 0 0 0 1px ${C}40;
      border-color:${C}50;
    }
    .rc-chapter-card:hover .ch-arrow { transform:translateX(5px); }
    .rc-chapter-card:hover .ch-img-overlay { opacity:0.5; }
    .ch-arrow { transition:transform 0.25s; display:inline-block; }
    .ch-img-overlay { transition:opacity 0.35s; opacity:0.35; }

    .rc-verse-row {
      display:flex; align-items:flex-start; gap:14px;
      padding:18px 22px; background:#fff;
      border:1px solid rgba(13,13,13,0.07); border-radius:14px;
      cursor:pointer; transition:all 0.22s; color:inherit; position:relative;
    }
    .rc-verse-row:hover {
      transform:translateX(4px);
      box-shadow:0 6px 24px rgba(0,0,0,0.07);
      border-color:${C}30;
    }
    .rc-verse-row.unavailable { opacity:0.45; cursor:not-allowed; }
    .rc-verse-row.unavailable:hover { transform:none; box-shadow:none; }

    .sanskrit-text { font-family:'Kalam','Noto Sans Devanagari',serif; }

    .rc-back {
      display:inline-flex; align-items:center; gap:6px;
      font-size:13px; font-weight:600; color:${C};
      background:${C}12; border:1px solid ${C}22; border-radius:20px;
      padding:6px 16px; cursor:pointer; transition:all 0.2s;
      text-decoration:none;
    }
    .rc-back:hover { background:${C}20; transform:translateX(-2px); }

    .rc-pill {
      display:inline-block; font-size:10px; font-weight:700;
      letter-spacing:0.07em; text-transform:uppercase;
      padding:3px 10px; border-radius:20px;
      background:${C}10; color:${C};
    }

    .rc-nav-btn {
      display:inline-flex; align-items:center; gap:6px;
      font-size:13px; font-weight:700; color:#fff;
      background:${C}; border-radius:20px; padding:9px 20px;
      cursor:pointer; border:none; transition:all 0.2s; text-decoration:none;
    }
    .rc-nav-btn:hover { opacity:0.85; transform:translateY(-1px); }
    .rc-nav-btn:disabled { opacity:0.25; cursor:not-allowed; transform:none; }

    .rc-wm-toggle {
      display:flex; align-items:center; gap:6px;
      font-size:13px; font-weight:600; cursor:pointer;
      color:${C}; background:none; border:none; padding:0;
      transition:opacity 0.2s;
    }
    .rc-wm-toggle:hover { opacity:0.7; }

    .rc-breadcrumb a { color:rgba(255,255,255,0.45); text-decoration:none; transition:color 0.2s; }
    .rc-breadcrumb a:hover { color:rgba(255,255,255,0.8); }
    .rc-breadcrumb span { color:rgba(255,255,255,0.22); }

    .fade-view { animation:rcFadeUp 0.45s cubic-bezier(.22,1,.36,1) both; }
    @keyframes rcFadeUp {
      from { opacity:0; transform:translateY(14px); }
      to   { opacity:1; transform:translateY(0); }
    }

    .stagger-grid > * { animation:rcFadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
    .stagger-grid > *:nth-child(1){animation-delay:0.04s}
    .stagger-grid > *:nth-child(2){animation-delay:0.09s}
    .stagger-grid > *:nth-child(3){animation-delay:0.14s}
    .stagger-grid > *:nth-child(4){animation-delay:0.19s}
    .stagger-grid > *:nth-child(5){animation-delay:0.24s}
    .stagger-grid > *:nth-child(6){animation-delay:0.29s}
    .stagger-grid > *:nth-child(7){animation-delay:0.34s}
    .stagger-grid > *:nth-child(8){animation-delay:0.39s}
    .stagger-grid > *:nth-child(9){animation-delay:0.44s}
    .stagger-grid > *:nth-child(10){animation-delay:0.49s}
    .stagger-grid > *:nth-child(n+11){animation-delay:0.54s}

    .stagger-list > * { animation:rcFadeUp 0.4s cubic-bezier(.22,1,.36,1) both; }
    .stagger-list > *:nth-child(1){animation-delay:0.03s}
    .stagger-list > *:nth-child(2){animation-delay:0.07s}
    .stagger-list > *:nth-child(3){animation-delay:0.11s}
    .stagger-list > *:nth-child(4){animation-delay:0.15s}
    .stagger-list > *:nth-child(5){animation-delay:0.19s}
    .stagger-list > *:nth-child(6){animation-delay:0.23s}
    .stagger-list > *:nth-child(7){animation-delay:0.27s}
    .stagger-list > *:nth-child(8){animation-delay:0.31s}
    .stagger-list > *:nth-child(9){animation-delay:0.35s}
    .stagger-list > *:nth-child(10){animation-delay:0.39s}
    .stagger-list > *:nth-child(n+11){animation-delay:0.43s}

    .wm-expand {
      overflow:hidden;
      transition:max-height 0.4s cubic-bezier(.22,1,.36,1), opacity 0.3s ease;
    }

    .rc-progress-bar {
      position:fixed; top:0; left:0; height:3px;
      background:${C}; z-index:200;
      transition:width 0.3s ease;
    }

    .rc-footer-nav {
      position:sticky; bottom:0; background:rgba(255,255,255,0.95);
      backdrop-filter:blur(12px); border-top:1px solid rgba(13,13,13,0.07);
      padding:14px 24px; z-index:50;
      display:flex; align-items:center; justify-content:space-between; gap:12px;
    }

    @media(max-width:900px){
      .chapter-grid-3{ grid-template-columns:repeat(2,minmax(0,1fr)) !important; gap:14px !important; }
    }
    @media(max-width:560px){
      .chapter-grid-3{ grid-template-columns:repeat(2,minmax(0,1fr)) !important; gap:10px !important; }
      .rc-chapter-card h3{ font-size:14px !important; }
      .rc-chapter-card .rc-pill{ font-size:10px !important; }
      .rc-chapter-card > div:first-child{ height:110px !important; }
      .rc-chapter-card > div:last-child{ padding:12px 14px 14px !important; }
      .rc-footer-nav{ padding:10px 16px; }
    }
  `;
}

/* ── Hero banner (morphs with view) ─────────────────────────────── */
function Hero({ data, view, chapter, entry, COLOR, onBack, onBackToChapters }) {
  const isChapters = view === "chapters";
  const isVerses   = view === "verses";
  const isDetail   = view === "detail";

  return (
    <header style={{
      position: "relative", overflow: "hidden",
      paddingTop: 110, paddingBottom: 60,
    }}>
      <HeroBackground page="philosophy" />
      {/* dot grid */}
      <div style={{ position:"absolute", inset:0, opacity:0.03,
        backgroundImage:`radial-gradient(circle,${COLOR}cc 1px,transparent 1px)`,
        backgroundSize:"44px 44px" }} />
      {/* glow */}
      <div style={{ position:"absolute", top:"20%", right:"8%",
        width:350, height:350, borderRadius:"50%",
        background:`radial-gradient(circle,${COLOR}22 0%,transparent 70%)`,
        pointerEvents:"none" }} />

      <div style={{ maxWidth:900, margin:"0 auto", padding:"0 1.5rem",
        position:"relative", zIndex:1 }}>

        {/* breadcrumb */}
        <div className="rc-breadcrumb fade-view" style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, marginBottom:16 }}>
          <a href="/">Home</a><span>›</span>
          <a href="/philosophy">Philosophy</a><span>›</span>
          {isChapters ? (
            <span style={{ color:"rgba(255,255,255,0.75)", fontWeight:600 }}>{data.bookTitle}</span>
          ) : (
            <>
              <a href="#" onClick={e=>{e.preventDefault();onBackToChapters()}}>{data.bookTitle}</a>
              <span>›</span>
              {isVerses && (
                <span style={{ color:"rgba(255,255,255,0.75)", fontWeight:600 }}>
                  {data.chapterLabel} {chapter?.num}: {chapter?.name}
                </span>
              )}
              {isDetail && (
                <>
                  <a href="#" onClick={e=>{e.preventDefault();onBack();}}>
                    {data.chapterLabel} {chapter?.num}
                  </a>
                  <span>›</span>
                  <span style={{ color:"rgba(255,255,255,0.75)", fontWeight:600 }}>
                    {data.entryLabel} {entry?.label}
                  </span>
                </>
              )}
            </>
          )}
        </div>

        {/* icon + eyebrow */}
        <div className="fade-view" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <span style={{ fontSize:28 }}>{data.icon}</span>
          <span style={{ ...eyebrowSt, color:COLOR }}>
            {data.chapterLabel === "Pada" ? "Yoga Sutras" : "Sacred Texts"} · Interactive Reader
          </span>
        </div>

        {/* title */}
        <h1 className="fade-view" style={{ ...playfair, fontSize:"clamp(28px,3.8vw,46px)", color:"#fff",
          lineHeight:1.2, letterSpacing:"-0.02em", margin:"0 0 14px" }}>
          {isChapters && <>{data.bookTitle}</>}
          {isVerses && <>
            {data.chapterLabel} {chapter?.num}:{" "}
            <em style={{ color:COLOR, fontStyle:"italic" }}>{chapter?.name}</em>
          </>}
          {isDetail && <>
            {data.entryLabel}{" "}
            <em style={{ color:COLOR, fontStyle:"italic" }}>{entry?.label}</em>
          </>}
        </h1>

        {/* sub */}
        <p className="fade-view" style={{ fontSize:16, color:"rgba(255,255,255,0.5)",
          lineHeight:1.65, margin:"0 0 20px", maxWidth:620 }}>
          {isChapters && data.description}
          {isVerses && `${chapter?.totalEntries} ${data.entryLabel}s — click any ${data.entryLabel.toLowerCase()} to read the Sanskrit, transliteration, and commentary`}
          {isDetail && <span className="sanskrit-text" style={{ fontSize:17, color:"rgba(255,255,255,0.65)" }}>
            {entry?.sanskrit?.split("\n")[0]}
          </span>}
        </p>

        {/* back button */}
        {!isChapters && (
          <div className="fade-view">
            <button className="rc-back" onClick={onBack}>
              ← {isVerses ? `All ${data.chapterLabel}s` : `${data.chapterLabel} ${chapter?.num}`}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

/* ── Chapter Grid (Level 1) ─────────────────────────────────────── */
function ChapterGrid({ data, COLOR, onSelect }) {
  const cols = data.chapters.length <= 4 ? data.chapters.length : 3;
  return (
    <section style={{ background:T.warmWhite, padding:"64px max(1.5rem,calc((100% - 1160px)/2))" }}>
      <div style={containerStyle}>
        <div
          className={`stagger-grid chapter-grid-3`}
          style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:24 }}
        >
          {data.chapters.map((ch, idx) => (
            <ChapterCard key={ch.num} chapter={ch} idx={idx} COLOR={COLOR}
              chapterLabel={data.chapterLabel} entryLabel={data.entryLabel}
              onClick={() => onSelect(idx)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ChapterCard({ chapter, idx, COLOR, chapterLabel, entryLabel, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="rc-chapter-card" onClick={onClick} tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick()}
      role="button" aria-label={`Open ${chapterLabel} ${chapter.num}: ${chapter.name}`}>

      {/* image / gradient header */}
      <div style={{ height:160, position:"relative", overflow:"hidden",
        background:`linear-gradient(140deg,${COLOR}30,${COLOR}10)` }}>
        {chapter.image && !imgErr ? (
          <img src={chapter.image} alt={chapter.name}
            onError={() => setImgErr(true)}
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
        ) : (
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
            justifyContent:"center",
            background:`linear-gradient(145deg,${COLOR}25 0%,${COLOR}0a 100%)` }}>
            <span style={{ fontSize:56, opacity:0.4 }}>{chapterLabel === "Pada" ? "🧘" : "🪷"}</span>
          </div>
        )}
        {/* always-present overlay + number badge */}
        <div className="ch-img-overlay" style={{ position:"absolute", inset:0,
          background:`linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55))` }} />
        <div style={{ position:"absolute", bottom:12, left:14, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.08em",
            textTransform:"uppercase", color:"rgba(255,255,255,0.9)",
            background:"rgba(0,0,0,0.35)", backdropFilter:"blur(6px)",
            padding:"3px 10px", borderRadius:20 }}>
            {chapterLabel} {chapter.num}
          </span>
        </div>
      </div>

      {/* body */}
      <div style={{ padding:"20px 22px 22px" }}>
        <h3 style={{ ...playfair, fontSize:18, margin:"0 0 6px", color:T.charcoal,
          lineHeight:1.3 }}>{chapter.name}</h3>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span className="rc-pill">{chapter.totalEntries} {entryLabel}s</span>
          <span className="ch-arrow" style={{ fontSize:16, color:COLOR }}>→</span>
        </div>
      </div>
    </div>
  );
}

/* ── Verse List (Level 2) ───────────────────────────────────────── */
function VerseList({ chapter, data, COLOR, onSelect }) {
  return (
    <section style={{ background:T.warmWhite, padding:"56px max(1.5rem,calc((100% - 900px)/2))" }}>
      <div style={{ maxWidth:900, margin:"0 auto", padding:"0 1.5rem" }}>

        {/* chapter meta */}
        <div className="fade-view" style={{ display:"flex", alignItems:"center", gap:10,
          marginBottom:32, padding:"16px 20px",
          background:"#fff", borderRadius:14, border:`1px solid ${COLOR}20` }}>
          <div style={{ width:44, height:44, borderRadius:12, display:"flex", alignItems:"center",
            justifyContent:"center", background:`${COLOR}15`, fontSize:22 }}>
            {data.chapterLabel === "Pada" ? "🧘" : "🪷"}
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
              letterSpacing:"0.07em", color:COLOR, marginBottom:2 }}>
              {data.chapterLabel} {chapter.num}
            </div>
            <div style={{ ...playfair, fontSize:20, color:T.charcoal }}>{chapter.name}</div>
          </div>
          <div style={{ marginLeft:"auto", textAlign:"right" }}>
            <span className="rc-pill">{chapter.totalEntries} {data.entryLabel}s</span>
          </div>
        </div>

        {/* list */}
        <div className="stagger-list" style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {chapter.entries.map((entry, idx) => (
            <VerseRow key={entry.label} entry={entry} idx={idx} COLOR={COLOR}
              entryLabel={data.entryLabel}
              onClick={() => entry.available !== false && onSelect(idx)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VerseRow({ entry, idx, COLOR, entryLabel, onClick }) {
  const unavailable = entry.available === false;
  const sanskritPreview = entry.sanskrit
    ? entry.sanskrit.replace(/\n/g, " ").slice(0, 80) + (entry.sanskrit.length > 80 ? "…" : "")
    : "";
  const commentPreview = entry.commentary
    ? entry.commentary.slice(0, 110) + (entry.commentary.length > 110 ? "…" : "")
    : "";
  return (
    <div className={`rc-verse-row${unavailable ? " unavailable" : ""}`}
      onClick={onClick} tabIndex={unavailable ? -1 : 0}
      onKeyDown={e => !unavailable && e.key === "Enter" && onClick()}
      role="button" aria-label={`${entryLabel} ${entry.label}`}>
      {/* accent bar */}
      <div style={{ width:3, borderRadius:4, background:COLOR,
        alignSelf:"stretch", flexShrink:0, minHeight:40,
        opacity: unavailable ? 0.3 : 1 }} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
          <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.07em",
            textTransform:"uppercase", color:COLOR, flexShrink:0 }}>
            {entryLabel} {entry.label}
          </span>
          {unavailable && (
            <span style={{ fontSize:10, fontWeight:600, background:"#f3f4f6",
              color:"#6b7280", padding:"2px 8px", borderRadius:10,
              letterSpacing:"0.06em", textTransform:"uppercase" }}>
              Coming Soon
            </span>
          )}
        </div>
        {sanskritPreview && (
          <div className="sanskrit-text" style={{ fontSize:13, color:T.charcoal,
            lineHeight:1.6, marginBottom:4 }}>
            {sanskritPreview}
          </div>
        )}
        {commentPreview && (
          <div style={{ fontSize:12, color:T.textMuted, lineHeight:1.55 }}>
            {commentPreview}
          </div>
        )}
      </div>
      {!unavailable && (
        <span style={{ fontSize:15, color:COLOR, flexShrink:0, alignSelf:"center" }}>→</span>
      )}
    </div>
  );
}

/* ── Verse Detail (Level 3) ─────────────────────────────────────── */
function VerseDetail({ chapter, entry, data, COLOR, allEntries, entryIdx, onNav }) {
  const [wmOpen, setWmOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const prevIdx = entryIdx > 0 ? entryIdx - 1 : null;
  const nextIdx = entryIdx < allEntries.length - 1 ? entryIdx + 1 : null;

  // skip unavailable for prev/next
  const prevAvailIdx = (() => {
    for (let i = entryIdx - 1; i >= 0; i--)
      if (allEntries[i].available !== false) return i;
    return null;
  })();
  const nextAvailIdx = (() => {
    for (let i = entryIdx + 1; i < allEntries.length; i++)
      if (allEntries[i].available !== false) return i;
    return null;
  })();

  useEffect(() => {
    setWmOpen(false);
    const onScroll = () => {
      const el = document.documentElement;
      const pct = Math.min(100, (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
      setScrollPct(pct);
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [entry]);

  const hasWordMeanings = entry.wordMeanings && entry.wordMeanings.trim().length > 0;

  return (
    <>
      {/* reading progress bar */}
      <div className="rc-progress-bar" style={{ width:`${scrollPct}%` }} />

      <section className="fade-view" style={{
        background:T.warmWhite,
        padding:"56px max(1.5rem,calc((100% - 820px)/2)) 140px" }}>
        <div style={{ maxWidth:820, margin:"0 auto", padding:"0 1.5rem" }}>

          {/* eyebrow */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24 }}>
            <span className="rc-pill">
              {data.chapterLabel} {chapter.num} · {data.entryLabel} {entry.label}
            </span>
            {entry.available === false && (
              <span style={{ fontSize:10, fontWeight:600, background:"#f3f4f6",
                color:"#6b7280", padding:"2px 8px", borderRadius:10,
                letterSpacing:"0.06em", textTransform:"uppercase" }}>
                Coming Soon
              </span>
            )}
          </div>

          {/* Sanskrit */}
          <div style={{ background:"#fff", border:`1px solid ${COLOR}25`,
            borderLeft:`4px solid ${COLOR}`, borderRadius:"0 16px 16px 0",
            padding:"28px 32px", marginBottom:28 }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
              letterSpacing:"0.08em", color:COLOR, marginBottom:12 }}>
              Sanskrit
            </div>
            <div className="sanskrit-text" style={{ fontSize:15, lineHeight:1.95,
              color:T.charcoal, whiteSpace:"pre-line" }}>
              {entry.sanskrit}
            </div>
          </div>

          {/* Transliteration */}
          {entry.transliteration && entry.transliteration.trim() && (
            <div style={{ background:"#fff", border:"1px solid rgba(13,13,13,0.07)",
              borderRadius:16, padding:"22px 28px", marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
                letterSpacing:"0.08em", color:T.textMuted, marginBottom:10 }}>
                Transliteration (IAST)
              </div>
              <div style={{ fontSize:16, fontStyle:"italic", color:T.textBody,
                lineHeight:1.85, whiteSpace:"pre-line" }}>
                {entry.transliteration}
              </div>
            </div>
          )}

          {/* Word Meanings (collapsible) */}
          {hasWordMeanings && (
            <div style={{ background:"#fff", border:"1px solid rgba(13,13,13,0.07)",
              borderRadius:16, marginBottom:20, overflow:"hidden" }}>
              <button className="rc-wm-toggle"
                style={{ width:"100%", justifyContent:"space-between",
                  padding:"16px 28px", display:"flex" }}
                onClick={() => setWmOpen(o => !o)}>
                <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:16 }}>📖</span>
                  Word Meanings
                </span>
                <span style={{ fontSize:18, transition:"transform 0.3s",
                  transform: wmOpen ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
              </button>
              <div className="wm-expand"
                style={{ maxHeight: wmOpen ? "600px" : "0", opacity: wmOpen ? 1 : 0 }}>
                <div style={{ padding:"0 28px 20px", fontSize:14, color:T.textBody,
                  lineHeight:1.8, borderTop:"1px solid rgba(13,13,13,0.06)" }}>
                  <div style={{ paddingTop:16 }}>
                    {entry.wordMeanings.split(";").map((wm, i) => {
                      const [term, ...def] = wm.split("—");
                      return (
                        <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
                          {def.length > 0 ? (
                            <>
                              <span style={{ fontStyle:"italic", color:COLOR,
                                flexShrink:0, minWidth:120 }}>{term?.trim()}</span>
                              <span>—</span>
                              <span style={{ color:T.textBody }}>{def.join("—").trim()}</span>
                            </>
                          ) : (
                            <span style={{ color:T.textBody }}>{wm.trim()}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Commentary */}
          <div style={{ background:"#fff", border:"1px solid rgba(13,13,13,0.07)",
            borderRadius:16, padding:"28px 32px" }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase",
              letterSpacing:"0.08em", color:T.textMuted, marginBottom:16,
              display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:14 }}>💬</span>
              Commentary by Dr. B.V.R.C. Purushottam IAS
            </div>
            <div style={{ fontSize:18, color:T.textBody, lineHeight:1.95,
              fontWeight:400, whiteSpace:"pre-line" }}>
              {entry.commentary}
            </div>
          </div>

        </div>
      </section>

      {/* sticky prev / next */}
      <div className="rc-footer-nav">
        <button className="rc-nav-btn"
          disabled={prevAvailIdx === null}
          onClick={() => prevAvailIdx !== null && onNav(prevAvailIdx)}
          style={{ background: prevAvailIdx !== null ? COLOR : "#e5e7eb",
            color: prevAvailIdx !== null ? "#fff" : "#9ca3af" }}>
          ← Prev
        </button>

        <div style={{ fontSize:13, color:T.textMuted, fontWeight:500, textAlign:"center" }}>
          {data.entryLabel} {entry.label} of {allEntries.length}
        </div>

        <button className="rc-nav-btn"
          disabled={nextAvailIdx === null}
          onClick={() => nextAvailIdx !== null && onNav(nextAvailIdx)}
          style={{ background: nextAvailIdx !== null ? COLOR : "#e5e7eb",
            color: nextAvailIdx !== null ? "#fff" : "#9ca3af" }}>
          Next →
        </button>
      </div>
    </>
  );
}

/* ── Main Export ────────────────────────────────────────────────── */
function ReaderLoading({ bookSlug }) {
  const label = bookSlug === "geeta" ? "Bhagavad Gita" : "Patanjali Yoga Sutras";

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: T.charcoal, background: T.warmWhite, minHeight: "100vh" }}>
      <Nav />
      <header style={{ position: "relative", overflow: "hidden", paddingTop: 110, paddingBottom: 60 }}>
        <HeroBackground page="philosophy" />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
          <span style={{ ...eyebrowSt, color: "#8B5CF6" }}>Sacred Texts · Interactive Reader</span>
          <h1 style={{ ...playfair, fontSize: "clamp(28px,3.8vw,46px)", color: "#fff", lineHeight: 1.2, margin: "14px 0 0" }}>
            {label}
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", marginTop: 14 }}>Loading commentary…</p>
        </div>
      </header>
    </div>
  );
}

function ReaderShell({ data }) {
  const COLOR = data.color;
  const [view, setView] = useState("chapters");
  const [chapterIdx, setChapterIdx] = useState(null);
  const [entryIdx, setEntryIdx]     = useState(null);

  const chapter = chapterIdx !== null ? data.chapters[chapterIdx] : null;
  const entries = chapter?.entries ?? [];
  const entry   = entryIdx !== null ? entries[entryIdx] : null;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const openChapter = (idx) => { setChapterIdx(idx); setView("verses"); scrollTop(); };
  const openEntry   = (idx) => { setEntryIdx(idx);   setView("detail"); scrollTop(); };

  const goBack = () => {
    if (view === "detail")  { setView("verses"); scrollTop(); }
    else if (view === "verses") { setView("chapters"); scrollTop(); }
  };

  const goToChapters = () => { setView("chapters"); scrollTop(); };

  return (
    <div style={{ fontFamily:"var(--font-sans)",
      color:T.charcoal, background:T.warmWhite, minHeight:"100vh", overflowX:"hidden" }}>
      <style>{buildStyles(COLOR)}</style>

      <Nav />
      <span id="reader-main" />

      <Hero
        data={data} view={view} chapter={chapter} entry={entry} COLOR={COLOR}
        onBack={goBack} onBackToChapters={goToChapters}
      />

      <main>
        {view === "chapters" && (
          <ChapterGrid data={data} COLOR={COLOR} onSelect={openChapter} />
        )}
        {view === "verses" && chapter && (
          <VerseList chapter={chapter} data={data} COLOR={COLOR} onSelect={openEntry} />
        )}
        {view === "detail" && chapter && entry && (
          <VerseDetail
            chapter={chapter} entry={entry} data={data} COLOR={COLOR}
            allEntries={entries} entryIdx={entryIdx}
            onNav={(idx) => { setEntryIdx(idx); scrollTop(); }}
          />
        )}
      </main>

      <BottomSection variant="mind" showNewsletter={view !== "detail"} />
    </div>
  );
}

export default function ReaderClient({ bookSlug }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/sacred-texts/${bookSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [bookSlug]);

  if (error) {
    return (
      <div style={{ fontFamily: "var(--font-sans)", color: T.charcoal, background: T.warmWhite, minHeight: "100vh" }}>
        <Nav />
        <main style={{ maxWidth: 560, margin: "120px auto", padding: "0 1.5rem", textAlign: "center" }}>
          <h1 style={{ ...playfair, fontSize: 28, marginBottom: 12 }}>Unable to load reader</h1>
          <p style={{ color: "#78716C", marginBottom: 20 }}>Please refresh the page or try again in a moment.</p>
          <a href="/philosophy" style={{ color: "#4338CA", fontWeight: 600 }}>← Back to Philosophy</a>
        </main>
      </div>
    );
  }

  if (!data) return <ReaderLoading bookSlug={bookSlug} />;

  return <ReaderShell data={data} />;
}
