"use client";
import { useState, useRef, useEffect } from "react";
import Nav from "../../components/Nav";
import BottomSection from "../../components/BottomSection";
import HeroBackground from "../../components/HeroBackground";
import { T, playfair, eyebrowSt, containerStyle, goldGrad } from "../../lib/theme";
import Fade from "../../components/Fade";

/* ── CSS ──────────────────────────────────────────────────────────── */
const STYLES = `
  .ct-card { text-decoration:none; display:flex; align-items:center; gap:14px; padding:18px 20px; background:#fff; border:1px solid rgba(28,25,23,0.08); border-radius:14px; transition:all 0.25s; color:inherit; }
  .ct-card:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,0.07); }
  .ct-input { width:100%; padding:13px 16px; border-radius:10px; border:1.5px solid rgba(28,25,23,0.12); background:#fff; font-size:15px; color:var(--charcoal); outline:none; font-family:inherit; transition:border-color 0.2s; box-sizing:border-box; }
  .ct-input:focus { border-color:var(--gold); }
  .ct-input.error { border-color:#EF4444; }
  .ct-faq-btn { width:100%; display:flex; align-items:center; justify-content:space-between; padding:16px 20px; background:none; border:none; cursor:pointer; text-align:left; transition:background 0.2s; }
  .ct-faq-btn:hover { background:rgba(28,25,23,0.02); }
  .ct-explore { text-decoration:none; display:flex; align-items:center; gap:14px; padding:18px 22px; background:#fff; border-radius:14px; border:1px solid rgba(28,25,23,0.07); transition:all 0.25s; color:inherit; position:relative; overflow:hidden; }
  .ct-explore:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,0.07); }
  @media(max-width:640px) { .two-col-form{ grid-template-columns:1fr!important; } .two-col-ch{ grid-template-columns:1fr!important; } .three-col{ grid-template-columns:1fr!important; } }
`;

/* ── Fade ─────────────────────────────────────────────────────────── */
/* ── Label ────────────────────────────────────────────────────────── */
function Label({ htmlFor, text }) {
  return (
    <label htmlFor={htmlFor} style={{ fontSize: 12, fontWeight: 700, color: "#78716C", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
      {text}
    </label>
  );
}

/* ── Contact Form ─────────────────────────────────────────────────── */
const INQUIRY_TYPES = [
  { value: "collaboration", label: "Collaboration" },
  { value: "speaking",      label: "Speaking engagement" },
  { value: "advisory",      label: "Advisory role" },
  { value: "media",         label: "Media inquiry" },
  { value: "other",         label: "Other" },
];

function ContactForm() {
  const [form, setForm]     = useState({ name: "", email: "", type: "collaboration", message: "", date: "", audience: "", org: "", domain: "", publication: "", deadline: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState("");

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, _gotcha: "" }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setErrMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  const inputCls = (k) => `ct-input${status === "error" && !form[k] ? " error" : ""}`;

  if (status === "success") {
    return (
      <div role="alert" style={{ background: "#fff", borderRadius: 20, border: "1px solid color-mix(in srgb, var(--gold) 14%, transparent)", padding: "56px 40px", textAlign: "center", boxShadow: "0 16px 48px rgba(0,0,0,0.04)" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✉️</div>
        <h3 style={{ ...playfair, fontSize: 22, margin: "0 0 10px" }}>Message sent</h3>
        <p style={{ fontSize: 15, color: "#78716C", margin: "0 0 20px" }}>I'll respond within 3–5 working days. Thank you for reaching out.</p>
        <button onClick={() => { setStatus("idle"); setForm({ name:"",email:"",type:"collaboration",message:"",date:"",audience:"",org:"",domain:"",publication:"",deadline:"" }); }}
          style={{ fontSize: 13, fontWeight: 600, color: "#0F766E", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 20, border: "1px solid var(--border)", padding: "40px", boxShadow: "0 16px 48px rgba(0,0,0,0.04)" }} noValidate>
      {/* Honeypot — hidden from real users, bots fill it */}
      <input name="_gotcha" type="text" tabIndex={-1} aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0 }} />

      {/* Name + Email */}
      <div className="two-col-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <Label htmlFor="ct-name" text="Name *" />
          <input id="ct-name" value={form.name} onChange={set("name")} placeholder="Your name" required className={inputCls("name")} />
        </div>
        <div>
          <Label htmlFor="ct-email" text="Email *" />
          <input id="ct-email" type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" required className={inputCls("email")} />
        </div>
      </div>

      {/* Inquiry type */}
      <div style={{ marginBottom: 16 }}>
        <Label htmlFor="ct-type" text="Inquiry Type" />
        <select id="ct-type" value={form.type} onChange={set("type")} className="ct-input" style={{ cursor: "pointer" }}>
          {INQUIRY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Conditional speaking fields */}
      {form.type === "speaking" && (
        <div className="two-col-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div><Label htmlFor="ct-date" text="Event Date" /><input id="ct-date" type="date" value={form.date} onChange={set("date")} className="ct-input" /></div>
          <div><Label htmlFor="ct-audience" text="Audience Size" /><input id="ct-audience" value={form.audience} onChange={set("audience")} placeholder="e.g. 200" className="ct-input" /></div>
        </div>
      )}

      {/* Conditional advisory fields */}
      {form.type === "advisory" && (
        <div className="two-col-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div><Label htmlFor="ct-org" text="Organisation" /><input id="ct-org" value={form.org} onChange={set("org")} placeholder="Your organisation" className="ct-input" /></div>
          <div><Label htmlFor="ct-domain" text="Domain" /><input id="ct-domain" value={form.domain} onChange={set("domain")} placeholder="e.g. GovTech, Education" className="ct-input" /></div>
        </div>
      )}

      {/* Conditional media fields */}
      {form.type === "media" && (
        <div className="two-col-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div><Label htmlFor="ct-pub" text="Publication" /><input id="ct-pub" value={form.publication} onChange={set("publication")} placeholder="Publication name" className="ct-input" /></div>
          <div><Label htmlFor="ct-deadline" text="Deadline" /><input id="ct-deadline" type="date" value={form.deadline} onChange={set("deadline")} className="ct-input" /></div>
        </div>
      )}

      {/* Message */}
      <div style={{ marginBottom: 20 }}>
        <Label htmlFor="ct-msg" text="Message *" />
        <textarea id="ct-msg" value={form.message} onChange={set("message")} placeholder="Tell me about what you're working on..." rows={5} required className={`ct-input${!form.message && status === "error" ? " error" : ""}`} style={{ resize: "vertical", lineHeight: 1.65 }} />
      </div>

      {/* Error banner */}
      {status === "error" && errMsg && (
        <div role="alert" style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#991B1B" }}>
          {errMsg}
        </div>
      )}

      {/* Submit */}
      <button type="submit" disabled={status === "loading"}
        style={{ width: "100%", background: status === "loading" ? "var(--text-subtle)" : "var(--grad-gold)", color: "#0F1A2E", border: "none", borderRadius: 10, padding: "15px", fontSize: 16, fontWeight: 700, cursor: status === "loading" ? "not-allowed" : "pointer", transition: "all 0.2s", letterSpacing: "0.01em" }}>
        {status === "loading" ? "Sending…" : "Send Message →"}
      </button>

      <p style={{ fontSize: 12, color: "var(--text-subtle)", textAlign: "center", marginTop: 12, marginBottom: 0 }}>
        Typical response time: 3–5 working days
      </p>
    </form>
  );
}

/* ── Direct channels ──────────────────────────────────────────────── */
const CHANNELS = [
  { label: "Email",       value: "basava.ias@gmail.com",              icon: "✉",  href: "mailto:basava.ias@gmail.com",                               color: "#14B8A6" },
  { label: "LinkedIn",    value: "linkedin.com/in/basava-purushottam", icon: "in", href: "https://linkedin.com/in/basava-purushottam-b862247",        color: "#0A66C2" },
  { label: "Twitter / X", value: "@basava_ias",                        icon: "𝕏",  href: "https://x.com/basava_ias",                                  color: "#1C1917" },
  { label: "Facebook",    value: "facebook.com/basava.ias",            icon: "f",  href: "https://www.facebook.com/basava.ias",                        color: "#1877F2" },
];

function DirectChannels() {
  return (
    <section style={{ background: "#FAFAF8", padding: "64px max(1.5rem,calc((100% - 640px)/2))" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Fade><h2 style={{ ...playfair, fontSize: 22, margin: "0 0 20px", textAlign: "center" }}>Or reach out directly</h2></Fade>
        <div className="two-col-ch" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {CHANNELS.map((ch, i) => (
            <Fade key={ch.label} delay={0.05 * i}>
              <a href={ch.href} className="ct-card" target={ch.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" aria-label={`${ch.label}: ${ch.value}`}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: `${ch.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: ch.color, flexShrink: 0 }}>{ch.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1C1917" }}>{ch.label}</div>
                  <div style={{ fontSize: 12, color: "#78716C" }}>{ch.value}</div>
                </div>
              </a>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────────────────────────── */
const FAQ = [
  { q: "Are you available for speaking engagements?", a: "Yes — I speak on AI in governance, data-driven policy design, cooperative digitization, and the intersection of Indic philosophy and technology. Based in Dehradun, available for in-person and virtual events." },
  { q: "How do I submit a media inquiry?", a: "Select 'Media inquiry' in the contact form, or email basava.ias@gmail.com directly. Please include publication name, topic, and timeline. Views on this website are personal." },
  { q: "What's your typical response time?", a: "I aim to respond within 3–5 working days. Collaboration and advisory inquiries receive priority." },
  { q: "Are you open to advisory roles?", a: "Yes, particularly in the areas of GovTech, AI policy, education reform, and cooperative economics. Please use the Advisory inquiry type in the form." },
];

function FaqSection() {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ background: "#fff", padding: "64px max(1.5rem,calc((100% - 640px)/2))" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Fade><h2 style={{ ...playfair, fontSize: 22, margin: "0 0 24px", textAlign: "center" }}>Frequently asked</h2></Fade>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQ.map((item, i) => (
            <Fade key={i} delay={0.04 * i}>
              <div style={{ border: open === i ? "1px solid color-mix(in srgb, var(--gold) 16%, transparent)" : "1px solid var(--border)", borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s" }}>
                <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="ct-faq-btn"
                  style={{ background: open === i ? "color-mix(in srgb, var(--gold) 2%, transparent)" : "#FAFAF8" }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#1C1917", paddingRight: 16 }}>{item.q}</span>
                  <span style={{ fontSize: 18, color: "#78716C", transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.25s", flexShrink: 0 }}>⌄</span>
                </button>
                {open === i && (
                  <div style={{ padding: "0 20px 18px" }}>
                    <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "#44403C", margin: 0 }}>{item.a}</p>
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

/* ── Explore ──────────────────────────────────────────────────────── */
const EXPLORE = [
  { title: "Mind & Machine",    sub: "AI meets philosophy",             href: "/mind-and-machine", color: "#3B82F6", icon: "⟐" },
  { title: "Philosophy",        sub: "Sacred texts & essays",           href: "/philosophy",        color: "#8B5CF6", icon: "☸" },
  { title: "The Late Compiler", sub: "Learn AI from zero — 5 tracks",  href: "/the-late-compiler", color: "#10B981", icon: "▷" },
];

function Explore() {
  return (
    <section style={{ background: "var(--cream)", padding: "64px max(1.5rem,calc((100% - 1120px)/2))" }}>
      <div style={containerStyle}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={eyebrowSt}>While you wait for a reply</span>
            <h2 style={{ ...playfair, fontSize: 24, margin: "8px 0 0" }}>Explore the site</h2>
          </div>
        </Fade>
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {EXPLORE.map((h, i) => (
            <Fade key={h.href} delay={0.06 * i}>
              <a href={h.href} className="ct-explore">
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${h.color},${h.color}40)` }} />
                <span style={{ width: 42, height: 42, borderRadius: 10, background: `${h.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: h.color, flexShrink: 0 }}>{h.icon}</span>
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
export default function ContactClient() {
  return (
    <div style={{ fontFamily: "'Source Sans 3','Source Sans Pro',system-ui,sans-serif", color: "#1C1917", background: "#FAFAF8", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{STYLES}</style>
      <Nav />
      <span id="ct-main" />

      {/* Hero + floating form */}
      <section style={{ background: "#FAFAF8" }}>
        <div style={{ padding: "130px 0 100px", position: "relative", overflow: "hidden" }}>
          <HeroBackground page="contact" />
          <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
          <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 1.5rem", textAlign: "center", position: "relative", zIndex: 1 }}>
            <Fade>
              <span style={{ ...eyebrowSt, display: "block", marginBottom: 16 }}>Get in Touch</span>
              <h1 style={{ ...playfair, fontSize: "clamp(32px,4vw,46px)", color: "#fff", lineHeight: 1.18, margin: "0 0 16px" }}>
                Let&rsquo;s Connect
              </h1>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.7 }}>
                Working on AI in governance, policy reform, or the philosophy of technology? I want to hear about it.
              </p>
            </Fade>
          </div>
        </div>

        {/* Form floats up over hero */}
        <div style={{ maxWidth: 640, margin: "-48px auto 0", padding: "0 1.5rem 72px", position: "relative", zIndex: 2 }}>
          <Fade delay={0.15}>
            <ContactForm />
          </Fade>
        </div>
      </section>

      <DirectChannels />
      <FaqSection />
      <Explore />
      <BottomSection variant="general" />
    </div>
  );
}
