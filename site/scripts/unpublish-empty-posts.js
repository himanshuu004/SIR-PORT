#!/usr/bin/env node
/**
 * One-off script: move all published posts that have an empty plaintext body
 * to Draft status. Run via:
 *
 *   cd site
 *   GHOST_URL=https://cms.basavapurushottam.com \
 *   GHOST_KEY=<content-api-key> \
 *   GHOST_ADMIN_KEY=<admin-api-key> \
 *   node scripts/unpublish-empty-posts.js
 *
 * Or set those values in .env.local and use --env-file:
 *   node --env-file=.env.local scripts/unpublish-empty-posts.js
 *
 * The script:
 *   1. Lists posts via the Content API
 *   2. Picks ones with empty/whitespace-only plaintext
 *   3. For each, fetches the full post via Admin API (to get updated_at)
 *   4. PUTs status=draft using a fresh updated_at to satisfy Ghost's
 *      collision detection
 *
 * It is idempotent: re-running after success will find 0 empty published
 * posts and do nothing.
 */
import crypto from "node:crypto";

const GHOST_URL = process.env.GHOST_URL;
const GHOST_KEY = process.env.GHOST_KEY;
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_KEY;

if (!GHOST_URL || !GHOST_KEY || !GHOST_ADMIN_KEY) {
  console.error(
    "Missing env vars. Need GHOST_URL, GHOST_KEY, and GHOST_ADMIN_KEY."
  );
  process.exit(1);
}

function adminJwt(adminKey) {
  const [id, secret] = adminKey.split(":");
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT", kid: id })
  ).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({ iat: now, exp: now + 300, aud: "/admin/" })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", Buffer.from(secret, "hex"))
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${sig}`;
}

async function listAllPublishedPosts() {
  const url = `${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_KEY}&limit=all&fields=id,title,slug,plaintext&formats=plaintext&filter=status:published`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Content API failed: ${res.status}`);
  const json = await res.json();
  return json.posts ?? [];
}

async function fetchAdminPost(id, token) {
  const url = `${GHOST_URL}/ghost/api/admin/posts/${id}/?formats=mobiledoc,lexical`;
  const res = await fetch(url, {
    headers: { Authorization: `Ghost ${token}`, "Accept-Version": "v5.0" },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Admin GET ${id} failed: ${res.status} ${body}`);
  }
  const json = await res.json();
  return json.posts?.[0];
}

async function setDraft(post, token) {
  const url = `${GHOST_URL}/ghost/api/admin/posts/${post.id}/`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Ghost ${token}`,
      "Content-Type": "application/json",
      "Accept-Version": "v5.0",
    },
    body: JSON.stringify({
      posts: [{ status: "draft", updated_at: post.updated_at }],
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Admin PUT ${post.id} failed: ${res.status} ${body}`);
  }
}

async function main() {
  console.log("Listing published posts…");
  const all = await listAllPublishedPosts();
  const empty = all.filter((p) => !(p.plaintext || "").trim());
  console.log(`Found ${empty.length} empty published post(s).`);

  if (empty.length === 0) return;

  console.log("\nThe following posts will be moved to Draft:");
  for (const p of empty) console.log(`  - ${p.title}  (${p.slug})`);

  const token = adminJwt(GHOST_ADMIN_KEY);
  let succeeded = 0;
  let failed = 0;
  for (const p of empty) {
    try {
      const full = await fetchAdminPost(p.id, token);
      await setDraft(full, token);
      console.log(`  ✓ ${p.slug}`);
      succeeded++;
    } catch (err) {
      console.error(`  ✗ ${p.slug}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${succeeded} moved to draft, ${failed} failed.`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
