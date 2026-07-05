import { getAllPostsForSearch } from "../../lib/ghost";
import { FALLBACK_POSTS } from "../../lib/fallbackPosts";
import AllPostsClient from "./AllPostsClient";

export const metadata = {
  title: "All Posts — Content Library",
  description: "Every article, essay, and dispatch — organised by category. Browse AI governance, philosophy, Bhagavad Gita commentary, policy analysis, and personal essays.",
  keywords: ["articles", "essays", "AI governance", "philosophy", "policy lab", "content library"],
  openGraph: {
    title: "All Posts — Dr. B.V.R.C. Purushottam",
    description: "Every article, essay, and dispatch — organised by category.",
    url: "https://basavapurushottam.com/all-posts",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "All Posts — Dr. B.V.R.C. Purushottam" },
  alternates: { canonical: "https://basavapurushottam.com/all-posts" },
};

export const dynamic = "force-dynamic";

export default async function AllPostsPage() {
  let posts = [];
  let usingFallback = false;

  try {
    posts = await getAllPostsForSearch("all");
  } catch {
    // Ghost unreachable
  }

  if (posts.length === 0) {
    posts = FALLBACK_POSTS;
    usingFallback = true;
  }

  return <AllPostsClient posts={posts} usingFallback={usingFallback} />;
}
