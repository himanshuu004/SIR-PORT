import { notFound } from "next/navigation";
import Nav from "../../../components/Nav";
import BottomSection from "../../../components/BottomSection";
import { getPostBySlug, getRelatedPosts } from "../../../lib/ghost";
import { getFallbackPostBySlug, getRelatedFallbackPosts } from "../../../lib/fallbackPosts";
import ArticleClient from "./ArticleClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    let post = await getPostBySlug(slug);
    if (!post) post = getFallbackPostBySlug(slug);
    if (!post) return { title: "Article not found" };

    const url = `https://basavapurushottam.com/insights/${slug}`;
    // Prefer Ghost's manually-set feature_image_alt (settable in the
    // post's image-alt field). Fall back to the post title so social-card
    // alt text is never empty.
    const featureAlt = post.feature_image_alt || post.title;
    const ogImage = post.feature_image
      ? [{ url: post.feature_image, width: 1200, height: 630, alt: featureAlt }]
      : [{ url: "/opengraph-image", width: 1200, height: 630, alt: featureAlt }];
    const keywords = post.tags?.map((t) => t.name) ?? [];

    return {
      title: post.title,
      description: post.excerpt,
      keywords,
      authors: [{ name: "Dr. B.V.R.C. Purushottam", url: "https://basavapurushottam.com/about" }],
      openGraph: {
        type: "article",
        title: post.title,
        description: post.excerpt,
        url,
        images: ogImage,
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
        authors: ["https://basavapurushottam.com/about"],
        tags: keywords,
        siteName: "Dr. B.V.R.C. Purushottam",
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images: post.feature_image ? [post.feature_image] : ["/opengraph-image"],
      },
      alternates: { canonical: url },
    };
  } catch {
    return { title: "Article — Dr. B.V.R.C. Purushottam" };
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  let post = null;
  let relatedPosts = [];

  try {
    post = await getPostBySlug(slug);
    if (post) {
      relatedPosts = await getRelatedPosts(post, 3);
    }
  } catch {
    // Ghost unreachable
  }

  if (!post) {
    post = getFallbackPostBySlug(slug);
    if (post) {
      relatedPosts = getRelatedFallbackPosts(slug, 3);
    }
  }

  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.feature_image || "https://basavapurushottam.com/opengraph-image",
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    url: `https://basavapurushottam.com/insights/${slug}`,
    author: {
      "@type": "Person",
      name: "Dr. B.V.R.C. Purushottam",
      url: "https://basavapurushottam.com/about",
    },
    publisher: {
      "@type": "Person",
      name: "Dr. B.V.R.C. Purushottam",
      url: "https://basavapurushottam.com",
    },
    keywords: post.tags?.map((t) => t.name).join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://basavapurushottam.com/insights/${slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Nav />
      <main id="main">
        <ArticleClient
          post={post}
          relatedPosts={relatedPosts}
          ghostUrl={process.env.GHOST_URL || ""}
          ghostKey={process.env.GHOST_KEY || ""}
        />
      </main>
      <BottomSection variant="mind" />
    </>
  );
}
