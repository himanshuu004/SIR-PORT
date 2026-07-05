import { readFileSync } from "fs";
import { join } from "path";
import { verifySessionFromRequest as verifySession } from "../../../../lib/admin-auth";

export async function GET(request) {
  if (!verifySession(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const FILES = {
    geeta: "site/data/sacred/geeta_data.json",
    pys: "site/data/sacred/yoga_sutras_data.json",
  };

  const file = FILES[type];
  if (!file) return Response.json({ error: "Unknown type" }, { status: 400 });

  try {
    const content = readFileSync(join(process.cwd(), "data", "sacred", type === "geeta" ? "geeta_data.json" : "yoga_sutras_data.json"), "utf8");
    return new Response(content, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${type === "geeta" ? "geeta_data" : "yoga_sutras_data"}.json"`,
      },
    });
  } catch {
    return Response.json({ error: "File not found" }, { status: 404 });
  }
}
