import { readFileSync } from "fs";
import { join } from "path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getGhostMemberCount, getGhostPostCount } from "../../../lib/ghost-admin";
import { verifySessionFromCookieStore } from "../../../lib/admin-auth";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings — Admin",
  robots: "noindex, nofollow",
};

function getConfig() {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "data", "site-config.json"), "utf8"));
  } catch {
    return { maintenanceMode: false, maintenanceMessage: "", maintenanceSubtext: "" };
  }
}


export default async function SettingsPage() {
  const cookieStore = await cookies();
  const valid = verifySessionFromCookieStore(cookieStore);
  if (!valid) redirect("/admin/login");

  const config = getConfig();
  const [postCount, memberCount] = await Promise.all([
    getGhostPostCount().catch(() => 0),
    getGhostMemberCount().catch(() => 0),
  ]);

  const ghostConnected = !!(process.env.GHOST_URL && process.env.GHOST_KEY);
  const mailgunConnected = !!(process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN);
  const ghostAdminConnected = !!process.env.GHOST_ADMIN_KEY;

  return (
    <SettingsClient
      initialConfig={config}
      postCount={postCount}
      memberCount={memberCount}
      ghostConnected={ghostConnected}
      mailgunConnected={mailgunConnected}
      ghostAdminConnected={ghostAdminConnected}
      ghostUrl={process.env.GHOST_URL ?? ""}
      mailgunDomain={process.env.MAILGUN_DOMAIN ?? ""}
    />
  );
}
