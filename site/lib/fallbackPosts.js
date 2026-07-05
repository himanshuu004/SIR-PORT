/**
 * Sample articles shown when Ghost CMS is unreachable or not configured.
 * Shape matches Ghost Content API post objects used by AllPostsClient.
 */

const TAG = {
  philosophy: { id: "fb-philosophy", name: "Philosophy", slug: "philosophy" },
  mindMachine: { id: "fb-mind-machine", name: "Mind & Machine", slug: "mind-machine" },
};

function fallbackHtml(excerpt) {
  return `<p>${excerpt}</p>
<p><em>This is a sample preview shown while Ghost CMS is not connected. Add your <strong>GHOST_KEY</strong> to <code>.env.local</code> to load the full article from the CMS.</em></p>
<p><a href="/all-posts">Browse all posts</a> · <a href="/">Return home</a></p>`;
}

export const FALLBACK_POSTS = [
  {
    id: "fallback-1",
    slug: "markov-brain-habit",
    title: "The Markov Brain: Rewiring Neural Pathways Through Habit",
    custom_excerpt:
      "How Markov chains explain the mathematics of habit formation, and what this means for personal transformation.",
    excerpt:
      "How Markov chains explain the mathematics of habit formation, and what this means for personal transformation.",
    html: fallbackHtml(
      "How Markov chains explain the mathematics of habit formation, and what this means for personal transformation."
    ),
    published_at: "2026-02-01T00:00:00.000Z",
    reading_time: 15,
    primary_tag: TAG.philosophy,
    tags: [TAG.philosophy, { id: "fb-pom", name: "Philosophy of Mind", slug: "philosophy-of-mind" }],
    authors: [{ name: "Dr. B.V.R.C. Purushottam" }],
    isFallback: true,
  },
  {
    id: "fallback-2",
    slug: "barnum-effect-ai",
    title: "When the Mirror Speaks: The Barnum Effect in AI Systems",
    custom_excerpt:
      "Why AI systems that flatter us are more dangerous than ones that challenge us.",
    excerpt:
      "Why AI systems that flatter us are more dangerous than ones that challenge us.",
    html: fallbackHtml(
      "Why AI systems that flatter us are more dangerous than ones that challenge us."
    ),
    published_at: "2026-01-15T00:00:00.000Z",
    reading_time: 8,
    primary_tag: TAG.philosophy,
    tags: [TAG.philosophy, { id: "fb-hngca", name: "How Not to Get Carried Away", slug: "how-not-to-get-carried-away" }],
    authors: [{ name: "Dr. B.V.R.C. Purushottam" }],
    isFallback: true,
  },
  {
    id: "fallback-3",
    slug: "ancient-dreams-thinking-machines",
    title: "From Ancient Dreams to Thinking Machines",
    custom_excerpt:
      "A 3,000-year history of humanity's desire to create artificial minds.",
    excerpt:
      "A 3,000-year history of humanity's desire to create artificial minds.",
    html: fallbackHtml(
      "A 3,000-year history of humanity's desire to create artificial minds."
    ),
    published_at: "2025-12-01T00:00:00.000Z",
    reading_time: 20,
    primary_tag: TAG.mindMachine,
    tags: [TAG.mindMachine, { id: "fb-ai", name: "AI Foundations", slug: "ai-foundations" }],
    authors: [{ name: "Dr. B.V.R.C. Purushottam" }],
    isFallback: true,
  },
];

export function getFallbackPostBySlug(slug) {
  return FALLBACK_POSTS.find((p) => p.slug === slug) ?? null;
}

export function getRelatedFallbackPosts(slug, limit = 3) {
  return FALLBACK_POSTS.filter((p) => p.slug !== slug).slice(0, limit);
}

/** Card-friendly shape used by HomeClient featured section */
export const FALLBACK_ARTICLES = FALLBACK_POSTS.map((post) => ({
  pillar: post.tags.find((t) => t.slug !== post.primary_tag?.slug)?.name ?? post.primary_tag?.name ?? "Essay",
  title: post.title,
  excerpt: post.custom_excerpt,
  date: new Date(post.published_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
  time: `${post.reading_time} min`,
  href: `/insights/${post.slug}`,
}));
