import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { verifySessionFromRequest as verifySession } from "../../../../lib/admin-auth";

function getFilePath(type) {
  return join(process.cwd(), "data", "sacred", type === "geeta" ? "geeta_data.json" : "yoga_sutras_data.json");
}

// GET /api/admin/sacred-texts?type=geeta&chapter=0&page=1&limit=5
export async function GET(request) {
  if (!verifySession(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "geeta";
  const chapterIdx = parseInt(searchParams.get("chapter") ?? "0");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "5");

  try {
    const raw = JSON.parse(readFileSync(getFilePath(type), "utf8"));
    const chapters = raw.chapters;
    const chapter = chapters[chapterIdx];
    const entries = type === "geeta" ? chapter.verses : chapter.sutras;
    const total = entries.length;
    const start = (page - 1) * limit;
    const paged = entries.slice(start, start + limit);

    return Response.json({
      chapterList: chapters.map((c, i) => ({ i, name: c.name, num: c.chapter ?? c.pada })),
      chapter: { name: chapter.name, num: chapter.chapter ?? chapter.pada },
      entries: paged,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    return Response.json({ error: "Failed to read data: " + e.message }, { status: 500 });
  }
}

// POST /api/admin/sacred-texts — update one entry
export async function POST(request) {
  if (!verifySession(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { type, chapterIdx, entryIdx, updates } = await request.json();
    const filePath = getFilePath(type);
    const raw = JSON.parse(readFileSync(filePath, "utf8"));
    const entries = type === "geeta" ? raw.chapters[chapterIdx].verses : raw.chapters[chapterIdx].sutras;
    entries[entryIdx] = { ...entries[entryIdx], ...updates };
    writeFileSync(filePath, JSON.stringify(raw, null, 2));
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
