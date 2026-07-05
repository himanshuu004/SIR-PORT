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

function CommunityCard() {
  return (
    <Fade>
      <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${T.border}`, padding: "28px 32px", margin: "0 max(1.5rem, calc((100% - 1120px)/2))", marginBottom: 32, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
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


const CHANNELS = [
  { label: "Email", value: "basava.ias@gmail.com", icon: "✉", href: "mailto:basava.ias@gmail.com", color: "#D4A843" },
  { label: "LinkedIn", value: "linkedin.com/in/basava-purushottam", icon: "in", href: "https://linkedin.com/in/basava-purushottam-b862247", color: "#0A66C2" },
  { label: "Twitter / X", value: "@purushottam_ias", icon: "𝕏", href: "https://twitter.com", color: "#1C1917" },
  { label: "Facebook", value: "facebook.com/purushottam", icon: "f", href: "https://facebook.com", color: "#1877F2" },
];
const FAQ_ITEMS = [
  { q: "Are you available for speaking engagements?", a: "Yes — I speak on AI in governance, data-driven policy design, cooperative digitization, and the intersection of Indic philosophy and technology. Based in Dehradun, available for in-person and virtual events." },

  { q: "How do I submit a media inquiry?", a: "Select 'Media inquiry' in the contact form, or email basava.ias@gmail.com. Please include publication name, topic, and timeline. Views on this website are personal." },
  { q: "What's your typical response time?", a: "I aim to respond within 3–5 working days. Collaboration and advisory inquiries receive priority." },
];

function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", type: "collaboration", message: "" });
  const [isSent, setIsSent] = useState(false);
  const updateField = (key, value) => setFormData({ ...formData, [key]: value });
  const handleSubmit = useCallback((event) => { event.preventDefault(); setIsSent(true); }, []);
  const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: 10, border: `1px solid ${T.border}`, background: "#fff", fontSize: 15, color: T.charcoal, outline: "none", fontFamily: "'Source Sans 3', system-ui", transition: "border-color 0.2s", boxSizing: "border-box" };
  return (
    <section style={{ background: T.warmWhite }}>
      <div style={{ background: `linear-gradient(165deg, ${T.navy} 0%, ${T.navyLight} 100%)`, padding: "130px 0 100px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 1.5rem", textAlign: "center", position: "relative", zIndex: 1 }}>
          <Fade>
            <span style={{ ...eyebrowSt, display: "block", marginBottom: 16 }}>Contact</span>
            <h1 style={{ ...playfair, fontSize: "clamp(32px, 4vw, 46px)", color: "#fff", lineHeight: 1.18, margin: "0 0 16px" }}>Let's <em style={{ color: "#D4A843", fontStyle: "italic" }}>Connect</em></h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", margin: 0 }}>If you're working on AI in governance, policy reform, or the philosophy of technology — I want to hear about it.</p>
          </Fade>
        </div>
      </div>
      <div style={{ maxWidth: 640, margin: "-48px auto 0", padding: "0 1.5rem", position: "relative", zIndex: 2 }}>
        <Fade delay={0.15}>
          {!isSent ? (
            <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 20, border: `1px solid ${T.border}`, padding: "40px", boxShadow: "0 16px 48px rgba(0,0,0,0.04)" }}>
              <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div><label htmlFor="contact-name" style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Name</label><input id="contact-name" value={formData.name} onChange={e => updateField("name", e.target.value)} placeholder="Your name" required style={inputStyle} /></div>
                <div><label htmlFor="contact-email" style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Email</label><input id="contact-email" value={formData.email} onChange={e => updateField("email", e.target.value)} placeholder="your@email.com" type="email" required style={inputStyle} /></div>
              </div>
              <div style={{ marginBottom: 16 }}><label htmlFor="contact-type" style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Inquiry Type</label><select id="contact-type" value={formData.type} onChange={e => updateField("type", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}><option value="collaboration">Collaboration</option><option value="speaking">Speaking engagement</option><option value="advisory">Advisory role</option><option value="media">Media inquiry</option><option value="other">Other</option></select></div>
              {formData.type === "speaking" && (
                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div><label htmlFor="contact-date" style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Event date</label><input id="contact-date" type="date" style={inputStyle} /></div>
                  <div><label htmlFor="contact-audience" style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Audience size</label><input id="contact-audience" placeholder="e.g. 200" style={inputStyle} /></div>
                </div>
              )}
              {formData.type === "advisory" && (
                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div><label htmlFor="contact-org" style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Organization</label><input id="contact-org" placeholder="Your organization" style={inputStyle} /></div>
                  <div><label htmlFor="contact-domain" style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Domain</label><input id="contact-domain" placeholder="e.g. GovTech, Education" style={inputStyle} /></div>
                </div>
              )}
              {formData.type === "media" && (
                <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div><label htmlFor="contact-pub" style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Publication</label><input id="contact-pub" placeholder="Publication name" style={inputStyle} /></div>
                  <div><label htmlFor="contact-deadline" style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Deadline</label><input id="contact-deadline" type="date" style={inputStyle} /></div>
                </div>
              )}
              <div style={{ marginBottom: 24 }}><label htmlFor="contact-msg" style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Message</label><textarea id="contact-msg" value={formData.message} onChange={e => updateField("message", e.target.value)} placeholder="Tell me about what you're working on..." rows={5} required style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} /></div>
              <button type="submit" className="subscribe-btn" style={{ width: "100%", background: goldGrad, color: T.navy, border: "none", borderRadius: 10, padding: "15px", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>Send Message</button>
            </form>
          ) : (
            <div role="alert" style={{ background: "#fff", borderRadius: 20, border: `1px solid ${T.gold}20`, padding: "56px 40px", textAlign: "center", boxShadow: "0 16px 48px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 36, marginBottom: 16 }} aria-hidden="true">✉</div>
              <h3 style={{ ...playfair, fontSize: 22, margin: "0 0 10px" }}>Message sent</h3>
              <p style={{ fontSize: 15, color: T.textMuted }}>I'll respond within a few days. Thank you for reaching out.</p>
            </div>
          )}
        </Fade>
      </div>
    </section>
  );
}
function DirectChannels() {
  return (
    <section style={{ background: T.warmWhite, padding: "72px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Fade><h2 style={{ ...playfair, fontSize: 22, margin: "0 0 24px", textAlign: "center" }}>Or reach out directly</h2></Fade>
        <div className="channel-grid two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {CHANNELS.map((ch, i) => (
            <Fade key={ch.label} delay={0.05 * i}>
              <a href={ch.href} className="card-hover" style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", background: "#fff" }} target="_blank" rel="noopener noreferrer" aria-label={`${ch.label}: ${ch.value}`}>
                <span style={{ width: 36, height: 36, borderRadius: 8, background: `${ch.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: ch.color, flexShrink: 0 }} aria-hidden="true">{ch.icon}</span>
                <div><div style={{ fontSize: 13, fontWeight: 600, color: T.charcoal }}>{ch.label}</div><div style={{ fontSize: 12, color: T.textMuted }}>{ch.value}</div></div>
              </a>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section style={{ background: "#fff", padding: "72px max(1.5rem, calc((100% - 1120px)/2))" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Fade><h2 style={{ ...playfair, fontSize: 22, margin: "0 0 28px", textAlign: "center" }}>Frequently asked</h2></Fade>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQ_ITEMS.map((item, i) => (
            <Fade key={i} delay={0.04 * i}>
              <div style={{ border: `1px solid ${openIndex === i ? T.gold + "25" : T.border}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s" }}>
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} aria-expanded={openIndex === i} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", background: openIndex === i ? `${T.gold}04` : T.warmWhite, border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.2s" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: T.charcoal }}>{item.q}</span>
                  <span style={{ fontSize: 18, color: T.textMuted, transform: openIndex === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0, marginLeft: 16 }} aria-hidden="true">⌄</span>
                </button>
                {openIndex === i && <div style={{ padding: "0 22px 18px" }}><p style={{ fontSize: 14.5, lineHeight: 1.75, color: T.textBody, margin: 0 }}>{item.a}</p></div>}
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', system-ui, sans-serif", color: T.charcoal, background: T.warmWhite, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{STYLES}</style>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <span id="main" />
      <ContactForm />
      <DirectChannels />
      <FAQ />
      <CommunityCard />
      <ExploreMore exclude="" />
      <NewsletterCTA variant="general" />
      <Footer />
    </div>
  );
}
