import crypto from "crypto";

/**
 * Shared session verification for admin API routes and server pages.
 * Accepts either a Next.js Request (API routes) or a cookie store (server pages).
 */

export function verifySessionFromRequest(request) {
  const token = request.cookies.get("admin_session")?.value;
  return verifyToken(token);
}

export function verifySessionFromCookieStore(cookieStore) {
  const token = cookieStore.get("admin_session")?.value;
  return verifyToken(token);
}

function verifyToken(token) {
  if (!token) return false;
  try {
    const [data, sig] = token.split(".");
    if (data !== "admin" || !sig) return false;
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret) return false;
    const expected = crypto.createHmac("sha256", secret).update(data).digest("hex");
    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}
