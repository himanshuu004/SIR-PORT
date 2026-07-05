import { NextResponse } from "next/server";
import crypto from "crypto";

// ── In-memory rate limiter ─────────────────────────────────────────
// Max 5 failed attempts per IP within a 15-minute window.
const attempts = new Map(); // ip → { count, resetAt }
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getRateLimit(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    return { blocked: false, remaining: MAX_ATTEMPTS };
  }
  return { blocked: entry.count >= MAX_ATTEMPTS, remaining: Math.max(0, MAX_ATTEMPTS - entry.count) };
}

function recordFailure(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

function clearFailures(ip) {
  attempts.delete(ip);
}

// ── Login route ────────────────────────────────────────────────────
export async function POST(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const { blocked, remaining } = getRateLimit(ip);
  if (blocked) {
    return NextResponse.json(
      { error: "Too many failed attempts. Try again in 15 minutes." },
      { status: 429, headers: { "Retry-After": "900" } }
    );
  }

  try {
    const { username, password } = await request.json();

    const validUser = process.env.ADMIN_USERNAME;
    const validHash = process.env.ADMIN_PASSWORD_HASH;
    const secret = process.env.ADMIN_SESSION_SECRET;

    if (!validUser || !validHash || !secret) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const inputHash = crypto.createHash("sha256").update(password ?? "").digest("hex");

    // Constant-time comparison to prevent timing attacks
    const userMatch = username === validUser;
    const passMatch = crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(validHash));

    if (!userMatch || !passMatch) {
      recordFailure(ip);
      const { remaining: rem } = getRateLimit(ip);
      return NextResponse.json(
        { error: `Invalid credentials. ${rem} attempt${rem === 1 ? "" : "s"} remaining.` },
        { status: 401 }
      );
    }

    // Success — clear failures and issue signed session token
    clearFailures(ip);
    const data = "admin";
    const sig = crypto.createHmac("sha256", secret).update(data).digest("hex");
    const token = `${data}.${sig}`;

    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
