import { getPostsByTag } from "../../lib/ghost";
import sectorsData from "../../data/policy-lab/sectors.json";
import PolicyLabClient from "./PolicyLabClient";

export const metadata = {
  title: "The Policy Lab",
  description:
    "Data-driven governance, policy thinking, and field dispatches from three decades in the IAS. Essays on GovTech, education reform, cooperative digitisation, and public administration.",
  keywords: ["IAS policy", "GovTech India", "data governance", "public administration", "education reform", "cooperative digitization"],
  openGraph: {
    title: "The Policy Lab — Dr. B.V.R.C. Purushottam",
    description: "Data-driven governance, policy thinking, and field dispatches from three decades in the IAS.",
    url: "https://basavapurushottam.com/policy-lab",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "The Policy Lab — Dr. B.V.R.C. Purushottam" },
  alternates: { canonical: "https://basavapurushottam.com/policy-lab" },
};

export const dynamic = "force-dynamic";

export default async function PolicyLabPage() {
  // Fetch in parallel: department-tagged posts, generic policy-lab posts, and news.
  const sectorPromises = sectorsData.map((s) => getPostsByTag(s.ghostTag, 50));
  const [sectorResults, generalPosts, newsPosts] = await Promise.all([
    Promise.all(sectorPromises),
    getPostsByTag("policy-lab", 50),
    getPostsByTag("news", 20),
  ]);

  // Build the sectors array with their posts attached, sorted by order.
  const sectors = sectorsData
    .map((s, i) => ({ ...s, posts: sectorResults[i] ?? [] }))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  // "General" bucket = posts tagged policy-lab but NOT in any department —
  // keeps backwards compatibility with existing posts.
  const sectorTagSlugs = new Set(sectorsData.map((s) => s.ghostTag));
  const generalUntagged = generalPosts.filter(
    (p) => !p.tags?.some((t) => sectorTagSlugs.has(t.slug))
  );

  return (
    <PolicyLabClient
      sectors={sectors}
      generalPosts={generalUntagged}
      newsPosts={newsPosts}
    />
  );
}
