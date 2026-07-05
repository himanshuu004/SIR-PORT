import { getAllPosts } from "../lib/ghost";

// Always generate the sitemap on demand. revalidate-based caching can
// permanently freeze an empty sitemap if Ghost is briefly unreachable at
// build time; force-dynamic guarantees every request fetches live data.
export const dynamic = "force-dynamic";

const BASE = "https://basavapurushottam.com";

const STATIC_ROUTES = [
  { url: BASE,                              changeFrequency: "daily",   priority: 1.0 },
  { url: `${BASE}/about`,                   changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/mind-and-machine`,        changeFrequency: "weekly",  priority: 0.9 },
  { url: `${BASE}/philosophy`,              changeFrequency: "weekly",  priority: 0.9 },
  { url: `${BASE}/philosophy/geeta`,        changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/philosophy/pys`,          changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/policy-lab`,              changeFrequency: "weekly",  priority: 0.9 },
  { url: `${BASE}/proving-ground`,          changeFrequency: "weekly",  priority: 0.8 },
  { url: `${BASE}/the-late-compiler`,       changeFrequency: "weekly",  priority: 0.8 },
  { url: `${BASE}/all-posts`,               changeFrequency: "daily",   priority: 0.7 },
  { url: `${BASE}/contact`,                 changeFrequency: "monthly", priority: 0.6 },
];

export default async function sitemap() {
  let articleRoutes = [];
  try {
    const posts = await getAllPosts("all");
    articleRoutes = posts.map((post) => ({
      url: `${BASE}/insights/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    // Ghost unreachable — sitemap still works with static routes
  }

  return [
    ...STATIC_ROUTES.map((r) => ({ ...r, lastModified: new Date() })),
    ...articleRoutes,
  ];
}
