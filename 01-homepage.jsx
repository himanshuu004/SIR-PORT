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
  @media (min-width: 1025px) { .four-col { grid-template-columns: repeat(4, 1fr) !important; } }
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
  const copy = { mind: { h: "Get the next essay on mind, machine, and meaning", d: "Essays at the intersection of AI, philosophy, and Indian governance. No promotional content." }, policy: { h: "Data-driven governance analysis. Weekly. No fluff.", d: "Policy frameworks, implementation reports, and probabilistic thinking — from inside the Indian Administrative Service." }, general: { h: "If this resonated — here's where it continues", d: "Essays on AI, governance, decision-making, neuroscience, and reflective thought—by a serving IAS officer. Unsubscribe anytime." } }[variant];
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

const HERO_STATS = [{ value: "23+", label: "Years in Service" }, { value: "5", label: "Union Ministries Served" }, { value: "10M+", label: "Citizens Served" }, { value: "1", label: "State Being Served" }];
/* StartHere section removed per content audit */
const PILLAR_CARDS = [{ icon: "⟐", color: "#3B82F6", label: "AI, ML & DL for Governance", line: "Leveraging AI, Machine Learning, and Deep Learning to Reimagine Governance, Policy Architecture, and Personal Thought.", href: "/mind-and-machine" }, { icon: "◈", color: "#D4A843", label: "The Policy Lab", line: "Data-Driven Policy Thinking, Design, and Execution.", href: "/policy-lab" }, { icon: "◉", color: "#8B5CF6", label: "Philosophy of Mind", line: "Eastern Wisdom Meets Cognitive Science: The Examined Life of a Decision-Maker.", href: "/mind-and-machine" }, { icon: "◈", color: "#E8593C", label: "The Proving Ground", line: "Projects that Made a Difference—and Mattered to Me.", href: "/proving-ground" }];
const FEATURED_ARTICLES = [{ pillar: "Philosophy of Mind", color: "#8B5CF6", title: "The Markov Brain: Rewiring Neural Pathways Through Habit", excerpt: "How Markov chains explain the mathematics of habit formation, and what this means for personal transformation.", time: "15 min", date: "Feb 2026", slug: "markov-brain" }, { pillar: "How Not to Get Carried Away", color: "#3B82F6", title: "When the Mirror Speaks: The Barnum Effect in AI Systems", excerpt: "Why AI systems that flatter us are more dangerous than ones that challenge us — and be aware of the language of LLMs.", time: "8 min", date: "Jan 2026", slug: "barnum-effect-ai" }, { pillar: "AI Foundations", color: "#10B981", title: "From Ancient Dreams to Thinking Machines", excerpt: "A 3,000-year history of humanity's desire to create artificial minds — from Hephaestus's bronze giant to transformer architectures.", time: "20 min", date: "Dec 2025", slug: "ancient-dreams-thinking-machines" }];
const TESTIMONIAL_QUOTES = [
  { text: "Purushottam Basava is an upright career IAS officer, hardworking, honest, and follows processes with absolute due diligence, while at the same time kind, helpful, and humane in approach. He draws his strength from his deep-rooted spiritual moorings. I have had several occasions when we discussed issues of governance and improvement in the quality of technical education, and found that he gives fresh innovative ideas based on scientific rationale which are practical and down to earth.", name: "Shri Anil Sahasrabudhe", role: "Former Chairman AICTE, Chairman of National Educational Technology Forum, Chairman EC NAAC & Chairman NBA" },
  { text: "Mr Purshottam, whom I have known for the last 2 years, is a very hard-working, intelligent and outstanding officer. He has a deep understanding of policy-making and policy issues. He has excellent coordination and administrative abilities. He gave excellent inputs for the finalisation of the National Education Policy 2020 and its implementation plan, SARTHAQ.", name: "Shri Maneesh Garg, IAS", role: "Former Joint Secretary, Ministry of Education, Government of India — Present Senior Deputy Election Commissioner" },
  { text: "I have been interacting with Mr Basava Purushottam in the Education Ministry during the last few years. I found him to be a very conscientious and committed professional. He is a very supportive and pleasant person. His engagement with various stakeholders within the ministry has been outstanding. His role in making and implementing the National Education Policy 2020 is remarkable.", name: "Dr Mamidala Jagadesh Kumar", role: "Former Chairman, University Grants Commission" },
  { text: "I know him when we were trying to revive SpiceJet in 2015. He was very helpful to us. Purushottam is an honest and upright officer and we need more officers like him in public life.", name: "Shri Ajay Singh", role: "Chairman & Managing Director, SpiceJet Ltd" },
  { text: "One of the best officers of the service. He brought quiet efficiency and impeccable order to the Ministry of Education as PS to the Minister. His abilities to remain cool during crisis, manage time, empathy for the marginalized and thoroughness are worthy of emulation.", name: "R Subrahmanyam", role: "Former Secretary to Government of India (Higher Education and Social Justice)" },
  { text: "Mr Basava Purushottam is a proactive, positive and conscientious officer and an admirable person, as observed during the past two years of my association with the Union Ministry of Education and wish him a bright future.", name: "Radhakrishnan Koppillil", role: "Ex. Chairman Space Commission / Secretary Dept. of Space / Chairman ISRO (2009-2014)" },
  { text: "I have seen the work of Dr Purushottam for the last two years. He has a lot of passion for the education sector. His ability to collaborate with various stakeholders is phenomenal. His communication skills helped NEP gain acceptance from many stakeholders. He has been very helpful to IIT Kharagpur and its alumni.", name: "Virendra Tewari", role: "Former Director, Indian Institute of Technology Kharagpur" },
];


/* ================================================================ PAGE-SPECIFIC COMPONENTS ================================================================ */

function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => { const id = setTimeout(() => setIsLoaded(true), 80); return () => clearTimeout(id); }, []);
  const ent = (d) => ({ opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${d}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${d}s` });
  return (
    <section style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${T.navy} 0%, ${T.navyLight} 60%, #1a2d4e 100%)`, display: "flex", alignItems: "center", padding: "0 max(1.5rem, calc((100% - 1120px)/2))", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)", backgroundSize: "48px 48px" }} />
      <div style={{ position: "absolute", top: "20%", right: "8%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 70%)" }} />
      <div className="hero-grid" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: 80, alignItems: "center", position: "relative", zIndex: 1, width: "100%", paddingTop: 80, paddingBottom: 80 }}>
        <div>
          <div style={ent(0.1)}><span style={{ ...eyebrowSt, letterSpacing: "0.12em", display: "block", marginBottom: 20 }}>Senior Civil Servant · AI Practitioner · Policy Architect · Philosophy & Neuroscience Writer</span></div>
          <h1 style={{ ...ent(0.25), ...playfair, fontSize: "clamp(36px, 4.5vw, 58px)", color: "#fff", lineHeight: 1.12, letterSpacing: "-0.025em", margin: "0 0 20px" }}>Bridging <em style={{ color: T.gold, fontStyle: "italic" }}>Algorithmic</em><br />Intelligence with<br />Indian Governance</h1>
          <p style={{ ...ent(0.35), fontSize: 16, lineHeight: 1.75, color: "rgba(255,255,255,0.48)", maxWidth: 520, margin: "0 0 32px" }}>A civil servant's notebook on AI, philosophy of mind, and the art of governing 1.4 billion people.</p>
          <div style={{ ...ent(0.45), display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="/mind-and-machine" style={{ fontSize: 15, fontWeight: 600, color: T.navy, background: goldGrad, padding: "14px 32px", borderRadius: 8, textDecoration: "none" }}>Read My Insights</a>
            <a href="/about" style={{ fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "14px 32px", borderRadius: 8, textDecoration: "none" }}>My Story →</a>
          </div>
          <div style={{ ...ent(0.6), display: "flex", gap: 40, marginTop: 48, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
            {HERO_STATS.map(stat => (<div key={stat.label}><div style={{ ...playfair, fontSize: 28, color: T.gold }}>{stat.value}</div><div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 4 }}>{stat.label}</div></div>))}
          </div>
        </div>
        <div className="hero-portrait" style={ent(0.4)}>
          <div style={{ width: 340, height: 420, borderRadius: 24, background: `linear-gradient(145deg, ${T.navyMid}, #1e3456)`, border: "1px solid rgba(212,168,67,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <div style={{ width: 96, height: 96, borderRadius: "50%", background: goldGrad, display: "flex", alignItems: "center", justifyContent: "center", ...playfair, fontSize: 32, color: T.navy }}>BP</div>
            <div style={{ ...playfair, fontSize: 18, color: "#fff" }}>Dr. B.V.R.C. Purushottam</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>IAS · UC Berkeley · Uttarakhand</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* StartHere component removed per content audit */

function Pillars() {
  return (
    <section id="pillars" style={{ background: T.warmWhite, padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade><SectionHeader eyebrowText="What I write about" heading="Four Intellectual Territories" align="center" /></Fade>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {PILLAR_CARDS.map((pillar, i) => (
            <Fade key={pillar.label} delay={i * 0.1}>
              <a href={pillar.href} className="card-hover" style={{ background: "#fff", padding: "28px 28px 24px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: pillar.color + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: pillar.color, marginBottom: 16, fontFamily: "serif" }} aria-hidden="true">{pillar.icon}</div>
                <div style={{ ...playfair, fontSize: 17, marginBottom: 8, lineHeight: 1.3 }}>{pillar.label}</div>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: T.textMuted, margin: "0 0 16px" }}>{pillar.line}</p>
                <span style={{ fontSize: 13, fontWeight: 600, color: pillar.color }}>Explore essays →</span>
              </a>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedInsights() {
  return (
    <section style={{ background: "#fff", padding: "80px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div><span style={eyebrowSt}>Selected Essays</span><div style={{ display: "flex", alignItems: "center", gap: 10, margin: "10px 0 0" }}><h2 style={{ ...playfair, fontSize: 30, margin: 0 }}>Featured Insights</h2><span style={{ fontSize: 10, fontWeight: 600, color: "#10B981", background: "#10B98112", padding: "3px 10px", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>Updated weekly</span></div></div>
            <a href="/mind-and-machine" style={{ fontSize: 14, fontWeight: 600, color: T.gold, textDecoration: "none" }}>View all essays →</a>
          </div>
        </Fade>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {FEATURED_ARTICLES.map((article, i) => (
            <Fade key={article.title} delay={i * 0.1}>
              <a href={`/insights/${article.slug}`} className="card-hover" style={{ overflow: "hidden", display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ height: 3, background: `linear-gradient(to right, ${article.color}, ${article.color}60)` }} />
                <div style={{ padding: "24px 24px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: article.color, background: article.color + "12", padding: "3px 10px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.08em", alignSelf: "flex-start", marginBottom: 14 }}>{article.pillar}</span>
                  <h3 style={{ ...playfair, fontSize: 18, fontWeight: 600, margin: "0 0 12px", lineHeight: 1.35 }}>{article.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: T.textMuted, margin: "0 0 20px", flex: 1 }}>{article.excerpt}</p>
                  <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: T.textMuted }}>{article.date} · {article.time}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: article.color }}>Read →</span>
                  </div>
                </div>
              </a>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function MediaSpotlight() {
  return (
    <section style={{ background: T.cream, padding: "72px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <SectionHeader eyebrowText="In the Press" heading="Media Spotlight" />
            <a href="/about" style={{ fontSize: 13, fontWeight: 600, color: T.gold, textDecoration: "none" }}>See all press →</a>
          </div>
        </Fade>
        <Fade delay={0.1}>
          <div className="spotlight-grid" style={{ background: "#fff", borderRadius: 16, border: `1px solid ${T.border}`, padding: "32px 36px", display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 8 }}>Garhwal Post · May 2025</div>
              <h3 style={{ ...playfair, fontSize: 20, margin: "0 0 10px", lineHeight: 1.35 }}>Senior IAS Officer BVRC Purushottam — A Profile in Governance Innovation</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: T.textMuted, margin: "0 0 16px" }}>Feature on cooperative digitization work, policy architecture across five Union Ministries, and institutional leadership in Uttarakhand.</p>
              <a href="/about" style={{ fontSize: 13, fontWeight: 600, color: T.gold, textDecoration: "none" }}>Read feature →</a>
            </div>
            <div className="spotlight-thumb" style={{ width: 160, height: 120, borderRadius: 10, background: `linear-gradient(135deg, ${T.cream}, #e8e4dd)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 32, opacity: 0.2 }} aria-hidden="true">📰</span>
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
}

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => { if (isPaused) return; const timer = setInterval(() => { setActiveIndex(prev => (prev + 1) % TESTIMONIAL_QUOTES.length); }, 5000); return () => clearInterval(timer); }, [isPaused]);
  const currentQuote = TESTIMONIAL_QUOTES[activeIndex];
  return (
    <section style={{ background: T.warmWhite, padding: "100px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <Fade><SectionHeader eyebrowText="Peer Recognition" heading="What colleagues say" align="center" /></Fade>
        <div style={{ background: T.cream, borderRadius: 20, padding: "48px 52px", minHeight: 220, cursor: "default" }} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} role="region" aria-label="Testimonials carousel" aria-live="polite">
          <div style={{ fontSize: 48, color: T.gold, lineHeight: 1, marginBottom: 24, fontFamily: "serif" }} aria-hidden="true">“</div>
          <p key={activeIndex} style={{ ...playfair, fontSize: 18, fontWeight: 400, color: T.charcoal, lineHeight: 1.7, margin: "0 0 28px", fontStyle: "italic" }}>{currentQuote.text}</p>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.textBody }}>{currentQuote.name}</div>
          <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>{currentQuote.role}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }} role="tablist" aria-label="Testimonial navigation">
          {TESTIMONIAL_QUOTES.map((_, i) => (<button key={i} onClick={() => setActiveIndex(i)} style={{ width: 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", background: i === activeIndex ? T.gold : "rgba(44,44,42,0.15)", transition: "all 0.3s" }} role="tab" aria-selected={i === activeIndex} aria-label={`Show testimonial ${i + 1}`} />))}
        </div>
      </div>
    </section>
  );
}


function LearnWithMe() {
  return (
    <section style={{ background: "#fff", padding: "72px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <a href="/the-late-compiler" className="card-hover" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center", padding: "40px 44px", background: "#10B98108", borderColor: "#10B98118", borderRadius: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #10B981, #10B98140)" }} />
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", background: "#10B98112", padding: "4px 12px", borderRadius: 20, letterSpacing: "0.08em", textTransform: "uppercase", display: "inline-block", marginBottom: 14 }}>New — learning hub</span>
              <h3 style={{ ...playfair, fontSize: 24, margin: "0 0 10px", lineHeight: 1.3 }}>The Late Compiler</h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: T.textMuted, margin: "0 0 14px", maxWidth: 520 }}>AI, Python & Machine Learning — Applied-First Learning for Late Entrants. Weekly Lessons.</p>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#10B981" }}>Start learning →</span>
            </div>
            <div style={{ width: 100, height: 100, borderRadius: 20, background: "#10B98110", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ ...playfair, fontSize: 36, color: "#10B981", opacity: 0.5 }} aria-hidden="true">{`</`}</span>
            </div>
          </a>
        </Fade>
      </div>
    </section>
  );
}

/* ================================================================
   PAGE EXPORT — Home
   Font link: add to index.html <head> or use next/font
   ================================================================ */
export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', system-ui, sans-serif", color: T.charcoal, background: T.warmWhite, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{STYLES}</style>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <span id="main" />
      <Hero />
      <Pillars />
      <FeaturedInsights />
      <LearnWithMe />
      <MediaSpotlight />
      <Testimonials />
      <NewsletterCTA variant="general" />
      <Footer />
    </div>
  );
}
