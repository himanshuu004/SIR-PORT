import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  // Must match the same attributes as the set cookie for proper deletion
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
