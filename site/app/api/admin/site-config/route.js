import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { verifySessionFromRequest as verifySession } from "../../../../lib/admin-auth";

const CONFIG_PATH = join(process.cwd(), "data", "site-config.json");

export async function GET(request) {
  if (!verifySession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const config = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: "Could not read config" }, { status: 500 });
  }
}

export async function POST(request) {
  if (!verifySession(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const current = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
    const updated = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2));
    return NextResponse.json({ ok: true, config: updated });
  } catch {
    return NextResponse.json({ error: "Could not save config" }, { status: 500 });
  }
}
