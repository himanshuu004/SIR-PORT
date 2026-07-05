import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySessionFromRequest } from "../../../lib/admin-auth";

export async function POST(request) {
  if (!verifySessionFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Revalidate all main routes
    const paths = [
      "/",
      "/about",
      "/insights",
      "/mind-and-machine",
      "/policy-lab",
      "/philosophy",
      "/proving-ground",
      "/the-late-compiler",
      "/contact",
    ];
    paths.forEach(p => revalidatePath(p));
    return NextResponse.json({ ok: true, revalidated: paths });
  } catch (e) {
    return NextResponse.json({ error: "Revalidation failed", detail: e.message }, { status: 500 });
  }
}
