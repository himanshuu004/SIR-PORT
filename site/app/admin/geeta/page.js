import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getGhostMemberCount, getGhostPostCount } from "../../../lib/ghost-admin";
import { verifySessionFromCookieStore } from "../../../lib/admin-auth";
import Sidebar from "../Sidebar";
import SacredTextEditor from "../SacredTextEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bhagavad Gita — Admin", robots: "noindex, nofollow" };

export default async function GeetaAdminPage() {
  const cookieStore = await cookies();
  const valid = verifySessionFromCookieStore(cookieStore);
  if (!valid) redirect("/admin/login");

  const [postCount, memberCount] = await Promise.all([
    getGhostPostCount().catch(() => 0),
    getGhostMemberCount().catch(() => 0),
  ]);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Source Sans 3','Segoe UI',system-ui,sans-serif", background: "#F0F2F5", color: "#1C1917" }}>
      <Sidebar postCount={postCount} memberCount={memberCount} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 28px", height: 56, display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0F1A2E" }}>📖 Bhagavad Gita — JSON Content Editor</div>
          <span style={{ marginLeft: 12, fontSize: 12, color: "#9CA3AF" }}>18 Chapters · 700 Verses</span>
        </div>
        <div style={{ padding: 28 }}>
          <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#1E40AF", marginBottom: 20 }}>
            ℹ️ Click <strong>✏ Edit</strong> on any row to edit it inline. Changes are saved directly to the JSON file on disk.
          </div>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 24 }}>
            <SacredTextEditor type="geeta" />
          </div>
        </div>
      </div>
    </div>
  );
}
