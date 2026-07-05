import { getPostsByTag } from "../../lib/ghost";
import achievements from "../../data/proving-ground/achievements.json";
import ProvingGroundClient from "./ProvingGroundClient";

export const metadata = {
  title: "The Proving Ground",
  description:
    "Where discipline meets impact. Personal essays on movement, struggle, and the examined life — plus the official projects that shaped lives and systems across Uttarakhand.",
  keywords: ["IAS achievement", "Uttarakhand development", "personal essays", "discipline", "official impact", "governance field notes"],
  openGraph: {
    title: "The Proving Ground — Dr. B.V.R.C. Purushottam",
    description: "Where discipline meets impact. Personal essays and the official projects that shaped lives across Uttarakhand.",
    url: "https://basavapurushottam.com/proving-ground",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "The Proving Ground — Dr. B.V.R.C. Purushottam" },
  alternates: { canonical: "https://basavapurushottam.com/proving-ground" },
};

export const revalidate = 3600;

export default async function ProvingGroundPage() {
  let posts = [];
  try {
    posts = await getPostsByTag("proving-ground", 30);
  } catch {
    // Ghost unreachable — show static content
  }

  return (
    <ProvingGroundClient
      posts={posts}
      achievements={achievements}
    />
  );
}
