import crypto from "crypto";

function ghostAdminJWT() {
  const adminKey = process.env.GHOST_ADMIN_KEY;
  if (!adminKey) return null;
  const [id, secret] = adminKey.split(":");
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT", kid: id })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ iat: now, exp: now + 300, aud: "/admin/" })).toString("base64url");
  const sig = crypto.createHmac("sha256", Buffer.from(secret, "hex"))
    .update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${sig}`;
}

export async function getGhostMemberCount() {
  try {
    const jwt = ghostAdminJWT();
    if (!jwt) return 0;
    const res = await fetch(`${process.env.GHOST_URL}/ghost/api/admin/members/?limit=1`, {
      headers: { Authorization: `Ghost ${jwt}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.meta?.pagination?.total ?? 0;
  } catch { return 0; }
}

export async function getGhostRecentPosts(limit = 5) {
  try {
    const jwt = ghostAdminJWT();
    if (!jwt) return [];
    const res = await fetch(
      `${process.env.GHOST_URL}/ghost/api/admin/posts/?limit=${limit}&order=updated_at%20desc&fields=id,title,status,published_at,updated_at,reading_time&include=tags`,
      { headers: { Authorization: `Ghost ${jwt}` }, next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts ?? [];
  } catch { return []; }
}

export async function getGhostPostCount() {
  try {
    const jwt = ghostAdminJWT();
    if (!jwt) return 0;
    const res = await fetch(`${process.env.GHOST_URL}/ghost/api/admin/posts/?limit=1`, {
      headers: { Authorization: `Ghost ${jwt}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.meta?.pagination?.total ?? 0;
  } catch { return 0; }
}
