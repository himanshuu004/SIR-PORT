import { readFileSync } from "fs";
import { join } from "path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getGhostRecentPosts, getGhostMemberCount, getGhostPostCount } from "../../lib/ghost-admin";
import { verifySessionFromCookieStore } from "../../lib/admin-auth";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — basavapurushottam.com",
  robots: "noindex, nofollow",
};

function getConfig() {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "data", "site-config.json"), "utf8"));
  } catch {
    return { maintenanceMode: false };
  }
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const valid = verifySessionFromCookieStore(cookieStore);
  if (!valid) redirect("/admin/login");

  const config = getConfig();
  const [posts, postCount, memberCount] = await Promise.all([
    getGhostRecentPosts(5).catch(() => []),
    getGhostPostCount().catch(() => 0),
    getGhostMemberCount().catch(() => 0),
  ]);

  return (
    <AdminClient
      posts={posts}
      postCount={postCount}
      memberCount={memberCount}
      maintenanceMode={config.maintenanceMode}
    />
  );
}
