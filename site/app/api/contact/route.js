import { NextResponse } from "next/server";
import { appendRow } from "../../../lib/sheets";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name, email, type, message,
      date, audience, org, domain: orgDomain,
      publication, deadline,
      _gotcha,           // honeypot — bots fill this, humans don't
    } = body;

    // ── Spam guard ──────────────────────────────────────────────
    if (_gotcha) {
      // Silently succeed so bots don't know they're blocked
      return NextResponse.json({ ok: true });
    }

    // ── Validation ───────────────────────────────────────────────
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (message.trim().length < 10) {
      return NextResponse.json({ error: "Message is too short." }, { status: 400 });
    }

    // ── Build email HTML ─────────────────────────────────────────
    const extraRows = [
      date        && `<tr><td style="padding:4px 12px 4px 0;color:#78716C;font-size:13px">Event Date</td><td style="font-size:13px">${date}</td></tr>`,
      audience    && `<tr><td style="padding:4px 12px 4px 0;color:#78716C;font-size:13px">Audience Size</td><td style="font-size:13px">${audience}</td></tr>`,
      org         && `<tr><td style="padding:4px 12px 4px 0;color:#78716C;font-size:13px">Organisation</td><td style="font-size:13px">${org}</td></tr>`,
      orgDomain   && `<tr><td style="padding:4px 12px 4px 0;color:#78716C;font-size:13px">Domain</td><td style="font-size:13px">${orgDomain}</td></tr>`,
      publication && `<tr><td style="padding:4px 12px 4px 0;color:#78716C;font-size:13px">Publication</td><td style="font-size:13px">${publication}</td></tr>`,
      deadline    && `<tr><td style="padding:4px 12px 4px 0;color:#78716C;font-size:13px">Deadline</td><td style="font-size:13px">${deadline}</td></tr>`,
    ].filter(Boolean).join("");

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#111111;padding:24px 32px;border-radius:12px 12px 0 0">
          <h2 style="color:#fff;margin:0;font-size:18px">New Contact Form Submission</h2>
          <p style="color:#FF2D78;margin:4px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:0.08em">basavapurushottam.com</p>
        </div>
        <div style="background:#FAF8F5;padding:28px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr><td style="padding:4px 12px 4px 0;color:#78716C;font-size:13px">Name</td><td style="font-size:13px;font-weight:600">${name}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#78716C;font-size:13px">Email</td><td style="font-size:13px"><a href="mailto:${email}" style="color:#111111">${email}</a></td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#78716C;font-size:13px">Inquiry Type</td><td style="font-size:13px">${type}</td></tr>
            ${extraRows}
          </table>
          <div style="background:#fff;border-left:3px solid #FF2D78;border-radius:0 8px 8px 0;padding:16px 20px">
            <p style="font-size:12px;font-weight:700;color:#78716C;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px">Message</p>
            <p style="font-size:15px;line-height:1.75;color:#1C1917;margin:0;white-space:pre-wrap">${message.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</p>
          </div>
          <p style="font-size:12px;color:#A8A29E;margin:20px 0 0">Reply directly to this email to respond to ${name}.</p>
        </div>
      </div>`;

    const text = `New contact from ${name} (${email})\nType: ${type}\n\n${message}`;

    // ── Send via Mailgun ─────────────────────────────────────────
    const apiKey  = process.env.MAILGUN_API_KEY;
    const mgDomain = process.env.MAILGUN_DOMAIN;
    const toEmail = process.env.CONTACT_TO_EMAIL || "basava.ias@gmail.com";
    const apiBase = process.env.MAILGUN_API_BASE || "https://api.mailgun.net";

    if (!apiKey || !mgDomain) {
      console.error("Mailgun env vars missing: MAILGUN_API_KEY and MAILGUN_DOMAIN required");
      return NextResponse.json(
        { error: "Email service is not configured. Please contact directly at basava.ias@gmail.com" },
        { status: 500 }
      );
    }

    const mgRes = await fetch(`${apiBase}/v3/${mgDomain}/messages`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`api:${apiKey}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        from:          `Contact Form <noreply@${mgDomain}>`,
        to:            toEmail,
        "h:Reply-To":  email,
        subject:       `[Contact] ${type} — ${name}`,
        html,
        text,
      }),
    });

    if (!mgRes.ok) {
      const errText = await mgRes.text();
      console.error("Mailgun error:", mgRes.status, errText);
      return NextResponse.json({ error: "Failed to send message. Please try again or email directly." }, { status: 500 });
    }

    // Mirror to Messages sheet (best-effort; matches header order set in step 4)
    appendRow("Messages", [
      new Date().toISOString(),
      name,
      email,
      type || "",
      message,
      date || "",
      audience || "",
      org || "",
      orgDomain || "",
      publication || "",
      deadline || "",
    ]).catch(() => {});

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
