#!/usr/bin/env node
/**
 * Apply a pre-computed tagging plan to Ghost posts via the Admin API.
 *
 * Plan file format (default: /tmp/classified.json):
 *   [
 *     { id, title, slug, existing: [slug...], proposed: [slug...], new_tags: [slug...] }
 *   ]
 *
 * For every post where `new_tags` is non-empty, this script:
 *   1. Fetches the full post via Admin API (to get current updated_at + tags)
 *   2. Sends a PUT that merges existing tags with the proposed ones
 *
 * Idempotent: re-running after success will see new_tags become empty for
 * everything (because the apply succeeded) and do no-op work.
 *
 * Usage:
 *   cd site
 *   GHOST_URL=https://cms.basavapurushottam.com \
 *   GHOST_ADMIN_KEY=<admin-key> \
 *   node scripts/apply-tag-plan.js
 *
 * Optional flags:
 *   --plan=/path/to/file.json   (default: /tmp/classified.json)
 *   --dry-run                   print actions without making changes
 */
import crypto from "node:crypto";
import fs from "node:fs";

const GHOST_URL = process.env.GHOST_URL || "https://cms.basavapurushottam.com";
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_KEY;
if (!GHOST_ADMIN_KEY) {
  console.error("Missing GHOST_ADMIN_KEY env var.");
  process.exit(1);
}

const args = process.argv.slice(2);
const planArg = args.find((a) => a.startsWith("--plan="));
const planPath = planArg ? planArg.split("=", 2)[1] : "/tmp/classified.json";
const dryRun = args.includes("--dry-run");

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

async function fetchAdminPost(id, token) {
  const res = await fetch(
    `${GHOST_URL}/ghost/api/admin/posts/${id}/?include=tags&formats=lexical,mobiledoc`,
    {
      headers: { Authorization: `Ghost ${token}`, "Accept-Version": "v5.0" },
    }
  );
  if (!res.ok) {
    throw new Error(`GET ${id}: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  return json.posts?.[0];
}

async function updateTags(post, tagSlugs, token) {
  // Send tags as { slug } objects — Ghost will resolve to existing tags by slug
  // and create new ones if they don't yet exist.
  const tagsPayload = tagSlugs.map((s) => ({ slug: s }));
  const res = await fetch(`${GHOST_URL}/ghost/api/admin/posts/${post.id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Ghost ${token}`,
      "Content-Type": "application/json",
      "Accept-Version": "v5.0",
    },
    body: JSON.stringify({
      posts: [{ tags: tagsPayload, updated_at: post.updated_at }],
    }),
  });
  if (!res.ok) {
    throw new Error(`PUT ${post.id}: ${res.status} ${await res.text()}`);
  }
}

async function main() {
  const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
  const todo = plan.filter((p) => Array.isArray(p.new_tags) && p.new_tags.length > 0);

  console.log(`Loaded ${plan.length} entries, ${todo.length} need updates.`);
  if (dryRun) console.log("(dry-run mode: no changes will be made)\n");

  const token = adminJwt(GHOST_ADMIN_KEY);
  let ok = 0;
  let fail = 0;

  for (const entry of todo) {
    try {
      const full = await fetchAdminPost(entry.id, token);
      const existingSlugs = new Set(
        (full.tags || []).map((t) => t.slug).filter(Boolean)
      );
      const merged = [...existingSlugs];
      for (const t of entry.new_tags) if (!existingSlugs.has(t)) merged.push(t);

      if (dryRun) {
        console.log(`DRY  ${entry.slug}`);
        console.log(`     keep: ${[...existingSlugs].join(", ") || "(none)"}`);
        console.log(`     add:  ${entry.new_tags.join(", ")}`);
      } else {
        await updateTags(full, merged, token);
        console.log(`OK   ${entry.slug}  +${entry.new_tags.join(",")}`);
      }
      ok++;
    } catch (err) {
      console.error(`FAIL ${entry.slug}: ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone. ${ok} updated, ${fail} failed.`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
