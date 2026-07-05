import { getPostsByTag } from "../../lib/ghost";
import sectionsData from "../../data/mind-and-machine/sections.json";
import MindAndMachineClient from "./MindAndMachineClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mind & Machine",
  description:
    "Notes on neuroscience, AI, machine learning, and information theory — written by a curious outsider, for other curious outsiders.",
  keywords: ["AI essays", "neural networks", "neuroscience", "cognitive science", "machine learning India", "information theory"],
  openGraph: {
    title: "Mind & Machine — Dr. B.V.R.C. Purushottam",
    description: "Notes on neuroscience, AI, machine learning, and information theory — written by a curious outsider.",
    url: "https://basavapurushottam.com/mind-and-machine",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Mind & Machine — Dr. B.V.R.C. Purushottam" },
  alternates: { canonical: "https://basavapurushottam.com/mind-and-machine" },
};

export default async function MindAndMachinePage() {
  // Posts per sub-section, plus generic parent-tag posts for backwards compat.
  const sectionPromises = sectionsData.map((s) => getPostsByTag(s.ghostTag, 50));
  const [sectionResults, generalPosts] = await Promise.all([
    Promise.all(sectionPromises),
    getPostsByTag("mind-machine", 50),
  ]);

  const sections = sectionsData
    .map((s, i) => ({ ...s, posts: sectionResults[i] ?? [] }))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  // Posts tagged parent `mind-machine` but in neither sub-section.
  const sectionTagSlugs = new Set(sectionsData.map((s) => s.ghostTag));
  const generalUntagged = generalPosts.filter(
    (p) => !p.tags?.some((t) => sectionTagSlugs.has(t.slug))
  );

  return (
    <MindAndMachineClient
      sections={sections}
      generalPosts={generalUntagged}
    />
  );
}
