import { NextResponse } from "next/server";

// Edge-compatible HMAC verification using Web Crypto API
async function verifySession(token) {
  if (!token) return false;
  try {
    const [data, sig] = token.split(".");
    if (data !== "admin" || !sig) return false;
    const secret = process.env.ADMIN_SESSION_SECRET;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false, ["verify"]
    );
    const sigBytes = new Uint8Array(sig.match(/.{2}/g).map(b => parseInt(b, 16)));
    return await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(data));
  } catch {
    return false;
  }
}

export async function proxy(request) {
  const { pathname, search } = request.nextUrl;

  // 301 redirect: /projects → /proving-ground (legacy URL)
  if (pathname === "/projects" || pathname.startsWith("/projects/")) {
    const newPath = pathname.replace(/^\/projects/, "/proving-ground");
    return NextResponse.redirect(new URL(`${newPath}${search}`, request.url), 301);
  }

  // Protect /admin/* except /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_session")?.value;
    const valid = await verifySession(token);
    if (!valid) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Pass pathname via header so root layout can check maintenance mode
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)"],
};
