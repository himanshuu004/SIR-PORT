import { getPostsByTag } from "../../lib/ghost";
import MediaClient from "./MediaClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "In the Media",
  description: "Press mentions, interviews, and newspaper clippings featuring Dr. B.V.R.C. Purushottam — both online articles and scanned print coverage.",
  keywords: ["press mentions", "media coverage", "interviews", "newspaper clippings", "IAS officer in the press"],
  openGraph: {
    title: "In the Media — Dr. B.V.R.C. Purushottam",
    description: "Press mentions, interviews, and clippings — online articles and scanned print coverage.",
    url: "https://basavapurushottam.com/media",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "In the Media — Dr. B.V.R.C. Purushottam" },
  alternates: { canonical: "https://basavapurushottam.com/media" },
};

export default async function MediaPage() {
  let posts = [];
  try {
    posts = await getPostsByTag("media", 100);
  } catch {
    // Ghost unreachable
  }
  return <MediaClient posts={posts} />;
}
