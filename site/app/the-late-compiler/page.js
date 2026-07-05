import { getPostsByTag } from "../../lib/ghost";
import tracksData from "../../data/late-compiler/tracks.json";
import { readSheet } from "../../lib/sheets";
import LateCompilerClient from "./LateCompilerClient";

export const metadata = {
  title: "The Late Compiler",
  description:
    "It's never too late to learn to think like a machine. AI, machine learning, Python, and agentic systems — explained for curious minds who came to technology later in life.",
  keywords: ["learn AI", "machine learning beginners", "Python for beginners", "late learner AI", "AI course India", "agentic AI"],
  openGraph: {
    title: "The Late Compiler — Dr. B.V.R.C. Purushottam",
    description: "It's never too late to learn to think like a machine. AI and machine learning explained for late starters.",
    url: "https://basavapurushottam.com/the-late-compiler",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "The Late Compiler — Dr. B.V.R.C. Purushottam" },
  alternates: { canonical: "https://basavapurushottam.com/the-late-compiler" },
};

export const dynamic = "force-dynamic";

export default async function LateCompilerPage() {
  // Fetch articles for every track in parallel
  let allPosts = [];
  try {
    allPosts = await getPostsByTag("late-compiler", 50);
  } catch {
    // Ghost unreachable
  }

  // Optional syllabus override from Google Sheets ("Syllabus" tab).
  // Columns: Module | Title | Description | Status | Order
  // If a row's Module matches a track id, those fields override tracksData.
  const syllabusRows = await readSheet("Syllabus");
  const overrides = new Map();
  for (const row of syllabusRows) {
    const [module, title, description, status, order] = row;
    if (module) {
      overrides.set(module.trim(), {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(order && { order: Number(order) || undefined }),
      });
    }
  }

  // Map Ghost posts into tracks by matching track-specific tags
  const tracks = tracksData
    .map((track) => ({
      ...track,
      ...(overrides.get(track.id) ?? {}),
      articles: allPosts.filter((p) =>
        p.tags?.some((t) => t.slug === track.ghostTag)
      ),
    }))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return <LateCompilerClient tracks={tracks} allPosts={allPosts} />;
}
