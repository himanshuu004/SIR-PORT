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


/* ================================================================ ARTICLE DATA — "The Markov Brain" (In production: fetched via GROQ from Sanity by slug) ================================================================ */
const PILLARS = {
  "examined-life": { label: "The Examined Life", hub: "Mind & Machine", hubPath: "/mind-and-machine", color: "#8B5CF6", icon: "◉" },
  "algorithmic-mind": { label: "The Algorithmic Mind", hub: "Mind & Machine", hubPath: "/mind-and-machine", color: "#3B82F6", icon: "⟐" },
};

const ARTICLE = {
  title: "The Markov Brain: Rewiring Neural Pathways Through Probabilistic Thinking",
  slug: "markov-brain", section: "examined-life", sub: "Rewiring the Mind",
  publishedAt: "2025-10-05", readTime: "15 min", featured: true,
  tags: ["Neuroscience", "Markov Chains", "Habits", "Probability", "Cognitive Science"],
  takeaways: [
    "Your daily habits form a Markov chain — each action's probability is determined by the state you're currently in, not your distant intentions.",
    "Transition matrices reveal why willpower fails: you're fighting a probabilistic system with deterministic thinking.",
    "Deliberate state manipulation (changing your environment, not your resolve) is the mathematical path to lasting behavioral change.",
  ],
  excerpt: "Your habits are Markov chains. Your brain is a transition matrix. Understanding the mathematics of habit formation to engineer deliberate cognitive change.",
  body: [
    { type: "epigraph", text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", attribution: "— Will Durant, paraphrasing Aristotle" },
    { type: "heading", text: "The Morning That Changed How I Think About Habits" },
    { type: "paragraph", text: "I used to believe that habits were about willpower — that the person who wakes at 5 AM simply wants it more than the person who doesn't. Then I encountered Markov chains during my self-directed study of probability theory, and everything I thought I knew about human behavior collapsed." },
    { type: "paragraph", text: "A Markov chain is a mathematical model where the probability of transitioning to any future state depends only on the current state — not on the sequence of events that preceded it. In the language of probability: the future is conditionally independent of the past, given the present." },
    { type: "heading", text: "Your Brain Is a Transition Matrix" },
    { type: "paragraph", text: "Consider your morning routine as a finite set of states: Alarm Rings → [Stay in Bed | Get Up]. If you stay in bed, the next transition is: In Bed → [Snooze Again | Eventually Get Up Late]. Each of these transitions has a probability attached to it — and those probabilities shift based on context." },
    { type: "callout", text: "This is the key insight: you are not choosing your actions from some rational command center. You are a transition matrix — and the probabilities in that matrix are shaped by environment, neurochemistry, and repetition far more than by conscious intention." },
    { type: "heading", text: "Why Willpower Is the Wrong Intervention" },
    { type: "paragraph", text: "If habits are Markov chains, then willpower is an attempt to override the transition probabilities through sheer force. The mathematical approach is different: change the topology of the riverbed. In Markov terms, modify the transition matrix itself." },
    { type: "paragraph", text: "James Clear understood this intuitively when he wrote about environment design in Atomic Habits. But the Markov framework makes the mechanism explicit: you are engineering a new transition matrix, one environmental cue at a time." },
    { type: "heading", text: "The Bhagavad Gita Connection" },
    { type: "paragraph", text: "There's a passage in the Gita that has always stayed with me: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.' (Chapter 2, Verse 47). Krishna is telling Arjuna: focus on the transition, not the outcome. You control only the current state-action pair — not where the chain ends up." },
    { type: "paragraph", text: "This convergence of ancient wisdom and modern probability theory is not a coincidence. It is evidence that the deepest insights about human behavior — whether they come from the Vedic tradition or from Andrey Markov's 1906 paper — point to the same truth: the present moment is the only lever you have." },
    { type: "heading", text: "Coda" },
    { type: "paragraph", text: "I still struggle to get out of bed some mornings. The transition matrix hasn't been fully reprogrammed — it's a slow process. But I no longer frame it as a failure of will. I frame it as a signal: the matrix needs another adjustment. That shift changed everything." },
  ],
};

const RELATED_ARTICLES = [
  { title: "The Either/Or Trap — And How Kierkegaard Helps You Escape It", section: "examined-life", readTime: "17 min", slug: "either-or-trap", excerpt: "Binary thinking is the default mode of the stressed mind. Kierkegaard's existential framework offers a surprisingly practical escape route." },
  { title: "The Hyperbolic Brain and the Free Energy Principle", section: "examined-life", readTime: "14 min", slug: "hyperbolic-brain", excerpt: "Karl Friston's free energy principle meets hyperbolic discounting. Why our brains systematically misprice the future." },
  { title: "From Ancient Dreams to Thinking Machines: A History of AI", section: "algorithmic-mind", readTime: "20 min", slug: "ancient-dreams-thinking-machines", excerpt: "From Aristotle's syllogistic logic to GPT-4 — 2,500 years of humanity's quest to build minds." },
];



function ExploreMore({ exclude = "" }) {
  const hubs = [
    { title: "Mind & Machine", subtitle: "AI meets philosophy — 13 essays", href: "/mind-and-machine", color: "#3B82F6", icon: "\u27D0" },
    { title: "The Policy Lab", subtitle: "Data-driven governance — 2 essays", href: "/policy-lab", color: "#D4A843", icon: "\u25C8" },
    { title: "The Proving Ground", subtitle: "Discipline & personal essays", href: "/proving-ground", color: "#E8593C", icon: "\u25B3" },
    { title: "The Late Compiler", subtitle: "Learn AI from zero — 5 tracks", href: "/the-late-compiler", color: "#10B981", icon: "\u25B7" },
    { title: "The Proving Ground", subtitle: "Discipline & personal essays", href: "/proving-ground", color: "#D4A843", icon: "\u25C7" },
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

function InlineNewsletterCTA() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div style={{ background: `${PILLARS[ARTICLE.section].color}06`, borderLeft: `3px solid ${PILLARS[ARTICLE.section].color}40`, borderRadius: "0 10px 10px 0", padding: "18px 24px", margin: "32px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      {!done ? (<>
        <span style={{ fontSize: 14, fontWeight: 500, color: T.charcoal }}>Enjoying this? Get essays like this biweekly.</span>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" aria-label="Email for inline signup" style={{ padding: "8px 14px", borderRadius: 6, border: `1px solid ${T.border}`, fontSize: 13, outline: "none", fontFamily: "'Source Sans 3', system-ui", width: 200 }} />
          <button onClick={() => { if (email.includes("@")) setDone(true); }} className="subscribe-btn" style={{ background: goldGrad, color: T.navy, border: "none", borderRadius: 6, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Subscribe</button>
        </div>
      </>) : (
        <span style={{ fontSize: 14, fontWeight: 600, color: PILLARS[ARTICLE.section].color }}>Welcome aboard. Check your inbox.</span>
      )}
    </div>
  );
}


function TableOfContents() {
  const headings = ARTICLE.body.filter(b => b.type === "heading");
  const [activeId, setActiveId] = useState("");
  useEffect(() => {
    const handleScroll = () => {
      const els = document.querySelectorAll("[data-toc-id]");
      let current = "";
      els.forEach(el => { if (el.getBoundingClientRect().top < 200) current = el.dataset.tocId; });
      setActiveId(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  if (headings.length < 3) return null;
  return (
    <Fade>
      <nav aria-label="Table of contents" style={{ background: T.warmWhite, borderRadius: 12, padding: "20px 24px", marginBottom: 40, border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>In this essay</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {headings.map((h, i) => {
            const id = h.text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <a key={i} href={`#${id}`} style={{ fontSize: 13, color: activeId === id ? PILLARS[ARTICLE.section].color : T.textMuted, fontWeight: activeId === id ? 600 : 400, textDecoration: "none", paddingLeft: 12, borderLeft: `2px solid ${activeId === id ? PILLARS[ARTICLE.section].color : "transparent"}`, transition: "all 0.2s", lineHeight: 1.5 }}>{h.text}</a>
            );
          })}
        </div>
      </nav>
    </Fade>
  );
}

/* ================================================================ ARTICLE-SPECIFIC COMPONENTS ================================================================ */

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById("article-body");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight;
      const read = Math.max(0, -rect.top);
      setProgress(Math.min(100, (read / (total - window.innerHeight * 0.5)) * 100));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const pillarColor = PILLARS[ARTICLE.section].color;
  return (<div style={{ position: "fixed", top: 64, left: 0, right: 0, height: 3, zIndex: 99 }} role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress"><div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${pillarColor}, ${pillarColor}88)`, transition: "width 0.15s ease-out" }} /></div>);
}

function ArticleHero() {
  const pillar = PILLARS[ARTICLE.section];
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => { const id = setTimeout(() => setIsLoaded(true), 80); return () => clearTimeout(id); }, []);
  const ent = (d) => ({ opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(22px)", transition: `opacity 0.65s cubic-bezier(.22,1,.36,1) ${d}s, transform 0.65s cubic-bezier(.22,1,.36,1) ${d}s` });
  const formattedDate = new Date(ARTICLE.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return (
    <header style={{ background: `linear-gradient(165deg, ${T.navy} 0%, ${T.navyLight} 50%, ${T.navyMid} 100%)`, position: "relative", overflow: "hidden", paddingTop: 130, paddingBottom: 72 }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", top: "-30%", right: "-15%", width: "55%", height: "160%", background: `radial-gradient(ellipse at center, ${pillar.color}08 0%, transparent 65%)` }} />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
        <div style={ent(0.1)}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, flexWrap: "wrap" }}><a href={pillar.hubPath} style={{ fontSize: 12, fontWeight: 600, color: pillar.color, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontFamily: "serif", fontSize: 14 }} aria-hidden="true">{pillar.icon}</span>{pillar.hub}</a><span style={{ color: "rgba(255,255,255,0.2)", fontSize: 14 }} aria-hidden="true">›</span><span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>{ARTICLE.sub}</span></div></div>
        <h1 style={{ ...ent(0.2), ...playfair, fontSize: "clamp(30px, 4.2vw, 46px)", color: "#fff", lineHeight: 1.18, letterSpacing: "-0.025em", margin: "0 0 24px" }}>{ARTICLE.title}</h1>
        <p style={{ ...ent(0.3), fontSize: 18, lineHeight: 1.75, color: "rgba(255,255,255,0.55)", margin: "0 0 32px", maxWidth: 620 }}>{ARTICLE.excerpt}</p>
        <div style={{ ...ent(0.4), display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: goldGrad, display: "flex", alignItems: "center", justifyContent: "center", ...playfair, fontSize: 14, color: T.navy }}>BP</div>
            <div><div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Dr. B.V.R.C. Purushottam, IAS</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>IAS · UC Berkeley</div></div>
          </div>
          <span style={{ width: 1, height: 28, background: "rgba(255,255,255,0.08)" }} aria-hidden="true" />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{formattedDate}</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>· {ARTICLE.readTime} read</span>
          {ARTICLE.featured && <span style={{ fontSize: 11, fontWeight: 600, color: T.gold, background: "rgba(212,168,67,0.12)", padding: "3px 10px", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>Cornerstone Essay</span>}
        </div>
      </div>
    </header>
  );
}

function TakeawaysCard() {
  const [isExpanded, setIsExpanded] = useState(true);
  const pillarColor = PILLARS[ARTICLE.section].color;
  return (
    <Fade><div style={{ background: "#fff", border: `1px solid ${pillarColor}18`, borderRadius: 16, overflow: "hidden", marginBottom: 48 }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${pillarColor}, ${pillarColor}40)` }} />
      <div style={{ padding: "24px 32px" }}>
        <button onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 28, height: 28, borderRadius: 7, background: `${pillarColor}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: pillarColor }} aria-hidden="true">◇</span><span style={{ fontSize: 14, fontWeight: 600, color: T.charcoal }}>In this essay — 3 things you'll learn</span></div>
          <span style={{ fontSize: 18, color: T.textMuted, transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} aria-hidden="true">⌄</span>
        </button>
        {isExpanded && (<div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14, paddingLeft: 38 }}>
          {ARTICLE.takeaways.map((takeaway, i) => (<div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}><span style={{ ...playfair, fontSize: 20, color: `${pillarColor}30`, lineHeight: 1, flexShrink: 0, minWidth: 20, textAlign: "right" }}>{i + 1}</span><p style={{ fontSize: 14.5, lineHeight: 1.7, color: T.textBody, margin: 0 }}>{takeaway}</p></div>))}
        </div>)}
      </div>
    </div></Fade>
  );
}

function ArticleBody() {
  const pillarColor = PILLARS[ARTICLE.section].color;
  return (
    <div id="article-body">
      {ARTICLE.body.map((block, i) => {
        if (block.type === "epigraph") return (<Fade key={i} delay={0.05}><blockquote style={{ ...playfair, fontSize: 20, fontWeight: 400, fontStyle: "italic", color: T.charcoal, lineHeight: 1.65, borderLeft: `3px solid ${pillarColor}40`, paddingLeft: 24, margin: "0 0 12px" }}>"{block.text}"</blockquote>{block.attribution && <p style={{ fontSize: 13, color: T.textMuted, paddingLeft: 28, margin: "0 0 48px", fontStyle: "italic" }}>{block.attribution}</p>}</Fade>);
        if (block.type === "heading") { const tocId = block.text.toLowerCase().replace(/[^a-z0-9]+/g, "-"); return (<Fade key={i}><h2 id={tocId} data-toc-id={tocId} style={{ ...playfair, fontSize: 26, lineHeight: 1.3, letterSpacing: "-0.02em", margin: "56px 0 20px", paddingTop: 8 }}>{block.text}</h2></Fade>); }
        if (block.type === "paragraph" && i === 3) return (<Fade key={i}><p style={{ fontSize: 17, lineHeight: 1.88, color: T.textBody, margin: "0 0 24px", letterSpacing: "0.005em" }}>{block.text}</p><InlineNewsletterCTA /></Fade>);
        if (block.type === "paragraph") return (<Fade key={i}><p style={{ fontSize: 17, lineHeight: 1.88, color: T.textBody, margin: "0 0 24px", letterSpacing: "0.005em" }}>{block.text}</p></Fade>);
        if (block.type === "callout") return (<Fade key={i}><div style={{ background: `${pillarColor}06`, borderLeft: `3px solid ${pillarColor}50`, borderRadius: "0 12px 12px 0", padding: "24px 28px", margin: "36px 0" }}><p style={{ fontSize: 16, lineHeight: 1.8, color: T.charcoal, fontWeight: 500, margin: 0 }}>{block.text}</p></div></Fade>);
        return null;
      })}
    </div>
  );
}

function ShareRow() {
  const [isCopied, setIsCopied] = useState(false);
  const pillarColor = PILLARS[ARTICLE.section].color;
  const url = `https://purushottam.com/insights/${ARTICLE.slug}`;
  const shareText = `${ARTICLE.title} — by Dr. Purushottam`;
  const handleCopy = () => { navigator.clipboard?.writeText(url).then(() => { setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }); };
  const shareLinks = [
    { label: "Twitter / X", icon: "𝕏", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, ariaLabel: "Share on Twitter" },
    { label: "LinkedIn", icon: "in", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, ariaLabel: "Share on LinkedIn" },
    { label: "WhatsApp", icon: "W", href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + url)}`, ariaLabel: "Share on WhatsApp" },
  ];
  return (
    <Fade><div style={{ padding: "28px 0 36px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginRight: 4 }}>Share</span>
      <button onClick={handleCopy} aria-label="Copy article link" className="pill-hover" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: isCopied ? pillarColor : T.textMuted, background: isCopied ? `${pillarColor}08` : T.cream, border: `1px solid ${isCopied ? pillarColor + "25" : T.border}`, borderRadius: 8, padding: "8px 14px", cursor: "pointer" }}>{isCopied ? "✓ Copied" : "⎘ Copy link"}</button>
      {shareLinks.map(shareLink => (<a key={shareLink.label} href={shareLink.href} target="_blank" rel="noopener noreferrer" aria-label={shareLink.ariaLabel} className="pill-hover" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: T.textMuted, background: T.cream, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 14px" }}><span style={{ fontWeight: 700, fontSize: 12, width: 18, textAlign: "center" }} aria-hidden="true">{shareLink.icon}</span>{shareLink.label}</a>))}
    </div></Fade>
  );
}

function AuthorCard() {
  return (
    <Fade><div style={{ background: T.cream, borderRadius: 16, padding: "32px 36px", display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 64, flexWrap: "wrap" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: goldGrad, display: "flex", alignItems: "center", justifyContent: "center", ...playfair, fontSize: 20, color: T.navy, flexShrink: 0 }}>BP</div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ ...playfair, fontSize: 18, marginBottom: 4 }}>Dr. B.V.R.C. Purushottam, IAS</div>
        <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 12 }}>IAS Officer · AI Researcher · Policy Architect</div>
        <p style={{ fontSize: 14.5, lineHeight: 1.7, color: T.textBody, margin: "0 0 16px" }}>16 years in India's administrative machinery. Now pioneering AI in governance, cooperative finance, and public policy — grounded in both data and dharma. Writing from Dehradun, in the foothills of the Himalayas.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><a href="/about" style={{ fontSize: 13, fontWeight: 600, color: T.gold, textDecoration: "none" }}>Full bio →</a><span style={{ color: T.border }}>·</span><a href="mailto:basava.ias@gmail.com" style={{ fontSize: 13, fontWeight: 500, color: T.textMuted, textDecoration: "none" }}>basava.ias@gmail.com</a></div>
      </div>
    </div></Fade>
  );
}

function RelatedArticles() {
  return (
    <section style={{ maxWidth: 1120, margin: "0 auto", padding: "0 1.5rem 80px" }}>
      <Fade><SectionHeader eyebrowText="Continue Reading" heading="You might also enjoy" /></Fade>
      <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {RELATED_ARTICLES.map((article, i) => {
          const pillar = PILLARS[article.section];
          return (
            <Fade key={article.slug} delay={0.08 * i}>
              <a href={`/insights/${article.slug}`} className="card-hover" style={{ background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ height: 3, background: `linear-gradient(90deg, ${pillar.color}, ${pillar.color}40)` }} />
                <div style={{ padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: pillar.color, background: `${pillar.color}10`, padding: "3px 9px", borderRadius: 5, letterSpacing: "0.08em", textTransform: "uppercase", alignSelf: "flex-start", marginBottom: 12 }}>{pillar.label}</span>
                  <h3 style={{ ...playfair, fontSize: 17, fontWeight: 600, lineHeight: 1.35, marginBottom: 10 }}>{article.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: T.textMuted, flex: 1, marginBottom: 14 }}>{article.excerpt}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
                    <span style={{ fontSize: 12, color: T.textMuted }}>{article.readTime}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: pillar.color }}>Read →</span>
                  </div>
                </div>
              </a>
            </Fade>
          );
        })}
      </div>
    </section>
  );
}

/* ================================================================ ARTICLE DETAIL PAGE EXPORT ================================================================ */
export default function ArticleDetailPage() {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', system-ui, sans-serif", color: T.charcoal, background: T.warmWhite, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{STYLES}</style>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <span id="main" />
      <ReadingProgress />
      <ArticleHero />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "56px 1.5rem 0" }}>
        <TakeawaysCard />
        <TableOfContents />
        <ArticleBody />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "32px 0", borderTop: `1px solid ${T.border}`, marginTop: 16 }}>
          {ARTICLE.tags.map(tag => (<span key={tag} style={{ fontSize: 12, fontWeight: 500, padding: "5px 14px", borderRadius: 20, background: T.cream, color: T.textMuted }}>{tag}</span>))}
        </div>
        <ShareRow />
        <AuthorCard />
      </main>
      <RelatedArticles />
      <ExploreMore exclude="Mind & Machine" />
      <NewsletterCTA variant="mind" />
      <Footer />
    </div>
  );
}
