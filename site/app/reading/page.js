import { getPostsByTag } from "../../lib/ghost";
import ReadingClient from "./ReadingClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reading & Learning",
  description: "Notes on the books, papers, and ideas I'm working through — a running journal of what I'm reading, studying, and thinking about.",
  keywords: ["reading notes", "book reviews", "marginalia", "currently reading", "intellectual diary"],
  openGraph: {
    title: "Reading & Learning — Dr. B.V.R.C. Purushottam",
    description: "Notes on the books, papers, and ideas I'm working through.",
    url: "https://basavapurushottam.com/reading",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Reading & Learning — Dr. B.V.R.C. Purushottam" },
  alternates: { canonical: "https://basavapurushottam.com/reading" },
};

export default async function ReadingPage() {
  let posts = [];
  try {
    posts = await getPostsByTag("reading", 100);
  } catch {
    // Ghost unreachable
  }
  return <ReadingClient posts={posts} />;
}
