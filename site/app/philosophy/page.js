import { getPostsByTag } from "../../lib/ghost";
import PhilosophyClient from "./PhilosophyClient";

export const metadata = {
  title: "Philosophy",
  description: "Eastern wisdom meets cognitive science. Interactive commentaries on the Bhagavad Gita and Patanjali Yoga Sutras, plus essays on philosophy of mind, consciousness, and the examined life.",
  keywords: ["Bhagavad Gita", "Yoga Sutras", "philosophy of mind", "consciousness", "Eastern philosophy", "Patanjali", "Vedanta"],
  openGraph: {
    title: "Philosophy — Dr. B.V.R.C. Purushottam",
    description: "Eastern wisdom meets cognitive science. Interactive Bhagavad Gita and Yoga Sutras commentaries, plus essays on consciousness and the examined life.",
    url: "https://basavapurushottam.com/philosophy",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Philosophy — Dr. B.V.R.C. Purushottam" },
  alternates: { canonical: "https://basavapurushottam.com/philosophy" },
};

export const dynamic = "force-dynamic";

export default async function PhilosophyPage() {
  let posts = [];
  try {
    posts = await getPostsByTag("philosophy", 50);
  } catch {
    // Ghost unreachable
  }

  return <PhilosophyClient posts={posts} />;
}
