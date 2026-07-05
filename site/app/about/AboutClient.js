"use client";
import { useState, useEffect, useRef } from "react";
import Nav from "../../components/Nav";
import BottomSection from "../../components/BottomSection";
import HeroBackground from "../../components/HeroBackground";
import Icon from "../../components/Icon";
import Fade from "../../components/Fade";
import Reveal from "../../components/Reveal";
import SectionHeader from "../../components/SectionHeader";
import { playfair, eyebrowSt, containerStyle, goldGrad, navyGrad } from "../../lib/theme";

/* ================================================================ STATIC DATA ================================================================ */
const SOCIAL_LINKS = [{ label: "𝕏", ariaLabel: "Twitter / X", href: "https://x.com/basava_ias" }, { label: "in", ariaLabel: "LinkedIn", href: "https://linkedin.com/in/basava-purushottam-b862247" }, { label: "f", ariaLabel: "Facebook", href: "https://www.facebook.com/basava.ias" }];

/* ================================================================ CSS ================================================================ */
const STYLES = `
  .nav-link { color: rgba(255,255,255,0.65); border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s; }
  .nav-link:hover, .nav-link:focus-visible { color: var(--gold); }
  .nav-link:focus-visible { outline: 2px solid var(--gold); outline-offset: 4px; border-radius: 2px; }
  .nav-link.active { color: var(--gold); border-bottom-color: var(--gold); }
  .social-icon { width: 26px; height: 26px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-decoration: none; transition: all 0.2s; }
  .social-icon:hover, .social-icon:focus-visible { border-color: rgba(20,184,166,0.25); color: var(--gold); }
  .social-icon:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
  .social-icon-footer { width: 30px; height: 30px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.35); text-decoration: none; transition: all 0.2s; }
  .social-icon-footer:hover, .social-icon-footer:focus-visible { border-color: rgba(20,184,166,0.25); color: var(--gold); }
  .footer-link { display: block; font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; margin-bottom: 8px; transition: color 0.2s; }
  .footer-link:hover, .footer-link:focus-visible { color: var(--gold-light); }
  .card-hover { text-decoration: none; display: block; border: 1px solid var(--border); border-radius: 16px; transition: all 0.3s; color: inherit; }
  .card-hover:hover, .card-hover:focus-visible { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.06); }
  .card-hover:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
  .pill-hover { text-decoration: none; display: inline-block; transition: all 0.2s; }
  .pill-hover:hover, .pill-hover:focus-visible { filter: brightness(1.15); }
  .pill-hover:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
  .subscribe-btn { transition: all 0.2s; }
  .subscribe-btn:hover, .subscribe-btn:focus-visible { transform: translateY(-1px); box-shadow: var(--shadow-gold); }
  .subscribe-btn:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
    .fade-wrapper { opacity: 1 !important; transform: none !important; }
  }
  @media (max-width: 768px) {
    .desktop-nav { display: none !important; }
    .mobile-menu-btn { display: flex !important; }
    .three-col { grid-template-columns: 1fr !important; }
    .two-col { grid-template-columns: 1fr !important; }
    .footer-layout { flex-direction: column !important; }
    .footer-cols { flex-direction: column !important; gap: 24px !important; }
    .newsletter-row { flex-direction: column !important; }
    .newsletter-row input, .newsletter-row button { width: 100% !important; }
  }
  @media (min-width: 769px) { .mobile-menu-btn { display: none !important; } }
  @media (max-width: 1024px) and (min-width: 769px) { .three-col { grid-template-columns: 1fr 1fr !important; } }
`;

/* ================================================================ PAGE-SPECIFIC DATA ================================================================ */

const THREE_FACES = [
  { icon: "landmark",      color: "#D946EF", title: "The Civil Servant",      subtitle: "23 years · 5 Union Ministries · IAS 2004 Batch · 1 State Government (Uttarakhand)", desc: "From district administration to drafting the National Education Policy 2020 — governance at every level, from village panchayats to Parliament.", link: null },
  { icon: "graduationCap", color: "#14B8A6", title: "The Technology Seeker", subtitle: "AI · Data Science · UC Berkeley MPA",                                                desc: "Self-taught in machine learning, learning to build AI tools and AI agents for governance.",                                                                          link: "/mind-and-machine" },
  { icon: "network",       color: "#F59E0B", title: "Systems Thinker",        subtitle: "Bhagavad Gita · Cognitive Science · Patanjali",                                         desc: "Writing at the intersection of Indic philosophy and modern neuroscience. Exploring how ancient frameworks illuminate decision-making, habit, and meaning.",         link: "/philosophy" },
];

const CREDENTIALS = [
  { icon: "🏅", title: "Silver Medal", sub: "Government of India" },
  { icon: "🎓", title: "UC Berkeley", sub: "Goldman School of Public Policy" },
  { icon: "⚡", title: "KVPY Scholar", sub: "Govt. of India Science Fellowship" },
  { icon: "🏛", title: "IPoS, IPS & IAS", sub: "Triple Civil Service Rank" },
];

const BELIEFS = [
  { title: "Data without dharma is dangerous", body: "Technical solutions disconnected from ethical grounding cause harm at scale. Every algorithm I study must pass a dharma test: who does this serve, and who might it harm?" },
  { title: "The field corrects the theory", body: "Years in districts taught me that policy designed purely in offices fails. I return to the field, to the farmer, to the village school — not as metaphor, but as method." },
  { title: "Complexity requires both precision and humility", body: "AI tools are genuinely powerful. They are also genuinely limited. Anyone who claims certainty about AI's social impact hasn't spent enough time in the field." },
  { title: "Thinking in public is a form of accountability", body: "I put my ideas out under my own name, open to being examined and questioned. I use AI extensively in my writing—not to replace thought, but to sharpen it, to give clearer shape and language to what I am trying to say, even while I remain in service. Because ideas, if they are to matter, must withstand scrutiny—and scrutiny is only possible when they are exposed." },
];

// Body-text hyperlink style: uses the darker teal (--link, #0F766E) which
// hits WCAG AA contrast (5.3:1 on white). The lighter --gold #14B8A6 only
// hits 3.1:1 — fine for buttons but fails for small body text.
const inlineLink = {
  color: "#0F766E",
  textDecoration: "underline",
  textDecorationThickness: "1.5px",
  textUnderlineOffset: "3px",
  fontWeight: 600,
};

const UNLIKELY_PATH_PARAS = [
  <>I began my career as a veterinary doctor — trained to heal, to observe, and to serve at the most elemental level of life. It was honest work, and it shaped me. But somewhere along the way, a larger calling took shape.</>,
  <>I stepped into the civil services arena and cleared India&rsquo;s premier Civil Service examination, thrice — the Indian Postal Service (2002), the Indian Police Service (2003), and finally the Indian Administrative Service (2004), securing an All India Rank of 42. It was never about the success of selection; it was about choosing the path that would allow me to create the widest impact, and I chose the Indian Administrative Service.</>,
  <>That choice brought me to Uttarakhand — a young, fragile, and breathtaking Himalayan state still finding its administrative and developmental rhythm. For over a decade, I worked at the grassroots, serving as Sub-Divisional Magistrate, Chief Development Officer, and eventually District Magistrate of Uttarkashi, Udham Singh Nagar, and Dehradun — districts with populations of up to two million. I learned governance not from files, but from lived experience: distributing 2,000 housing plots to families below the poverty line after a decade-long stalemate, enrolling 5,000 beneficiaries under the National Old Age Pension scheme, admitting 3,000 children to private schools under the Right to Education Act in its inception year.</>,
  <>In 2013, when the Kedarnath disaster struck the Himalayas, I was appointed as Relief Commissioner and coordinated the crisis response during the most challenging time of my career. That experience taught me something no textbook could: real governance means being present when everything else fails.</>,
  <>After that, I joined the Government of India and spent more than seven years working across five Union Ministries. I served as Private Secretary to three Union Ministers in the Ministries of Education, Civil Aviation, Tourism, and Parliamentary Affairs, and later as Deputy Secretary and Director. My time in the Ministry of Education was especially meaningful. I helped shape the National Education Policy 2020, a major reform that changed India&rsquo;s education system after 34 years. I also worked on the National Civil Aviation Policy and the National Tourism Policy, which gave me a unique view of how the Executive and Legislature work together.</>,
  <>Looking back, my journey has been less about the titles I&rsquo;ve held and more about taking on greater responsibility, one decision at a time.</>,
  <>Around 2017 and 2018, I felt a quiet but important change. I went to the University of California, Berkeley, for a Master&rsquo;s in Public Affairs, and also spent time at the International Anti-Corruption Academy and as a Chevening Fellow at Oxford&rsquo;s Sa&iuml;d Business School. Berkeley, especially, changed how I saw the world.</>,
  <>There, I discovered data science and behavioural economics, not just as academic fields, but as practical tools. They were sharp, precise, and eye-opening. These tools helped me understand why good policies sometimes fail in real life. For the first time, I could clearly see the gap between what governments plan and what people actually experience.</>,
  <>When I came back, I couldn&rsquo;t see governance the same way anymore. Just running systems wasn&rsquo;t enough. I questioned them, rethought how they were built, and, when needed, rebuilt them to be smarter and more attuned to real life.</>,
  <>That realisation started a new chapter for me. I began teaching myself machine learning, Python, and applied AI, taking it step by step from the basics. I also started writing at{" "}
    <a href="https://basavapurushottam.com" target="_blank" rel="noopener noreferrer" style={inlineLink}>basavapurushottam.com</a>{" "}about the foundations of AI — not just as a new technology, but as a force that can change how we think about governance, decision-making, and society as a whole.</>,
  <>That same curiosity has now taken book form. My forthcoming work, &ldquo;Your Brain Runs on Old Software&rdquo; (<a href="https://upgradeurbrain.com" target="_blank" rel="noopener noreferrer" style={inlineLink}>upgradeurbrain.com</a>), distils 13 principles from modern neuroscience into a new way of looking at life — a quiet argument that most of us are still running mental operating systems designed for a world that no longer exists, and that an upgrade is both possible and overdue.</>,
  <>Today, I serve concurrently as Secretary to the Government of Uttarakhand, holding portfolios across Animal Husbandry, Dairy, Agriculture, and as Chief Electoral Officer of the state under the Election Commission of India. Two roles, two very different rhythms: one rooted in the long, patient work of building rural and agrarian systems; the other in safeguarding the most fundamental act of democracy itself. Together, they continue to teach me that governance is, in the end, an exercise in balancing the everyday and the foundational.</>,
  <>Increasingly, my work is moving toward the intersection of public policy and frontier technology — exploring how AI can transform agricultural credit, predictive crisis management, and rural service delivery in India.</>,
  <>The veterinary student who once learned to listen carefully to creatures who cannot speak still lives somewhere inside the administrator. Perhaps that is why I keep returning, again and again, to the same question: how do we build systems that actually hear the people they are meant to serve?</>,
];

/* ================================================================ PAGE COMPONENTS ================================================================ */

/* 1. THE HOOK */
function TheHook() {
  return (
    <section style={{ padding: "140px max(1.5rem, calc((100% - 1120px)/2)) 100px", position: "relative", overflow: "hidden" }}>
      <HeroBackground page="about" />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)", backgroundSize: "48px 48px" }} />
      <div style={{ maxWidth: 800, position: "relative", zIndex: 1 }}>
        <Reveal delay={0.1}><span style={{ ...eyebrowSt, letterSpacing: "0.12em", display: "block", marginBottom: 20 }}>About</span></Reveal>
        <Reveal delay={0.2}>
        <h1 style={{ ...playfair, fontSize: "clamp(32px, 4vw, 52px)", color: "#fff", lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 28px" }}>
          A civil servant <em style={{ color: "#14B8A6", fontStyle: "italic" }}>learning</em> to code.<br />A thinker <em style={{ color: "#14B8A6", fontStyle: "italic" }}>shaping</em> governance.
        </h1>
        </Reveal>
        <Reveal delay={0.35}>
        <p style={{ fontSize: 18, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", maxWidth: 620, margin: 0 }}>
          A veterinarian by training, an IAS officer <span style={{ color: "#14B8A6" }}>by choice</span>, and an AI practitioner by obsession. 23 years inside India's most complex institutions — now trying to understand, and build, what comes next.
        </p>
        </Reveal>
      </div>
    </section>
  );
}

/* 2. THE UNLIKELY PATH */
function TheUnlikelyPath() {
  return (
    <section style={{ background: "#FAFAF8", padding: "100px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {UNLIKELY_PATH_PARAS.map((para, i) => (
          <Fade key={i} delay={Math.min(i * 0.04, 0.24)}>
            <p style={{ fontSize: 17, lineHeight: 1.9, color: "#44403C", margin: "0 0 28px" }}>{para}</p>
          </Fade>
        ))}
      </div>
    </section>
  );
}

/* 3. THREE FACES */
function ThreeFaces() {
  return (
    <section style={{ background: "#FAFAF8", padding: "100px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrow="Three Identities" heading="One person, three lenses" align="center" /></Fade>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {THREE_FACES.map((face, i) => {
            const cardStyle = {
              padding: "32px 28px",
              borderRadius: 16,
              borderTop: `4px solid ${face.color}`,
              background: `linear-gradient(180deg, ${face.color}10 0%, #ffffff 65%)`,
              boxShadow: "var(--shadow-card)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              color: "#1C1917",
              textDecoration: "none",
            };
            const inner = (
              <>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${face.color}1a`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }} aria-hidden="true">
                  <Icon name={face.icon} size={28} color={face.color} strokeWidth={1.9} />
                </div>
                <h3 style={{ ...playfair, fontSize: 20, margin: "0 0 8px", color: "#1C1917", fontWeight: 700 }}>{face.title}</h3>
                <div style={{ fontSize: 12, fontWeight: 700, color: face.color, letterSpacing: "0.04em", marginBottom: 16 }}>{face.subtitle}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#44403C", margin: "0 0 16px", flex: 1 }}>{face.desc}</p>
                {face.link && <span style={{ fontSize: 13, fontWeight: 700, color: face.color }}>Explore →</span>}
              </>
            );
            return (
              <Fade key={face.title} delay={i * 0.1}>
                {face.link ? (
                  <a href={face.link} className="card-hover" style={cardStyle}>{inner}</a>
                ) : (
                  <div style={cardStyle}>{inner}</div>
                )}
              </Fade>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* 4. PROOF POINTS */
function ProofPoints() {
  return (
    <section style={{ background: "#0F1A2E", padding: "56px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <div style={{ display: "flex", gap: 32, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            {CREDENTIALS.map(cred => (
              <div key={cred.title} style={{ textAlign: "center", minWidth: 120 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }} aria-hidden="true">{cred.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{cred.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{cred.sub}</div>
              </div>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* 5. WHAT I BELIEVE */
const BELIEF_ACCENTS = ["#D946EF", "#14B8A6", "#F59E0B"]; // magenta · teal · amber (cycles)

function WhatIBelieve() {
  return (
    <section style={{ background: "var(--cream)", padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrow="How I Think" heading="Operating Principles" align="center" /></Fade>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "stretch" }}>
          {BELIEFS.map((belief, i) => {
            const accent = BELIEF_ACCENTS[i % BELIEF_ACCENTS.length];
            return (
              <Fade key={belief.title} delay={i * 0.08} style={{ height: "100%" }}>
                <div style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: "32px",
                  border: "1px solid var(--border)",
                  borderTop: `4px solid ${accent}`,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box",
                }}>
                  <div style={{ ...playfair, fontSize: 44, color: "#1C1917", lineHeight: 1, marginBottom: 18, fontWeight: 700 }}>{String(i + 1).padStart(2, "0")}</div>
                  <h3 style={{ ...playfair, fontSize: 18, margin: "0 0 12px", lineHeight: 1.35, color: "#1C1917", fontWeight: 700 }}>{belief.title}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.8, color: "#1C1917", margin: 0, fontWeight: 500 }}>{belief.body}</p>
                </div>
              </Fade>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* 6. CURRENTLY — three live feeds (books · videos · podcasts) */

// Each tile previews the most recent post of its sub-type from Ghost.
// When a sub-type has no posts yet, the tile shows its `placeholder` content
// so the section stays visually full instead of empty.
const READING_TYPES = [
  {
    key: "books",    icon: "book",          color: "#D946EF",
    eyebrow: "Books",        viewAllLabel: "View all books →",
    placeholder: { title: "What I'm reading right now", excerpt: "Mostly non-fiction — probability, neuroscience, systems thinking, and the occasional slow novel. Notes go up as I finish things." },
  },
  {
    key: "videos",   icon: "telescope",     color: "#14B8A6",
    eyebrow: "YouTube",      viewAllLabel: "View all videos →",
    placeholder: { title: "Long-form videos worth keeping", excerpt: "Lectures, interviews, and explainers that have shaped how I think. Saved here with a short note on what stood out." },
  },
  {
    key: "podcasts", icon: "headphones",    color: "#F59E0B",
    eyebrow: "Podcasts",     viewAllLabel: "View all podcasts →",
    placeholder: { title: "Episodes I'm listening to", excerpt: "Conversations and deep dives — economics, AI, public policy, philosophy. Logged here with the takeaway in a line or two." },
  },
];

function fmtReadingDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  } catch { return ""; }
}

function CurrentlyReading({ readingByType = {} }) {
  const { books = [], videos = [], podcasts = [] } = readingByType;
  const buckets = { books, videos, podcasts };

  return (
    <section style={{ background: "#fff", padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrow="Currently" heading="What I'm reading and learning right now" /></Fade>

        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "stretch" }}>
          {READING_TYPES.map((type, i) => {
            const latest = (buckets[type.key] || [])[0];
            const accent = type.color;
            const hasItem = Boolean(latest);
            const title   = hasItem ? latest.title   : type.placeholder.title;
            const excerpt = hasItem ? (latest.excerpt || "") : type.placeholder.excerpt;
            const href    = hasItem ? `/insights/${latest.slug}` : `/reading?type=${type.key}`;
            const Wrapper = hasItem ? "a" : "div";

            return (
              <Fade key={type.key} delay={i * 0.08} style={{ height: "100%" }}>
                <Wrapper
                  href={hasItem ? href : undefined}
                  className={hasItem ? "card-hover" : ""}
                  style={{
                    background: `linear-gradient(180deg, ${accent}12 0%, #ffffff 65%)`,
                    padding: "28px",
                    borderRadius: 16,
                    borderTop: `4px solid ${accent}`,
                    boxShadow: "var(--shadow-card)",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    textDecoration: "none",
                    color: "#1C1917",
                    position: "relative",
                  }}
                >
                  {!hasItem && (
                    <span style={{
                      position: "absolute", top: 16, right: 16,
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                      color: accent, background: `${accent}18`, padding: "4px 9px", borderRadius: 999,
                    }}>Coming soon</span>
                  )}
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${accent}1a`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }} aria-hidden="true">
                    <Icon name={type.icon} size={26} color={accent} strokeWidth={1.9} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                    {type.eyebrow}{hasItem ? ` · ${fmtReadingDate(latest.published_at)}` : ""}
                  </div>
                  <h3 style={{ ...playfair, fontSize: 19, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.35, color: "#1C1917" }}>{title}</h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#44403C", margin: "0 0 16px", flex: 1, fontWeight: 500 }}>{excerpt}</p>
                  {hasItem
                    ? <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>Read note &rarr;</span>
                    : <a href={`/reading?type=${type.key}`} style={{ fontSize: 13, fontWeight: 700, color: accent, textDecoration: "none" }}>{type.viewAllLabel}</a>
                  }
                </Wrapper>
              </Fade>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <a href="/reading" style={{ fontSize: 14, fontWeight: 700, color: "#0F766E", textDecoration: "none", letterSpacing: "0.02em" }}>View the full reading archive &rarr;</a>
        </div>
      </div>
    </section>
  );
}

/* 7. THE HUMAN FILE */
function TheHumanFile() {
  return (
    <section style={{ background: navyGrad, padding: "100px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Fade>
          <span style={{ ...eyebrowSt, display: "block", marginBottom: 24 }}>Beyond the Role</span>
          <p style={{ ...playfair, fontSize: 20, fontWeight: 400, lineHeight: 1.8, color: "rgba(255,255,255,0.85)", margin: "0 0 24px", fontStyle: "italic" }}>
            I read widely, and I read slowly &mdash; mostly non-fiction, drawn to Probability and Information Theory, Systems Thinking, Neuroscience, and the writers who challenge how I think about Uncertainty, Risk, and Human Behaviour. YouTube has quietly become a primary source of learning too &mdash; long-form lectures, interviews, and explanations now sit alongside the books. Mornings are reserved for a walk or a jog &mdash; though I&rsquo;ve been honest about how difficult it often is to get out of bed.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", margin: "0 0 24px" }}>
            I live and work in Dehradun, in the foothills of the <span style={{ color: "#14B8A6" }}>Himalayas</span>. The mountains are a good reminder that governance is not the largest thing in the world.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            If something I've written has been useful to you, I'd genuinely like to know. The best conversations I've had started with a stranger's email.
          </p>
        </Fade>
      </div>
    </section>
  );
}

/* 8. MEDIA MENTIONS — live feed from Ghost (tag: media; sub-tags: m-web, m-pdf) */
const MEDIA_ACCENTS = ["#D946EF", "#14B8A6", "#F59E0B"]; // magenta · teal · amber

// Shown when no `media`-tagged posts exist yet — previews the categories of
// coverage readers can expect, in the same magenta/teal/amber pattern.
const MEDIA_PREVIEW_TILES = [
  {
    icon: "bookText", color: "#D946EF", eyebrow: "Online articles",
    title: "Web stories &amp; interviews",
    excerpt: "Reporting and interviews from digital publications &mdash; the Indian Express, The Hindu, Mint, Scroll, and others &mdash; logged here with a short note on the context.",
  },
  {
    icon: "newspaper", color: "#14B8A6", eyebrow: "Newspaper clippings",
    title: "Scanned print coverage",
    excerpt: "PDF and image scans of print appearances in English and Hindi dailies &mdash; the originals, preserved alongside a short note on what was covered.",
  },
  {
    icon: "telescope", color: "#F59E0B", eyebrow: "Interviews &amp; panels",
    title: "Long-form conversations",
    excerpt: "Q&amp;As, panel discussions, and on-the-record conversations on AI, governance, policy reform, and public service.",
  },
  {
    icon: "lightbulb", color: "#D946EF", eyebrow: "Op-eds &amp; columns",
    title: "By-lined pieces",
    excerpt: "Opinion pieces and columns I&rsquo;ve written for the press &mdash; on education policy, AI in governance, and the discipline of public service.",
  },
];

function mediaKind(post) {
  const slugs = (post.tags || []).map((t) => t.slug);
  if (slugs.includes("m-pdf")) return "pdf";
  if (slugs.includes("m-web")) return "web";
  return "web";
}

function MediaMentions({ posts = [] }) {
  const items = posts.slice(0, 4);
  return (
    <section style={{ background: "#FAFAF8", padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrow="In the Media" heading="Press &amp; media mentions" align="center" /></Fade>

        {items.length === 0 ? (
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "stretch" }}>
            {MEDIA_PREVIEW_TILES.map((tile, i) => (
              <Fade key={i} delay={i * 0.08} style={{ height: "100%" }}>
                <div style={{
                  background: `linear-gradient(180deg, ${tile.color}12 0%, #ffffff 65%)`,
                  padding: "28px",
                  borderRadius: 16,
                  borderTop: `4px solid ${tile.color}`,
                  boxShadow: "var(--shadow-card)",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  color: "#1C1917",
                  position: "relative",
                }}>
                  <span style={{
                    position: "absolute", top: 16, right: 16,
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                    color: tile.color, background: `${tile.color}18`, padding: "4px 9px", borderRadius: 999,
                  }}>Coming soon</span>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${tile.color}1a`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }} aria-hidden="true">
                    <Icon name={tile.icon} size={26} color={tile.color} strokeWidth={1.9} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: tile.color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: tile.eyebrow }} />
                  <h3 style={{ ...playfair, fontSize: 19, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.35, color: "#1C1917" }} dangerouslySetInnerHTML={{ __html: tile.title }} />
                  <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#44403C", margin: 0, flex: 1, fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: tile.excerpt }} />
                </div>
              </Fade>
            ))}
          </div>
        ) : (
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "stretch" }}>
            {items.map((post, i) => {
              const accent = MEDIA_ACCENTS[i % MEDIA_ACCENTS.length];
              const kind = mediaKind(post);
              const kindLabel = kind === "pdf" ? "Clipping" : "Article";
              const iconName = kind === "pdf" ? "newspaper" : "bookText";
              const ctaText = kind === "pdf" ? "Open clipping →" : "Read article →";
              return (
                <Fade key={post.slug || i} delay={i * 0.08} style={{ height: "100%" }}>
                  <a href={`/insights/${post.slug}`} className="card-hover" style={{
                    background: `linear-gradient(180deg, ${accent}10 0%, #ffffff 65%)`,
                    padding: "28px",
                    borderRadius: 16,
                    borderTop: `4px solid ${accent}`,
                    boxShadow: "var(--shadow-card)",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    textDecoration: "none",
                    color: "#1C1917",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      <span style={{ width: 40, height: 40, borderRadius: 10, background: `${accent}1a`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden="true">
                        <Icon name={iconName} size={20} color={accent} strokeWidth={1.9} />
                      </span>
                      <div style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {kindLabel} &middot; {fmtReadingDate(post.published_at)}
                      </div>
                    </div>
                    <h3 style={{ ...playfair, fontSize: 18, fontWeight: 700, margin: "0 0 10px", lineHeight: 1.35, color: "#1C1917" }}>{post.title}</h3>
                    <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#44403C", margin: "0 0 16px", flex: 1, fontWeight: 500 }}>{post.custom_excerpt || ""}</p>
                    <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>{ctaText}</span>
                  </a>
                </Fade>
              );
            })}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <a href="/media" style={{ fontSize: 14, fontWeight: 700, color: "#0F766E", textDecoration: "none", letterSpacing: "0.02em" }}>View the full media archive &rarr;</a>
        </div>
      </div>
    </section>
  );
}

/* 9. GET IN TOUCH */
function GetInTouch() {
  return (
    <section style={{ background: "#fff", padding: "64px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <div style={{ background: "#0F1A2E", borderRadius: 20, padding: "48px 56px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div style={{ maxWidth: 500 }}>
              <h2 style={{ ...playfair, fontSize: 24, color: "#fff", margin: "0 0 10px", lineHeight: 1.3 }}>Want to continue the <em style={{ color: "#14B8A6", fontStyle: "italic" }}>conversation</em>?</h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.7 }}>I'm reachable by email and occasionally on LinkedIn. If you're working on AI in governance, policy reform, or the philosophy of technology — I want to hear about it.</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
              <a href="/contact?type=speaking" className="pill-hover" style={{ fontSize: 14, fontWeight: 600, color: "#0F1A2E", background: goldGrad, padding: "13px 28px", borderRadius: 8, textDecoration: "none" }}>Invite me to speak</a>
              <a href="/contact?type=advisory" className="pill-hover" style={{ fontSize: 14, fontWeight: 600, color: "#14B8A6", border: "1px solid color-mix(in srgb, var(--gold) 19%, transparent)", padding: "13px 28px", borderRadius: 8, textDecoration: "none" }}>Work with me</a>
              <a href="mailto:basava.ias@gmail.com?subject=CV Request" className="pill-hover" style={{ fontSize: 14, fontWeight: 600, color: "#78716C", border: "1px solid var(--border)", padding: "13px 28px", borderRadius: 8, textDecoration: "none" }}>Request CV</a>
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ================================================================ PAGE EXPORT ================================================================ */
export default function AboutClient({ readingByType = {}, mediaPosts = [] }) {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', system-ui, sans-serif", color: "#1C1917", background: "#FAFAF8", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{STYLES}</style>
      <Nav />
      <span id="main" />
      <TheHook />
      <TheUnlikelyPath />
      <ThreeFaces />
      <ProofPoints />
      <WhatIBelieve />
      <TheHumanFile />
      <CurrentlyReading readingByType={readingByType} />
      <MediaMentions posts={mediaPosts} />
      <GetInTouch />
      <BottomSection variant="general" />
    </div>
  );
}
