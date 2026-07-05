// Returns { data, error } — never throws
//
// Resilience tuning (added after diagnosing a flaky upstream Ghost VPS that
// occasionally hangs connections for 30–75 s before TCP-resetting):
//   1. 5 s hard timeout via AbortController — a slow upstream fails fast
//      rather than pinning a visitor's request to the page.
//   2. ISR-style caching via `next: { revalidate }` — most page renders
//      serve from the Next.js cache and never touch Ghost at all. Ghost is
//      probed at most once per `revalidate` window per route.
//
// Both knobs can be overridden per-call (e.g. admin endpoints that need
// fresh data can pass `cache: "no-store"`).
async function fetchGhost(endpoint, params = {}, opts = {}) {
  const { timeoutMs = 5000, revalidate = 60 } = opts;
  const GHOST_URL = process.env.GHOST_URL;
  const GHOST_KEY = process.env.GHOST_KEY;

  if (!GHOST_URL || !GHOST_KEY) {
    console.warn("[Ghost] GHOST_URL or GHOST_KEY not set.");
    return { error: "config_missing" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = new URL(`${GHOST_URL}/ghost/api/content/${endpoint}/`);
    url.searchParams.set("key", GHOST_KEY);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      next: { revalidate },
    });

    if (res.status === 401 || res.status === 403) {
      console.error("[Ghost] Invalid API key.");
      return { error: "auth_error" };
    }
    if (!res.ok) {
      console.error(`[Ghost] API error ${res.status} on ${endpoint}`);
      return { error: "api_error" };
    }
    const json = await res.json();
    if (json.errors) {
      console.error("[Ghost] API returned errors:", json.errors);
      return { error: "api_error" };
    }
    return { data: json };
  } catch (err) {
    if (err.name === "AbortError") {
      console.error(`[Ghost] Timeout after ${timeoutMs}ms on ${endpoint}`);
      return { error: "timeout" };
    }
    console.error("[Ghost] Network error:", err.message);
    return { error: "network_error" };
  } finally {
    clearTimeout(timeout);
  }
}

/* ── Posts ────────────────────────────────────────────────────── */

export async function getAllPosts(limit = "all") {
  const { data } = await fetchGhost("posts", {
    limit,
    fields: "id,title,slug,excerpt,custom_excerpt,feature_image,published_at,reading_time,primary_tag",
    include: "tags,authors",
  });
  return data?.posts ?? [];
}

// Heavier variant that also includes plaintext body — used by the
// content library / search page to enable full-text client-side filtering.
export async function getAllPostsForSearch(limit = "all") {
  const { data } = await fetchGhost("posts", {
    limit,
    fields: "id,title,slug,excerpt,custom_excerpt,feature_image,published_at,reading_time,primary_tag,plaintext",
    include: "tags,authors",
    formats: "plaintext",
  });
  return data?.posts ?? [];
}

export async function getPostsByTag(tag, limit = 10) {
  const { data } = await fetchGhost("posts", {
    limit,
    filter: `tag:${tag}`,
    fields: "id,title,slug,excerpt,custom_excerpt,feature_image,published_at,reading_time,primary_tag",
    include: "tags,authors",
  });
  return data?.posts ?? [];
}

export async function getPostBySlug(slug) {
  const { data } = await fetchGhost("posts", {
    filter: `slug:${slug}`,
    limit: 1,
    include: "tags,authors",
  });
  return data?.posts?.[0] ?? null;
}

// Fetch posts that share the current post's primary tag, excluding the
// current post itself. Used at the bottom of /insights/[slug] for
// "Continue reading" recommendations.
export async function getRelatedPosts(currentPost, limit = 3) {
  const tagSlug = currentPost?.primary_tag?.slug;
  if (!tagSlug) return [];
  const { data } = await fetchGhost("posts", {
    limit: limit + 1, // fetch one extra so we still have `limit` after excluding self
    filter: `tag:${tagSlug}`,
    fields: "id,title,slug,excerpt,custom_excerpt,feature_image,published_at,reading_time,primary_tag",
    include: "tags",
  });
  return (data?.posts ?? [])
    .filter((p) => p.id !== currentPost.id)
    .slice(0, limit);
}

export async function getFeaturedPosts(limit = 3) {
  const { data } = await fetchGhost("posts", {
    limit,
    filter: "featured:true",
    fields: "id,title,slug,excerpt,custom_excerpt,feature_image,published_at,reading_time,primary_tag",
    include: "tags",
  });
  return data?.posts ?? [];
}

/* ── Tags ─────────────────────────────────────────────────────── */

export async function getAllTags() {
  const { data } = await fetchGhost("tags", {
    limit: "all",
    fields: "id,name,slug,description,count",
    include: "count.posts",
  });
  return data?.tags ?? [];
}

/* ── Pages ────────────────────────────────────────────────────── */

export async function getPage(slug) {
  const { data } = await fetchGhost("pages", {
    filter: `slug:${slug}`,
    limit: 1,
  });
  return data?.pages?.[0] ?? null;
}

/* ── Settings ─────────────────────────────────────────────────── */

export async function getSiteSettings() {
  const { data } = await fetchGhost("settings");
  return data?.settings ?? {};
}

/* ── Health check — for admin panel ─────────────────────────── */

export async function checkGhostConnection() {
  const GHOST_URL = process.env.GHOST_URL;
  const GHOST_KEY = process.env.GHOST_KEY;
  if (!GHOST_URL || !GHOST_KEY) return { connected: false, reason: "config_missing" };
  const { data, error } = await fetchGhost("settings");
  if (error) return { connected: false, reason: error };
  return { connected: true, url: GHOST_URL };
}
