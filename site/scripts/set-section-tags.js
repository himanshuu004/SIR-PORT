#!/usr/bin/env node
/**
 * Replace section tags on Ghost posts according to a pre-computed plan.
 *
 * Plan file format (default: scripts/set-tags-plan.json):
 *   [
 *     { id, slug, title, existing: [...], final: [...] }
 *   ]
 *
 * `final` is the COMPLETE target tag list for the post — non-section tags
 * we want to preserve are already merged in. The script simply PUTs this
 * exact list, so stale section tags get cleared in the same call.
 *
 * Usage:
 *   cd site
 *   GHOST_URL=https://cms.basavapurushottam.com \
 *   GHOST_ADMIN_KEY=<admin-key> \
 *   node scripts/set-section-tags.js
 *
 * Flags:
 *   --plan=/path/to/file.json   default: scripts/set-tags-plan.json
 *   --dry-run                   show actions without making changes
 *
 * Idempotent: re-running after success sees no diffs and exits clean.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const GHOST_URL = process.env.GHOST_URL || "https://cms.basavapurushottam.com";
const GHOST_ADMIN_KEY = process.env.GHOST_ADMIN_KEY;
if (!GHOST_ADMIN_KEY) {
  console.error("Missing GHOST_ADMIN_KEY env var.");
  process.exit(1);
}

const args = process.argv.slice(2);
const planArg = args.find((a) => a.startsWith("--plan="));
const planPath = planArg
  ? planArg.split("=", 2)[1]
  : path.join(path.dirname(new URL(import.meta.url).pathname), "set-tags-plan.json");
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
    { headers: { Authorization: `Ghost ${token}`, "Accept-Version": "v5.0" } }
  );
  if (!res.ok) throw new Error(`GET ${id}: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.posts?.[0];
}

async function setTags(post, tagSlugs, token) {
  // Send { slug } objects so Ghost resolves to existing tags or creates new ones.
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
  console.log(`Loaded ${plan.length} entries from ${planPath}`);
  if (dryRun) console.log("(dry-run mode: no changes will be made)\n");

  const token = adminJwt(GHOST_ADMIN_KEY);
  let ok = 0;
  let fail = 0;

  for (const entry of plan) {
    const removed = entry.existing.filter((t) => !entry.final.includes(t));
    const added = entry.final.filter((t) => !entry.existing.includes(t));
    if (removed.length === 0 && added.length === 0) {
      continue; // no diff
    }

    try {
      if (dryRun) {
        console.log(`DRY  ${entry.slug}`);
        if (removed.length) console.log(`     remove: ${removed.join(", ")}`);
        if (added.length)   console.log(`     add:    ${added.join(", ")}`);
      } else {
        const full = await fetchAdminPost(entry.id, token);
        await setTags(full, entry.final, token);
        const diff = [
          removed.length ? `-${removed.join(",")}` : "",
          added.length ? `+${added.join(",")}` : "",
        ].filter(Boolean).join(" ");
        console.log(`OK   ${entry.slug}  ${diff}`);
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
