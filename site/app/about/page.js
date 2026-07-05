import { getPostsByTag } from "../../lib/ghost";
import AboutClient from "./AboutClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About",
  description: "Dr. B.V.R.C. Purushottam — civil servant, AI practitioner, policy architect. A veterinarian by training, an IAS officer by choice, and an AI practitioner by obsession.",
  keywords: ["B.V.R.C. Purushottam", "IAS officer", "civil servant", "policy architect", "AI practitioner", "Uttarakhand"],
  openGraph: {
    title: "About — Dr. B.V.R.C. Purushottam",
    description: "A veterinarian by training, an IAS officer by choice, and an AI practitioner by obsession. 23 years inside India's most complex institutions.",
    url: "https://basavapurushottam.com/about",
    type: "profile",
  },
  twitter: { card: "summary_large_image", title: "About — Dr. B.V.R.C. Purushottam" },
  alternates: { canonical: "https://basavapurushottam.com/about" },
};

export default async function AboutPage() {
  let books = [];
  let videos = [];
  let podcasts = [];
  let mediaPosts = [];
  try {
    [books, videos, podcasts, mediaPosts] = await Promise.all([
      getPostsByTag("r-book", 5),
      getPostsByTag("r-video", 5),
      getPostsByTag("r-podcast", 5),
      getPostsByTag("media", 6),
    ]);
  } catch {
    // Ghost unreachable — fall through with empty arrays (graceful previews).
  }
  return <AboutClient readingByType={{ books, videos, podcasts }} mediaPosts={mediaPosts} />;
}
