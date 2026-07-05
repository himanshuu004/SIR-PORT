import { useState, useEffect, useRef, useCallback } from "react";

/* ================================================================ DESIGN TOKENS ================================================================ */
const T = { navy: "#0F1A2E", navyLight: "#1B2A4A", navyMid: "#243654", gold: "#D4A843", goldLight: "#E8C87A", warmWhite: "#FAFAF8", cream: "#F5F2ED", charcoal: "#1C1917", textBody: "#44403C", textMuted: "#57534E", border: "rgba(28,25,23,0.08)" };
const containerStyle = { maxWidth: 1120, margin: "0 auto", padding: "0 1.5rem" };
const playfair = { fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: T.charcoal };
const eyebrowSt = { fontSize: 12, fontWeight: 600, color: T.gold, letterSpacing: "0.1em", textTransform: "uppercase" };
const goldGrad = `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`;
const navyGrad = `linear-gradient(160deg, ${T.navy}, ${T.navyLight})`;
const gridTex = { position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)", backgroundSize: "48px 48px" };

/* ================================================================ STATIC DATA ================================================================ */
const NAV_LINKS = [{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Mind & Machine", href: "/mind-and-machine" }, { label: "The Policy Lab", href: "/policy-lab" }, { label: "The Proving Ground", href: "/proving-ground" }, { label: "The Late Compiler", href: "/the-late-compiler" }, { label: "Contact", href: "/contact" }];
const SOCIAL_LINKS = [{ label: "𝕏", ariaLabel: "Twitter / X", href: "https://twitter.com" }, { label: "in", ariaLabel: "LinkedIn", href: "https://linkedin.com/in/basava-purushottam-b862247" }, { label: "f", ariaLabel: "Facebook", href: "https://facebook.com" }];
const FOOTER_COLUMNS = [
  { title: "Navigate", links: [{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Mind & Machine", href: "/mind-and-machine" }, { label: "The Policy Lab", href: "/policy-lab" }, { label: "The Proving Ground", href: "/proving-ground" }, { label: "The Late Compiler", href: "/the-late-compiler" }, { label: "Contact", href: "/contact" }] },
  { title: "Connect", links: [{ label: "LinkedIn", href: "https://linkedin.com/in/basava-purushottam-b862247" }, { label: "Twitter/X", href: "https://twitter.com" }, { label: "Facebook", href: "https://facebook.com" }, { label: "Email", href: "mailto:basava.ias@gmail.com" }, { label: "RSS Feed", href: "/feed.xml" }] },
];

/* ================================================================ CSS ================================================================ */
const STYLES = `
  .nav-link { color: rgba(255,255,255,0.65); border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s; }
  .nav-link:hover, .nav-link:focus-visible { color: #D4A843; }
  .nav-link:focus-visible { outline: 2px solid #D4A843; outline-offset: 4px; border-radius: 2px; }
  .nav-link.active { color: #D4A843; border-bottom-color: #D4A843; }
  .social-icon { width: 26px; height: 26px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.4); text-decoration: none; transition: all 0.2s; }
  .social-icon:hover, .social-icon:focus-visible { border-color: rgba(212,168,67,0.25); color: #D4A843; }
  .social-icon:focus-visible { outline: 2px solid #D4A843; outline-offset: 2px; }
  .social-icon-footer { width: 30px; height: 30px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.35); text-decoration: none; transition: all 0.2s; }
  .social-icon-footer:hover, .social-icon-footer:focus-visible { border-color: rgba(212,168,67,0.25); color: #D4A843; }
  .footer-link { display: block; font-size: 13px; color: rgba(255,255,255,0.5); text-decoration: none; margin-bottom: 8px; transition: color 0.2s; }
  .footer-link:hover, .footer-link:focus-visible { color: #E8C87A; }
  .card-hover { text-decoration: none; display: block; border: 1px solid rgba(28,25,23,0.08); border-radius: 16px; transition: all 0.3s; color: inherit; }
  .card-hover:hover, .card-hover:focus-visible { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.06); }
  .card-hover:focus-visible { outline: 2px solid #D4A843; outline-offset: 2px; }
  .pill-hover { text-decoration: none; display: inline-block; transition: all 0.2s; }
  .pill-hover:hover, .pill-hover:focus-visible { filter: brightness(1.15); }
  .pill-hover:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
  .subscribe-btn { transition: all 0.2s; }
  .subscribe-btn:hover, .subscribe-btn:focus-visible { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(212,168,67,0.25); }
  .subscribe-btn:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
  
  .skip-link { position: absolute; left: -9999px; top: 0; z-index: 999; background: #D4A843; color: #0F1A2E; padding: 8px 16px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 0 0 8px 0; }
  .skip-link:focus { left: 0; }
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

/* ================================================================ REUSABLE COMPONENTS ================================================================ */

function Fade({ children, delay = 0, style = {} }) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setIsVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={elementRef} className="fade-wrapper" style={{ ...style, opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}s` }}>
      {children}
    </div>
  );
}

function SectionHeader({ eyebrowText, heading, align = "left" }) {
  return (<div style={{ textAlign: align, marginBottom: 48 }}><span style={eyebrowSt}>{eyebrowText}</span><h2 style={{ ...playfair, fontSize: 30, margin: "10px 0 0" }}>{heading}</h2></div>);
}

function SocialIcon({ href, ariaLabel, children, variant = "nav" }) {
  return (<a href={href} aria-label={ariaLabel} className={variant === "footer" ? "social-icon-footer" : "social-icon"} target="_blank" rel="noopener noreferrer">{children}</a>);
}

function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  useEffect(() => { const handleScroll = () => setIsScrolled(window.scrollY > 40); window.addEventListener("scroll", handleScroll, { passive: true }); return () => window.removeEventListener("scroll", handleScroll); }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 64, background: isScrolled || isMobileOpen ? "rgba(15,26,46,0.97)" : "transparent", backdropFilter: isScrolled || isMobileOpen ? "blur(16px)" : "none", borderBottom: isScrolled ? "1px solid rgba(212,168,67,0.08)" : "1px solid transparent", transition: "all 0.4s ease" }} role="navigation" aria-label="Main navigation">
      <div style={{ ...containerStyle, height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 19, fontWeight: 700, color: "#fff", textDecoration: "none" }}>Purushottam</a>
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {NAV_LINKS.map(link => (<a key={link.label} href={link.href} className="nav-link" style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", textDecoration: "none", paddingBottom: 4 }}>{link.label}</a>))}
          <div style={{ display: "flex", gap: 8, marginLeft: 4 }}>{SOCIAL_LINKS.map(social => <SocialIcon key={social.ariaLabel} href={social.href} ariaLabel={social.ariaLabel}>{social.label}</SocialIcon>)}</div>
          <button onClick={() => { const q = prompt("Search articles, projects, and lessons..."); if (q) alert("Search coming soon! In production this searches all content for: " + q); }} aria-label="Search" style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", fontSize: 14, transition: "all 0.2s" }}>⌕</button>
          <a href="#newsletter" style={{ fontSize: 12.5, fontWeight: 600, color: T.navy, background: goldGrad, padding: "8px 18px", borderRadius: 40, textDecoration: "none" }}>Subscribe</a>
        </div>
        <button className="mobile-menu-btn" onClick={() => setIsMobileOpen(!isMobileOpen)} aria-label={isMobileOpen ? "Close menu" : "Open menu"} aria-expanded={isMobileOpen} style={{ display: "none", alignItems: "center", justifyContent: "center", width: 40, height: 40, background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 22 }}>{isMobileOpen ? "✕" : "☰"}</button>
      </div>
      {isMobileOpen && (
        <div style={{ background: "rgba(15,26,46,0.98)", padding: "24px 1.5rem 32px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {NAV_LINKS.map(link => <a key={link.label} href={link.href} className="nav-link" style={{ display: "block", padding: "12px 0", fontSize: 15, textDecoration: "none", borderBottom: "none" }}>{link.label}</a>)}
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>{SOCIAL_LINKS.map(social => <SocialIcon key={social.ariaLabel} href={social.href} ariaLabel={social.ariaLabel}>{social.label}</SocialIcon>)}</div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ background: T.navy, borderTop: "1px solid rgba(212,168,67,0.08)", padding: "48px 0 32px" }}>
      <div style={containerStyle}>
        <div className="footer-layout" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          <div style={{ maxWidth: 280 }}>
            <div style={{ ...playfair, fontSize: 18, color: "#fff", marginBottom: 8 }}>Purushottam</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: "0 0 16px" }}>Bridging AI, governance, and Indic philosophy to reimagine public systems for 1.4 billion Indians.</p>
            <div style={{ display: "flex", gap: 8 }}>{SOCIAL_LINKS.map(social => <SocialIcon key={social.ariaLabel} href={social.href} ariaLabel={social.ariaLabel} variant="footer">{social.label}</SocialIcon>)}</div>
          </div>
          <div className="footer-cols" style={{ display: "flex", gap: 56 }}>
            {FOOTER_COLUMNS.map(column => (<div key={column.title}><div style={{ fontSize: 11, fontWeight: 600, color: T.gold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>{column.title}</div>{column.links.map(link => <a key={link.label} href={link.href} className="footer-link">{link.label}</a>)}</div>))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2026 Dr. B.V.R.C. Purushottam. All rights reserved.</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Dehradun, Uttarakhand, India</span>
        </div>
      </div>
    </footer>
  );
}

function NewsletterCTA({ variant = "general" }) {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const handleSubmit = useCallback((event) => { event.preventDefault(); if (email.includes("@")) setIsSent(true); }, [email]);
  const copy = { mind: { h: "Get the next essay on mind, machine, and meaning", d: "Essays at the intersection of AI, philosophy, and Indian governance. No promotional content." }, policy: { h: "Data-driven governance analysis. Weekly. No fluff.", d: "Policy frameworks, implementation reports, and probabilistic thinking — from inside the Indian Administrative Service." }, general: { h: "If this resonated — here's where it continues", d: "Essays on AI, governance, and decision-making—from a serving IAS officer thinking in public. Unsubscribe anytime." } }[variant];
  return (
    <section id="newsletter" style={{ background: navyGrad, padding: "80px 0", position: "relative", overflow: "hidden" }}>
      <div style={gridTex} />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 1.5rem", textAlign: "center", position: "relative", zIndex: 1 }}>
        <Fade>
          <span style={{ ...eyebrowSt, display: "block", marginBottom: 14 }}>Signal from the Frontier</span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Latest: "The Markov Brain" — March 2026</span>
          </div>
          <h2 style={{ ...playfair, fontSize: 28, color: "#fff", margin: "0 0 10px", lineHeight: 1.3 }}>{copy.h}</h2>
          <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.45)", margin: "0 0 32px", lineHeight: 1.7 }}>{copy.d}</p>
          {!isSent ? (
            <form onSubmit={handleSubmit} className="newsletter-row" style={{ display: "flex", gap: 10, maxWidth: 420, margin: "0 auto" }}>
              <label htmlFor="nl-email" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>Email address</label>
              <input id="nl-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" required autoComplete="email" aria-label="Email address for newsletter" style={{ flex: 1, padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 15, outline: "none", fontFamily: "'Source Sans 3', system-ui" }} />
              <button type="submit" className="subscribe-btn" style={{ background: goldGrad, color: T.navy, border: "none", borderRadius: 10, padding: "13px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Subscribe</button>
            </form>
          ) : (
            <div role="alert" style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.2)", borderRadius: 10, padding: "16px 24px", color: T.gold, fontSize: 15, maxWidth: 420, margin: "0 auto" }}>Welcome to Signal from the Frontier. Check your inbox.</div>
          )}
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", marginTop: 14 }}>Views expressed are personal and do not represent the Government of India and Government of Uttarakhand.</p>
        </Fade>
      </div>
    </section>
  );
}



/* ================================================================ PAGE-SPECIFIC DATA ================================================================ */

const THREE_FACES = [
  { icon: "🏛", color: "#D4A843", title: "The Civil Servant", subtitle: "23 years · 5 Union Ministries · IAS 2004 Batch · 1 State Government (Uttarakhand)", desc: "From district administration to drafting the National Education Policy 2020 — governance at every level, from village panchayats to Parliament.", link: "/proving-ground#official" },
  { icon: "⟐", color: "#3B82F6", title: "The Technology Seeker", subtitle: "AI · Data Science · UC Berkeley MPA", desc: "Self-taught in machine learning, learning to build AI tools and AI agents for governance.", link: "/mind-and-machine" },
  { icon: "◉", color: "#8B5CF6", title: "Systems Thinker", subtitle: "Bhagavad Gita · Cognitive Science · Patanjali", desc: "Writing at the intersection of Indic philosophy and modern neuroscience. Exploring how ancient frameworks illuminate decision-making, habit, and meaning.", link: "/mind-and-machine" },
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

const CURRENT_WORK = [
  { title: "Your Brain Is Running Old Software", desc: "13 neuroscience principles to update the patterns that shape your life. A shift from self-judgment to understanding: not \"what's wrong with me,\" but \"what was running, and why does it make sense.\"", link: "/mind-and-machine", color: "#3B82F6" },
  { title: "The Late Compiler", desc: "A learning hub teaching AI, Python, and machine learning — applied-first — for people who came to technology later in life. New lessons weekly.", link: "/the-late-compiler", color: "#10B981" },
  { title: "The Mind & Machine Essay Series", desc: "13 essays (and counting) exploring AI foundations, philosophy of mind, and governance.", link: "/mind-and-machine", color: "#8B5CF6" },
  { title: "Policy Research & Analysis", desc: "Data-driven insights on dairy, animal husbandry, finance, and probabilistic governance.", link: "/policy-lab", color: "#D4A843" },
];

const EXPLORE_HUBS = [
  { title: "Mind & Machine", subtitle: "AI meets philosophy — 13 essays", icon: "⟐", color: "#3B82F6", href: "/mind-and-machine" },
  { title: "The Policy Lab", subtitle: "Data-driven governance — 2 essays", icon: "◈", color: "#D4A843", href: "/policy-lab" },
  { title: "The Proving Ground", subtitle: "Discipline & personal essays — 1 essay", icon: "△", color: "#E8593C", href: "/proving-ground" },
  { title: "The Late Compiler", subtitle: "Learn AI applied-first — 5 tracks", icon: "</>", color: "#10B981", href: "/the-late-compiler" },
];


/* ================================================================ PAGE COMPONENTS ================================================================ */

/* 1. THE HOOK — Navy hero with arresting one-liner */
function TheHook() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => { const id = setTimeout(() => setIsLoaded(true), 80); return () => clearTimeout(id); }, []);
  const ent = (d) => ({ opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.65s cubic-bezier(.22,1,.36,1) ${d}s, transform 0.65s cubic-bezier(.22,1,.36,1) ${d}s` });
  return (
    <section style={{ background: `linear-gradient(160deg, ${T.navy} 0%, ${T.navyLight} 100%)`, padding: "140px max(1.5rem, calc((100% - 1120px)/2)) 100px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)", backgroundSize: "48px 48px" }} />
      <div style={{ maxWidth: 800, position: "relative", zIndex: 1 }}>
        <div style={ent(0.1)}><span style={{ ...eyebrowSt, letterSpacing: "0.12em", display: "block", marginBottom: 20 }}>About</span></div>
        <h1 style={{ ...ent(0.2), ...playfair, fontSize: "clamp(32px, 4vw, 52px)", color: "#fff", lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 28px" }}>
          A civil servant <em style={{ color: T.gold, fontStyle: "italic" }}>learning</em> to code.<br />A thinker <em style={{ color: T.gold, fontStyle: "italic" }}>shaping</em> governance.
        </h1>
        <p style={{ ...ent(0.35), fontSize: 18, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", maxWidth: 620, margin: 0 }}>
          A veterinarian by training, an IAS officer <span style={{ color: T.gold }}>by choice</span>, and an AI practitioner by obsession. 23 years inside India's most complex institutions — now trying to understand, and build, what comes next.
        </p>
      </div>
    </section>
  );
}

/* 2. THE UNLIKELY PATH — Narrative arc, not a timeline */
function TheUnlikelyPath() {
  return (
    <section style={{ background: T.warmWhite, padding: "100px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <Fade>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: T.textBody, margin: "0 0 28px" }}>
            I began as a veterinary doctor, trained to heal and serve at the most fundamental level. But somewhere along the way, a larger calling took shape. I stepped into the arena of civil services—and cleared all three: IAS (2004), IPS (2003), and IPoS (2002). It wasn't just about success; it was about choosing the path that would let me create the widest impact. I chose the IAS.</p>
        </Fade>
        <Fade delay={0.06}>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: T.textBody, margin: "0 0 28px" }}>
            That choice brought me to Uttarakhand—a young, fragile, and breathtaking Himalayan state, still finding its administrative and developmental rhythm. For over a decade, I worked on the ground in districts, close to people and their realities, building institutions, solving problems, and learning governance not from files, but from lived experience.</p>
        </Fade>
        <Fade delay={0.08}>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: T.textBody, margin: "0 0 28px" }}>
            In time, my journey moved to the Government of India, where I spent five defining years as Private Secretary to three Union Ministers. Among these, my tenure in the Education Ministry stood out—as I became part of the process that shaped the National Education Policy 2020, a once-in-a-generation reform that reimagined India's education system after 34 years.</p>
        </Fade>
        <Fade delay={0.1}>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: T.textBody, margin: "0 0 28px" }}>
            Looking back, the journey has been less about positions held, and more about the expanding horizon of responsibility—one decision at a time.
          </p>
        </Fade>
        <Fade delay={0.08}>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: T.textBody, margin: "0 0 28px" }}>
            Around 2017–2018, a quiet but decisive shift began. I went to University of California, Berkeley—and that experience changed the way I saw the world.</p>
        </Fade>
        <Fade delay={0.14}>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: T.textBody, margin: "0 0 28px" }}>
            There, I encountered data science and behavioural economics not as academic subjects, but as tools—sharp, precise, and deeply revealing. They offered a way to understand why well-intentioned policies so often falter in the real world. For the first time, I could clearly see the gap between what governments design and what people actually experience.</p>
        </Fade>
        <Fade delay={0.16}>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: T.textBody, margin: "0 0 28px" }}>
            When I returned, I could no longer look at governance the same way. Administering systems was no longer enough. I felt compelled to question them, to rethink their design, and where necessary, to rebuild them with greater intelligence and sensitivity to reality.</p>
        </Fade>
        <Fade delay={0.18}>
          <p style={{ fontSize: 17, lineHeight: 1.9, color: T.textBody, margin: "0 0 28px" }}>
            That realisation marked the beginning of a new journey. I started teaching myself machine learning, Python, and applied AI—patiently, from first principles. At the same time, I began writing about the foundations of AI, not merely as a technological shift, but as a transformative force—one that could fundamentally reshape how we think about governance, decision-making, and society itself.
          </p>
        </Fade>

      </div>
    </section>
  );
}

/* 3. THREE FACES — Identity cards */
function ThreeFaces() {
  return (
    <section style={{ background: "#fff", padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrowText="Three Identities" heading="One person, three lenses" align="center" /></Fade>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {THREE_FACES.map((face, i) => (
            <Fade key={face.title} delay={i * 0.1}>
              <a href={face.link} className="card-hover" style={{ background: T.warmWhite, padding: "32px 28px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${face.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 20 }} aria-hidden="true">{face.icon}</div>
                <h3 style={{ ...playfair, fontSize: 20, margin: "0 0 6px" }}>{face.title}</h3>
                <div style={{ fontSize: 12, fontWeight: 600, color: face.color, letterSpacing: "0.04em", marginBottom: 16 }}>{face.subtitle}</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: T.textMuted, margin: "0 0 16px", flex: 1 }}>{face.desc}</p>
                <span style={{ fontSize: 13, fontWeight: 600, color: face.color }}>Explore →</span>
              </a>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 4. PROOF POINTS — Visual credential badges */
function ProofPoints() {
  return (
    <section style={{ background: T.navy, padding: "56px max(1.5rem, calc((100% - 1120px)/2))" }}>
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

/* 5. WHAT I BELIEVE — Operating principles */
function WhatIBelieve() {
  return (
    <section style={{ background: T.cream, padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrowText="How I Think" heading="Operating Principles" align="center" /></Fade>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {BELIEFS.map((belief, i) => (
            <Fade key={belief.title} delay={i * 0.08}>
              <div style={{ background: "#fff", borderRadius: 14, padding: "32px", border: `1px solid ${T.border}` }}>
                <div style={{ ...playfair, fontSize: 44, color: "rgba(212,168,67,0.15)", lineHeight: 1, marginBottom: 18 }}>{String(i + 1).padStart(2, "0")}</div>
                <h3 style={{ ...playfair, fontSize: 18, margin: "0 0 12px", lineHeight: 1.35 }}>{belief.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.8, color: T.textBody, margin: 0 }}>{belief.body}</p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 6. WHAT I'M BUILDING NOW — Current focus areas with links */
function BuildingNow() {
  return (
    <section style={{ background: "#fff", padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrowText="Current Focus" heading="What I'm building now" /></Fade>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {CURRENT_WORK.map((work, i) => (
            <Fade key={work.title} delay={i * 0.08}>
              <a href={work.link} className="card-hover" style={{ background: T.warmWhite, padding: "28px", display: "flex", flexDirection: "column", height: "100%", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${work.color}, ${work.color}40)` }} />
                <h3 style={{ ...playfair, fontSize: 18, fontWeight: 600, margin: "0 0 10px", lineHeight: 1.35 }}>{work.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: T.textMuted, margin: "0 0 16px", flex: 1 }}>{work.desc}</p>
                <span style={{ fontSize: 13, fontWeight: 600, color: work.color }}>Learn more →</span>
              </a>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 7. THE HUMAN FILE — Personal, warm, brief */
function TheHumanFile() {
  return (
    <section style={{ background: navyGrad, padding: "100px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Fade>
          <span style={{ ...eyebrowSt, display: "block", marginBottom: 24 }}>Beyond the Role</span>
          <p style={{ ...playfair, fontSize: 20, fontWeight: 400, lineHeight: 1.8, color: "rgba(255,255,255,0.85)", margin: "0 0 24px", fontStyle: "italic" }}>
            I read widely, and I read slowly—spending time with probability theory and Beyond Good and Evil, alongside essays and writing that challenge how I think about uncertainty, risk, and human behaviour. Mornings are reserved for a walk or a jog—though I've been honest about how difficult it often is to get out of bed.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", margin: "0 0 24px" }}>
            I live and work in Dehradun, in the foothills of the <span style={{ color: T.gold }}>Himalayas</span>. The mountains are a good reminder that governance is not the largest thing in the world.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            If something I've written has been useful to you, I'd genuinely like to know. The best conversations I've had started with a stranger's email.
          </p>
        </Fade>
      </div>
    </section>
  );
}

/* 8. EXPLORE MY WORK — Hub navigation cards */
function ExploreMyWork() {
  return (
    <section style={{ background: T.warmWhite, padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrowText="My Writing" heading="Explore My Work" align="center" /></Fade>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {EXPLORE_HUBS.map((hub, i) => (
            <Fade key={hub.title} delay={i * 0.08}>
              <a href={hub.href} className="card-hover" style={{ background: "#fff", padding: "28px", display: "flex", alignItems: "center", gap: 16, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${hub.color}, ${hub.color}40)` }} />
                <span style={{ width: 48, height: 48, borderRadius: 12, background: `${hub.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: hub.color, fontFamily: "serif", flexShrink: 0 }} aria-hidden="true">{hub.icon}</span>
                <div>
                  <div style={{ ...playfair, fontSize: 18 }}>{hub.title}</div>
                  <div style={{ fontSize: 13, color: hub.color, fontWeight: 600, marginTop: 2 }}>{hub.subtitle}</div>
                </div>
              </a>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 9. GET IN TOUCH — CTA banner */
function GetInTouch() {
  return (
    <section style={{ background: "#fff", padding: "64px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <div style={{ background: T.navy, borderRadius: 20, padding: "48px 56px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div style={{ maxWidth: 500 }}>
              <h2 style={{ ...playfair, fontSize: 24, color: "#fff", margin: "0 0 10px", lineHeight: 1.3 }}>Want to continue the <em style={{ color: T.gold, fontStyle: "italic" }}>conversation</em>?</h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.7 }}>I'm reachable by email and occasionally on LinkedIn. If you're working on AI in governance, policy reform, or the philosophy of technology — I want to hear about it.</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
              <a href="/contact?type=speaking" className="pill-hover" style={{ fontSize: 14, fontWeight: 600, color: T.navy, background: goldGrad, padding: "13px 28px", borderRadius: 8, textDecoration: "none" }}>Invite me to speak</a>
            <a href="/contact?type=advisory" className="pill-hover" style={{ fontSize: 14, fontWeight: 600, color: T.gold, border: `1px solid ${T.gold}30`, padding: "13px 28px", borderRadius: 8, textDecoration: "none" }}>Work with me</a>
            <a href="/about/cv.pdf" className="pill-hover" style={{ fontSize: 14, fontWeight: 600, color: T.textMuted, border: `1px solid ${T.border}`, padding: "13px 28px", borderRadius: 8, textDecoration: "none" }}>Download CV</a>
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
}


/* ================================================================
   PAGE EXPORT — About
   Font link: add to index.html <head> or use next/font
   ================================================================ */
export default function AboutPage() {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', system-ui, sans-serif", color: T.charcoal, background: T.warmWhite, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{STYLES}</style>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <span id="main" />
      <TheHook />
      <TheUnlikelyPath />
      <ThreeFaces />
      <ProofPoints />
      <WhatIBelieve />
      <BuildingNow />
      <TheHumanFile />
      <ExploreMyWork />
      <GetInTouch />
      <NewsletterCTA variant="general" />
      <Footer />
    </div>
  );
}
