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



/* ================================================================
   THE LATE COMPILER — Learning Hub
   purushottam.com/the-late-compiler
   
   Architecture:
   - Hero with philosophy statement
   - Track selector (5 tracks as sub-pages)  
   - Featured lesson (latest post)
   - Track detail sections with articles + YouTube embeds
   - Progress philosophy section
   - Newsletter CTA (mind variant)
   ================================================================ */

const ACCENT = "#10B981";  /* Green — growth, learning, fresh start */
const ACCENT_LIGHT = "#D1FAE5";

const TRACKS = [
  {
    id: "ai-fundamentals",
    title: "AI fundamentals",
    tagline: "What AI actually is — no jargon, no prerequisites",
    icon: "01",
    color: "#3B82F6",
    articleCount: 0,
    description: "Start from absolute zero — but don't stay there long. By the end of the first lesson, you'll have used an AI tool. We cover what AI is, how it works, and what it can do for you, with hands-on exercises in every post.",
    deepDive: { text: "Want the full history?", link: "/insights/ancient-dreams-thinking-machines", label: "Read: From Ancient Dreams to Thinking Machines" },
    articles: [
      { title: "What is AI, really? A plain-language guide for curious minds", type: "Blog", time: "8 min", slug: "what-is-ai-really", date: "Coming soon", status: "upcoming" },
      { title: "The 5 types of AI — and which ones actually matter today", type: "Blog", time: "10 min", slug: "five-types-of-ai", date: "Coming soon", status: "upcoming" },
    ],
    videos: [
      { title: "But what is a neural network?", author: "3Blue1Brown", duration: "19 min", url: "https://youtube.com/watch?v=aircAruvnKk", source: "external" },
      { title: "Machine learning explained in 100 seconds", author: "Fireship", duration: "2 min", url: "https://youtube.com/watch?v=PeMlggyqz0Y", source: "external" },
    ],
  },
  {
    id: "applied-ai",
    title: "Applied AI",
    tagline: "Using AI tools in your work and life — today",
    icon: "02",
    color: "#D4A843",
    articleCount: 0,
    description: "You don't need to build AI to use it well. Learn to use ChatGPT, Claude, Copilot, and other tools effectively — for writing, research, analysis, and decision-making. Practical, hands-on, no code required.",
    articles: [
      { title: "Your first hour with ChatGPT: a structured guide", type: "Blog", time: "12 min", slug: "first-hour-chatgpt", date: "Coming soon", status: "upcoming" },
      { title: "Prompt engineering is just clear thinking", type: "Blog", time: "15 min", slug: "prompt-engineering-clear-thinking", date: "Coming soon", status: "upcoming" },
    ],
    videos: [
      { title: "How to use AI as a thinking tool", author: "Dr. Purushottam", duration: "18 min", url: "#", source: "own" },
    ],
  },
  {
    id: "agentic-ai",
    title: "Agentic AI",
    tagline: "When AI doesn't just answer — it acts",
    icon: "03",
    color: "#8B5CF6",
    articleCount: 0,
    description: "The frontier of AI: systems that plan, execute, use tools, and complete multi-step tasks autonomously. Understand what agents are, how they work, and what they mean for governance, business, and society.",
    articles: [
      { title: "What is an AI agent? (And why should a bureaucrat care?)", type: "Blog", time: "10 min", slug: "what-is-ai-agent", date: "Coming soon", status: "upcoming" },
    ],
    videos: [],
  },
  {
    id: "machine-learning",
    title: "Machine learning",
    tagline: "The math and intuition behind how machines learn",
    icon: "04",
    color: "#E8593C",
    articleCount: 0,
    description: "Go deeper — but always with a practical anchor. Every concept is taught through a real problem: predicting crop yields, classifying documents, spotting patterns in data. You'll build working models, not just read about them.",
    deepDive: { text: "Want the mathematics?", link: "/insights/markov-brain", label: "Read: The Markov Brain in Mind & Machine" },
    articles: [
      { title: "Linear regression: the simplest ML model, explained from scratch", type: "Blog", time: "14 min", slug: "linear-regression-from-scratch", date: "Coming soon", status: "upcoming" },
    ],
    videos: [
      { title: "The spelled-out intro to neural networks", author: "Andrej Karpathy", duration: "2h 25m", url: "https://youtube.com/watch?v=VMj-3S1tku0", source: "external" },
      { title: "Attention is all you need — visualized", author: "3Blue1Brown", duration: "26 min", url: "https://youtube.com/watch?v=eMlx5fFNoYc", source: "external" },
    ],
  },
  {
    id: "python-for-beginners",
    title: "Python from zero",
    tagline: "Your first programming language — at any age",
    icon: "05",
    color: "#0EA5E9",
    articleCount: 0,
    description: "You're 40, or 50, or 60 — and you've never written a line of code. Perfect. You'll write your first working program in 10 minutes, not after 10 chapters. Every lesson produces something real: a script that renames your files, a tool that summarizes a PDF, a bot that sends you daily weather updates.",
    articles: [
      { title: "Hello, World — your first Python program (yes, really)", type: "Blog", time: "6 min", slug: "hello-world-python", date: "Coming soon", status: "upcoming" },
      { title: "Variables are just labelled boxes: Python basics for non-programmers", type: "Blog", time: "10 min", slug: "variables-labelled-boxes", date: "Coming soon", status: "upcoming" },
    ],
    videos: [
      { title: "Python for beginners (full course)", author: "Dr. Purushottam", duration: "45 min", url: "#", source: "own" },
      { title: "Learn Python in 1 hour", author: "Programming with Mosh", duration: "1h", url: "https://youtube.com/watch?v=kqtD5dpn9C8", source: "external" },
    ],
  },
];



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

function CommunityCard() {
  return (
    <Fade>
      <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${T.border}`, padding: "28px 32px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "#25D36612", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }} aria-hidden="true">W</div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ ...playfair, fontSize: 17, marginBottom: 4 }}>Join the learning community</div>
          <div style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.5 }}>Weekly discussions, doubt-clearing, and peer support on WhatsApp. 200+ learners and growing.</div>
        </div>
        <a href="https://chat.whatsapp.com/" target="_blank" rel="noopener noreferrer" className="pill-hover" style={{ fontSize: 14, fontWeight: 600, color: "#fff", background: "#25D366", padding: "12px 24px", borderRadius: 8 }} aria-label="Join WhatsApp learning community">Join on WhatsApp</a>
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
              {item.href ? <a href={item.href} style={{ color: T.textMuted, textDecoration: "none", transition: "color 0.2s" }} className="footer-link">{item.label}</a> : <span style={{ color: T.charcoal, fontWeight: 600 }}>{item.label}</span>}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ================================================================ COMPONENTS ================================================================ */

function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => { const id = setTimeout(() => setIsLoaded(true), 80); return () => clearTimeout(id); }, []);
  const ent = (d) => ({ opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${d}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${d}s` });
  return (
    <header style={{ background: `linear-gradient(165deg, ${T.navy} 0%, ${T.navyLight} 50%, ${T.navyMid} 100%)`, position: "relative", overflow: "hidden", paddingTop: 130, paddingBottom: 88 }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", top: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT}08 0%, transparent 65%)` }} />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
        <div style={ent(0.1)}>
          <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, background: `${ACCENT}15`, padding: "5px 14px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>Learning hub — new lessons weekly</span>
        </div>
        <h1 style={{ ...ent(0.2), ...playfair, fontSize: "clamp(36px, 4.5vw, 56px)", color: "#fff", lineHeight: 1.12, letterSpacing: "-0.025em", margin: "24px 0 20px" }}>
          The Late <span style={{ color: ACCENT }}>Compiler</span>
        </h1>
        <p style={{ ...ent(0.3), fontSize: 20, lineHeight: 1.75, color: "rgba(255,255,255,0.6)", maxWidth: 620, margin: "0 0 12px" }}>
          It's never too late to learn to think like a machine.
        </p>
        <p style={{ ...ent(0.35), fontSize: 16, lineHeight: 1.75, color: "rgba(255,255,255,0.4)", maxWidth: 600, margin: "0 0 36px" }}>
          AI, machine learning, Python, and agentic systems — explained for people who came to technology later in life. The focus here is applied, not theoretical: how to use these tools, not just understand them. Build something real from lesson one.
        </p>
        <div style={{ ...ent(0.45), display: "flex", gap: 32, flexWrap: "wrap" }}>
          {[["5", "Learning tracks"], ["~50", "Lessons planned"], ["1/week", "New content"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ ...playfair, fontSize: 26, color: ACCENT }}>{n}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

function Philosophy() {
  return (
    <section style={{ background: T.cream, padding: "56px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <Fade>
          <p style={{ ...playfair, fontSize: 20, fontWeight: 400, fontStyle: "italic", color: T.charcoal, lineHeight: 1.7, margin: "0 0 16px" }}>
            "A compiler translates human language into machine language. Some of us just started the translation a little later than others. That doesn't make the output any less powerful."
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: T.textMuted, margin: "0 0 16px" }}>
            Every lesson here ends with something you can do — a tool you can operate, a script you can run, a decision you can make better. The theory comes along for the ride, but the driver's seat belongs to application.
          </p>
          <p style={{ fontSize: 14, color: T.textMuted }}>— Dr. B.V.R.C. Purushottam, IAS</p>
        </Fade>
      </div>
    </section>
  );
}

function TrackSelector() {
  const [activeTrack, setActiveTrack] = useState(null);
  return (
    <section style={{ background: T.warmWhite, padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrowText="5 learning tracks" heading="Choose your path" align="center" /></Fade>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {TRACKS.map((track, i) => (
            <Fade key={track.id} delay={0.05 * i}>
              <div style={{ border: `1px solid ${activeTrack === track.id ? track.color + "30" : T.border}`, borderRadius: 16, overflow: "hidden", transition: "border-color 0.3s", background: "#fff" }}>
                <button
                  onClick={() => setActiveTrack(activeTrack === track.id ? null : track.id)}
                  aria-expanded={activeTrack === track.id}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 20, padding: "24px 28px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${track.color}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ ...playfair, fontSize: 18, color: track.color }}>{track.icon}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...playfair, fontSize: 20, marginBottom: 2 }}>{track.title}</div>
                    <div style={{ fontSize: 14, color: track.color, fontWeight: 600 }}>{track.tagline}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: T.textMuted }}>{track.articles.length + track.videos.length} items</span>
                    <span style={{ fontSize: 18, color: T.textMuted, transform: activeTrack === track.id ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} aria-hidden="true">&#8964;</span>
                  </div>
                </button>

                {activeTrack === track.id && (
                  <div style={{ padding: "0 28px 28px", borderTop: `1px solid ${T.border}` }}>
                    <p style={{ fontSize: 15, lineHeight: 1.75, color: T.textBody, margin: "20px 0 24px" }}>{track.description}</p>

                    {track.articles.length > 0 && (
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: track.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Articles & blogs</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {track.articles.map(article => (
                            <a key={article.slug} href={article.status === "upcoming" ? undefined : `/the-late-compiler/${track.id}/${article.slug}`} className="card-hover" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: T.warmWhite, opacity: article.status === "upcoming" ? 0.6 : 1, cursor: article.status === "upcoming" ? "default" : "pointer" }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ ...playfair, fontSize: 15, fontWeight: 600, lineHeight: 1.35, marginBottom: 3 }}>{article.title}</div>
                                <div style={{ fontSize: 12, color: T.textMuted }}>{article.type} · {article.time}</div>
                              </div>
                              <div style={{ flexShrink: 0, marginLeft: 16 }}>
                                {article.status === "upcoming"
                                  ? <span style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, background: T.cream, padding: "4px 12px", borderRadius: 20 }}>Coming soon</span>
                                  : <span style={{ fontSize: 14, color: track.color }}>&#8594;</span>
                                }
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {track.videos.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: track.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Video lessons</div>
                        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          {track.videos.map(video => (
                            <a key={video.title} href={video.url} target="_blank" rel="noopener noreferrer" className="card-hover" style={{ padding: "16px 20px", background: T.warmWhite, display: "flex", flexDirection: "column", gap: 8 }} aria-label={`Watch: ${video.title} by ${video.author}`}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: video.source === "own" ? `${track.color}12` : `${T.textMuted}08`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <span style={{ fontSize: 14, color: video.source === "own" ? track.color : T.textMuted }} aria-hidden="true">&#9654;</span>
                                </div>
                                <div>
                                  <div style={{ fontSize: 14, fontWeight: 600, color: T.charcoal, lineHeight: 1.35 }}>{video.title}</div>
                                  <div style={{ fontSize: 12, color: T.textMuted }}>{video.author} · {video.duration}</div>
                                </div>
                              </div>
                              {video.source === "own" && <span style={{ fontSize: 10, fontWeight: 700, color: track.color, background: `${track.color}10`, padding: "2px 8px", borderRadius: 4, alignSelf: "flex-start", letterSpacing: "0.06em", textTransform: "uppercase" }}>Dr. Purushottam</span>}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {track.deepDive && (
                      <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 10, background: "#3B82F608", border: "1px solid #3B82F615", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                        <span style={{ fontSize: 13, color: T.textBody }}>{track.deepDive.text}</span>
                        <a href={track.deepDive.link} style={{ fontSize: 13, fontWeight: 600, color: "#3B82F6", textDecoration: "none" }}>{track.deepDive.label} →</a>
                      </div>
                    )}
                    <div style={{ marginTop: 12, padding: "16px 20px", borderRadius: 10, background: `${track.color}06`, border: `1px solid ${track.color}15` }}>
                      <div style={{ fontSize: 13, color: track.color, fontWeight: 600 }}>This track is being built. Subscribe to get notified when new lessons drop.</div>
                    </div>
                  </div>
                )}
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}


function Syllabus() {
  const tracks = [
    { name: "AI Fundamentals", color: "#3B82F6", lessons: [
      { week: 1, title: "What is AI, really?", type: "Blog", status: "upcoming" },
      { week: 2, title: "Machine Learning vs Deep Learning vs AI", type: "Blog", status: "upcoming" },
      { week: 3, title: "How ChatGPT actually works", type: "Blog", status: "upcoming" },
    ]},
    { name: "Applied AI", color: T.gold, lessons: [
      { week: 1, title: "Your first hour with ChatGPT", type: "Blog", status: "upcoming" },
      { week: 2, title: "Prompt engineering for bureaucrats", type: "Blog", status: "upcoming" },
      { week: 3, title: "Building an AI workflow", type: "Blog", status: "upcoming" },
    ]},
    { name: "Agentic AI", color: "#8B5CF6", lessons: [
      { week: 1, title: "What is an AI agent?", type: "Blog", status: "upcoming" },
      { week: 2, title: "Building your first agent", type: "Blog", status: "upcoming" },
    ]},
    { name: "Machine Learning", color: "#E8593C", lessons: [
      { week: 1, title: "Linear regression from scratch", type: "Blog", status: "upcoming" },
      { week: 2, title: "Decision trees explained", type: "Blog", status: "upcoming" },
    ]},
    { name: "Python from Zero", color: "#0EA5E9", lessons: [
      { week: 1, title: "Hello, World — your first program", type: "Blog", status: "upcoming" },
      { week: 2, title: "Variables, types, and thinking like a computer", type: "Blog", status: "upcoming" },
    ]},
  ];
  const [activeTrack, setActiveTrack] = useState(0);
  const statusColors = { published: "#10B981", "this-week": "#3B82F6", upcoming: "#57534E" };
  return (
    <section style={{ background: "#fff", padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrowText="Course Roadmap" heading="Syllabus" align="center" /></Fade>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
          {tracks.map((track, i) => (
            <button key={track.name} onClick={() => setActiveTrack(i)} style={{ fontSize: 13, fontWeight: 600, color: i === activeTrack ? "#fff" : track.color, background: i === activeTrack ? track.color : `${track.color}10`, border: `1px solid ${track.color}30`, padding: "8px 20px", borderRadius: 40, cursor: "pointer", transition: "all 0.2s" }}>{track.name}</button>
          ))}
        </div>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {tracks[activeTrack].lessons.map((lesson, i) => (
            <Fade key={i} delay={0.04 * i}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", background: T.warmWhite, borderRadius: 10, border: `1px solid ${T.border}`, marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, minWidth: 48 }}>Week {lesson.week}</span>
                <span style={{ ...playfair, fontSize: 15, fontWeight: 600, flex: 1 }}>{lesson.title}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: statusColors[lesson.status] || "#57534E", background: `${statusColors[lesson.status] || "#57534E"}12`, padding: "3px 10px", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>{lesson.status}</span>
              </div>
            </Fade>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <a href="https://docs.google.com/spreadsheets" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: T.gold, textDecoration: "none" }}>View the full Google Sheet →</a>
        </div>
      </div>
    </section>
  );
}

function WhoIsThisFor() {
  const personas = [
    { label: "The curious Civil Servant", desc: "You've heard about AI in governance but never had time to learn the fundamentals.", color: T.gold },
    { label: "The 50-year-old professional", desc: "Your colleagues use ChatGPT. You want to understand what's actually happening under the hood.", color: "#3B82F6" },
    { label: "The parent or grandparent", desc: "Your children talk about machine learning. You want to talk back — intelligently.", color: "#8B5CF6" },

  ];
  return (
    <section style={{ background: "#fff", padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrowText="Who this is for" heading="You belong here if..." align="center" /></Fade>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {personas.map((p, i) => (
            <Fade key={p.label} delay={0.06 * i}>
              <div style={{ padding: "28px", borderRadius: 14, border: `1px solid ${T.border}`, background: T.warmWhite }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: p.color, marginBottom: 14 }} aria-hidden="true" />
                <h3 style={{ ...playfair, fontSize: 17, fontWeight: 600, margin: "0 0 8px", lineHeight: 1.35 }}>{p.label}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: T.textMuted, margin: 0 }}>{p.desc}</p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Pick a track", desc: "Choose based on what you want to do — use AI tools, write code, build models, or understand agents." },
    { n: "02", title: "Do first, understand second", desc: "Every lesson starts with a hands-on task. Theory arrives as explanation, not prerequisite. You'll touch real tools from day one." },
    { n: "03", title: "Go at your pace", desc: "No deadlines, no exams, no judgment. One article per week. Revisit as often as you need." },
    { n: "04", title: "Build a real portfolio", desc: "By the end of each track, you'll have built something — a working script, a trained model, or a tool you actually use." },
  ];
  return (
    <section style={{ background: T.cream, padding: "72px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrowText="How it works" heading="Learn by doing, not by reading" align="center" /></Fade>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 800, margin: "0 auto" }}>
          {steps.map((step, i) => (
            <Fade key={step.n} delay={0.06 * i}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ ...playfair, fontSize: 36, color: `${ACCENT}25`, lineHeight: 1, flexShrink: 0 }}>{step.n}</div>
                <div>
                  <h3 style={{ ...playfair, fontSize: 16, fontWeight: 600, margin: "0 0 6px" }}>{step.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: T.textMuted, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function UpcomingSchedule() {
  const upcoming = [
    { week: "Week 1", track: "AI fundamentals", title: "What is AI, really?", color: "#3B82F6" },
    { week: "Week 2", track: "Python from zero", title: "Hello, World — your first program", color: "#0EA5E9" },
    { week: "Week 3", track: "Applied AI", title: "Your first hour with ChatGPT", color: T.gold },
    { week: "Week 4", track: "Machine learning", title: "Linear regression from scratch", color: "#E8593C" },
    { week: "Week 5", track: "Agentic AI", title: "What is an AI agent?", color: "#8B5CF6" },

  ];
  return (
    <section style={{ background: T.warmWhite, padding: "72px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrowText="Publishing schedule" heading="What's coming next" /></Fade>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {upcoming.map((item, i) => (
            <Fade key={i} delay={0.04 * i}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "#fff", borderRadius: 10, border: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, minWidth: 56 }}>{item.week}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: item.color, background: `${item.color}10`, padding: "3px 10px", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{item.track}</span>
                <span style={{ ...playfair, fontSize: 15, fontWeight: 600, flex: 1, lineHeight: 1.35 }}>{item.title}</span>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}


/* LearnerTestimonials section removed per content audit */

function ClosingNote() {
  return (
    <section style={{ background: navyGrad, padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Fade>
          <span style={{ ...eyebrowSt, display: "block", marginBottom: 20 }}>A note from the teacher</span>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: "rgba(255,255,255,0.7)", margin: "0 0 20px" }}>
            At 49, I started learning machine learning and wrote my first Python script—now continuing that journey through a Postgraduate Certificate in Applied AI and Agentic AI from IIIT Bangalore via upGrad.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: "rgba(255,255,255,0.7)", margin: "0 0 20px" }}>
            I learned by doing, not by studying. That's the philosophy of The Late Compiler: every lesson is built around something you'll actually use. You won't sit through hours of theory before touching a real tool. You'll open ChatGPT in lesson one. You'll write working Python by lesson two. The theory arrives when you need it — as explanation for something you've already done, not as a prerequisite for something you haven't.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: "rgba(255,255,255,0.7)", margin: "0 0 20px" }}>
            The Late Compiler isn't about catching up. It's about compiling — translating the world's most powerful technology into something you can understand, use, and build with. The only prerequisite is <span style={{ color: "#D4A843" }}>curiosity</span>.
          </p>

        </Fade>
      </div>
    </section>
  );
}


/* ================================================================
   PAGE EXPORT — The Late Compiler
   ================================================================ */
/* ================================================================
   TODO (developer): Implement localStorage reading progress
   - Track read articles: localStorage.setItem('read_' + slug, Date.now())
   - Show checkmark on read articles in hub listing
   - Show "Continue reading" banner at top if last article was incomplete
   - Track scroll depth per article for progress bar
   ================================================================ */
export default function TheLateCompilerPage() {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', system-ui, sans-serif", color: T.charcoal, background: T.warmWhite, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{STYLES}</style>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <span id="main" />
      <Hero />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "The Late Compiler" }]} />
      <Philosophy />
      <TrackSelector />
      <Syllabus />
      <WhoIsThisFor />
      <HowItWorks />
      <UpcomingSchedule />
      <ClosingNote />
      <CommunityCard />
      <ExploreMore exclude="The Late Compiler" />
      <NewsletterCTA variant="mind" />
      <Footer />
    </div>
  );
}
