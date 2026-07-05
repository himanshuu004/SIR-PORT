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

function ExploreMore({ exclude = "" }) {
  const hubs = [
    { title: "Mind & Machine", subtitle: "AI meets philosophy — 13 essays", href: "/mind-and-machine", color: "#3B82F6", icon: "⟐" },
    { title: "The Policy Lab", subtitle: "Data-driven governance — 2 essays", href: "/policy-lab", color: "#D4A843", icon: "◈" },
    { title: "The Proving Ground", subtitle: "Discipline & personal essays", href: "/proving-ground", color: "#E8593C", icon: "△" },
    { title: "The Late Compiler", subtitle: "Learn AI from zero — 5 tracks", href: "/the-late-compiler", color: "#10B981", icon: "▷" },
    { title: "The Proving Ground", subtitle: "Discipline & personal essays", href: "/proving-ground", color: "#E8593C", icon: "△" },
  ].filter(h => h.title !== exclude);
  return (
    <section style={{ background: T.cream, padding: "64px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrowText="Continue exploring" heading="More from this site" align="center" /></Fade>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {hubs.slice(0, 3).map((hub, i) => (
            <Fade key={hub.title} delay={0.06 * i}>
              <a href={hub.href} className="card-hover" style={{ background: "#fff", padding: "24px", display: "flex", alignItems: "center", gap: 14, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${hub.color}, ${hub.color}40)` }} />
                <span style={{ width: 44, height: 44, borderRadius: 12, background: `${hub.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: hub.color, fontFamily: "serif", flexShrink: 0 }} aria-hidden="true">{hub.icon}</span>
                <div><div style={{ ...playfair, fontSize: 16 }}>{hub.title}</div><div style={{ fontSize: 12, color: hub.color, fontWeight: 600, marginTop: 2 }}>{hub.subtitle}</div></div>
              </a>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function NextEssayTeaser({ title, date, color }) {
  return (
    <Fade>
      <div style={{ background: `${color}06`, border: `1px solid ${color}15`, borderRadius: 10, padding: "14px 20px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color, background: `${color}12`, padding: "3px 10px", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>{date ? `Coming ${date}` : "Coming Soon"}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: T.charcoal }}>{title}</span>
        </div>
        <a href="#newsletter" style={{ fontSize: 12, fontWeight: 600, color, textDecoration: "none" }}>Subscribe to get it first →</a>
      </div>
    </Fade>
  );
}
function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" style={{ padding: "16px max(1.5rem, calc((100% - 1120px)/2))", background: T.warmWhite, borderBottom: `1px solid ${T.border}` }}>
      <div style={containerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: T.textMuted }}>
          {items.map((item, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span aria-hidden="true" style={{ color: T.border, fontSize: 11 }}>›</span>}
              {item.href ? <a href={item.href} className="footer-link" style={{ display: "inline", marginBottom: 0 }}>{item.label}</a> : <span style={{ color: T.charcoal, fontWeight: 600 }}>{item.label}</span>}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
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





const READING_PATHS = [
  { label: "New to AI? Begin here", icon: "◇", desc: "From first principles to frontier applications — a guided path through the mathematics, history, and policy implications of AI.", count: 5, color: "#3B82F6" },
  { label: "Interested in how the mind works?", icon: "◎", desc: "Philosophy, neuroscience, and the Indic tradition — exploring the architecture of human thought from multiple traditions.", count: 5, color: "#8B5CF6" },

];

const ALGORITHMIC_MIND = {
  foundations: [
    { title: "From Ancient Dreams to Thinking Machines", sub: "Mathematics of AI", time: "20 min", slug: "ancient-dreams-thinking-machines", excerpt: "A 3,000-year history of humanity's desire to create artificial minds." },
    { title: "Linear Algebra: The Mathematical Backbone of AI", sub: "Mathematics of AI", time: "10 min", slug: "linear-algebra-backbone-ai", excerpt: "Why every neural network is, at its heart, a matrix multiplication." },
    { title: "You Shall Know a Word by the Company They Keep", sub: "Data Science", time: "9 min", slug: "word-embeddings", excerpt: "How word embeddings taught machines to understand language through context." },
    { title: "The Memory Wall: Why the Chef Has to Wait", sub: "The Late Compiler", time: "7 min", slug: "memory-wall", excerpt: "The hardware bottleneck nobody talks about — and why it shapes every AI system." },
    { title: "Interstellar's Greatest Scene Proves AI Is Our Partner", sub: "Data Science", time: "10 min", slug: "interstellar-ai-partner", excerpt: "Why TARS is the best depiction of human-AI collaboration in cinema." },
  ],
  frontiers: [
    { title: "When the Mirror Speaks: The Barnum Effect in AI Systems", sub: "Thinking Machines, Thinking Policy", time: "8 min", slug: "barnum-effect-ai", excerpt: "Why AI systems that flatter us are more dangerous than ones that challenge us." },
    { title: "Why Do Data Centres Need So Much Power?", sub: "Applied AI Lab", time: "13 min", slug: "data-centres-power", excerpt: "The energy infrastructure behind every AI query — and what it means for governance." },
  ],
};

const EXAMINED_LIFE = {
  western: [
    { title: "The Markov Brain: Rewiring Neural Pathways Through Habit", sub: "Rewiring the Mind", time: "15 min", slug: "markov-brain", excerpt: "How Markov chains explain the mathematics of habit formation." },
    { title: "The Either/Or Trap — And How Kierkegaard Helps You Escape It", sub: "Philosophy", time: "17 min", slug: "either-or-trap", excerpt: "Binary thinking is the default mode of the stressed mind." },
    { title: "The Infinite Regress Trap", sub: "Philosophy", time: "11 min", slug: "infinite-regress", excerpt: "When justification never ends — and how to break the chain." },
    { title: "The Hyperbolic Brain & Free Energy Principle", sub: "Rewiring the Mind", time: "14 min", slug: "hyperbolic-brain", excerpt: "Karl Friston's free energy principle meets hyperbolic discounting." },
  ],
  indic: [
    { title: "Finding Meaning When the Honey Loses Its Sweetness", sub: "Bhagavad Gita Commentary", time: "12 min", slug: "honey-sweetness", excerpt: "The Gita's answer to the question every high-achiever secretly asks." },
  ],
};


function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => { const id = setTimeout(() => setIsLoaded(true), 80); return () => clearTimeout(id); }, []);
  const ent = (d) => ({ opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(22px)", transition: `opacity 0.65s cubic-bezier(.22,1,.36,1) ${d}s, transform 0.65s cubic-bezier(.22,1,.36,1) ${d}s` });
  return (
    <header style={{ background: `linear-gradient(165deg, ${T.navy} 0%, ${T.navyLight} 50%, ${T.navyMid} 100%)`, position: "relative", overflow: "hidden", paddingTop: 130, paddingBottom: 80 }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
        <div style={ent(0.1)}><span style={eyebrowSt}>Essays · 13 Articles</span></div>
        <h1 style={{ ...ent(0.2), ...playfair, fontSize: "clamp(34px, 4.2vw, 52px)", color: "#fff", lineHeight: 1.15, letterSpacing: "-0.025em", margin: "16px 0 24px" }}>Mind & <em style={{ color: "#D4A843", fontStyle: "italic" }}>Machine</em></h1>
        <p style={{ ...ent(0.3), fontSize: 18, lineHeight: 1.75, color: "rgba(255,255,255,0.55)", maxWidth: 600, margin: 0 }}>From neural networks to neural pathways, from the Gita to GPT — exploring intelligence at every level. Essays on AI foundations, cognitive science, philosophy, and the examined life.</p>
      </div>
    </header>
  );
}

function StartHere() {
  return (
    <section style={{ background: T.cream, padding: "64px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrowText="🧭 Start Here" heading="Not sure where to begin?" align="center" /></Fade>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {READING_PATHS.map((path, i) => (
            <Fade key={path.label} delay={0.08 * i}>
              <div className="card-hover" style={{ background: "#fff", padding: 28, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${path.color}, ${path.color}50)` }} />
                <div style={{ fontSize: 24, marginBottom: 14, color: path.color }} aria-hidden="true">{path.icon}</div>
                <h3 style={{ ...playfair, fontSize: 18, fontWeight: 600, lineHeight: 1.35, marginBottom: 10 }}>{path.label}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: T.textMuted, marginBottom: 16 }}>{path.desc}</p>
                <span style={{ fontSize: 13, fontWeight: 600, color: path.color }}>{path.count} articles · Start reading →</span>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleRow({ article, color }) {
  return (
    <a href={`/insights/${article.slug}`} className="card-hover" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", background: "#fff", gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{article.sub}</div>
        <div style={{ ...playfair, fontSize: 16, fontWeight: 600, lineHeight: 1.35, marginBottom: 4 }}>{article.title}</div>
        <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.5 }}>{article.excerpt}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: T.textMuted }}>{article.time}</span>
        <span style={{ fontSize: 14, color }}>→</span>
      </div>
    </a>
  );
}

function AlgorithmicMind() {
  return (
    <section style={{ background: T.warmWhite, padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: "#3B82F610", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#3B82F6", fontFamily: "serif" }} aria-hidden="true">⟐</span>
            <h2 style={{ ...playfair, fontSize: 28, margin: 0 }}>The Algorithmic Mind</h2>
          </div>
          <p style={{ fontSize: 15, color: T.textMuted, marginBottom: 36, maxWidth: 560 }}>AI from first principles — mathematics, data science, hardware, and the frontier of machine intelligence.</p>
        </Fade>

        <Fade delay={0.05}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#3B82F6", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Foundations</h3>
        </Fade>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
          {ALGORITHMIC_MIND.foundations.map((article, i) => (
            <Fade key={article.slug} delay={0.04 * i}><ArticleRow article={article} color="#3B82F6" /></Fade>
          ))}
        </div>

        <Fade>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#3B82F6", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Frontiers</h3>
        </Fade>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ALGORITHMIC_MIND.frontiers.map((article, i) => (
            <Fade key={article.slug} delay={0.04 * i}><ArticleRow article={article} color="#3B82F6" /></Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExaminedLife() {
  return (
    <section style={{ background: "#fff", padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: "#8B5CF610", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#8B5CF6", fontFamily: "serif" }} aria-hidden="true">◉</span>
            <h2 style={{ ...playfair, fontSize: 28, margin: 0 }}>The Examined Life</h2>
          </div>
          <p style={{ fontSize: 15, color: T.textMuted, marginBottom: 36, maxWidth: 560 }}>Philosophy, neuroscience, and the Indic tradition — exploring the architecture of human thought.</p>
        </Fade>

        <Fade delay={0.05}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#8B5CF6", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Western & Cognitive</h3>
        </Fade>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
          {EXAMINED_LIFE.western.map((article, i) => (
            <Fade key={article.slug} delay={0.04 * i}><ArticleRow article={article} color="#8B5CF6" /></Fade>
          ))}
        </div>

        <Fade>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#8B5CF6", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>The Indic Canon</h3>
        </Fade>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {EXAMINED_LIFE.indic.map((article, i) => (
            <Fade key={article.slug} delay={0.04 * i}><ArticleRow article={article} color="#8B5CF6" /></Fade>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================
   TODO (developer): Implement localStorage reading progress
   - Track read articles: localStorage.setItem('read_' + slug, Date.now())
   - Show checkmark on read articles in hub listing
   - Show "Continue reading" banner at top if last article was incomplete
   - Track scroll depth per article for progress bar
   ================================================================ */
export default function MindAndMachinePage() {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', system-ui, sans-serif", color: T.charcoal, background: T.warmWhite, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{STYLES}</style>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <span id="main" />
      <Hero />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Mind & Machine" }]} />
      <NextEssayTeaser title="The Attention Mechanism — Visualized" date="" color="#3B82F6" />
      <StartHere />
      <AlgorithmicMind />
      <ExaminedLife />
      <section style={{ background: "#fff", padding: "48px max(1.5rem, calc((100% - 1120px)/2))" }}>
        <div style={containerStyle}><Fade>
          <div style={{ background: "#10B98108", border: "1px solid #10B98118", borderRadius: 14, padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ ...playfair, fontSize: 17, marginBottom: 4 }}>New to these topics?</div>
              <div style={{ fontSize: 14, color: T.textMuted }}>The Late Compiler teaches AI, Python, and machine learning from zero — with hands-on exercises every week.</div>
            </div>
            <a href="/the-late-compiler" className="pill-hover" style={{ fontSize: 14, fontWeight: 600, color: "#fff", background: "#10B981", padding: "12px 24px", borderRadius: 8 }}>Start learning →</a>
          </div>
        </Fade></div>
      </section>
      <ExploreMore exclude="Mind & Machine" />
      <NewsletterCTA variant="mind" />
      <Footer />
    </div>
  );
}
