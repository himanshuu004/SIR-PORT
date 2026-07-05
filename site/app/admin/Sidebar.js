"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const GHOST = "https://cms.basavapurushottam.com/ghost";

export default function Sidebar({ postCount = 0, memberCount = 0 }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function NavItem({ icon, label, href, badge, badgeRed, external, active }) {
    const isActive = active ?? (href && !external && pathname === href);
    const cls = {
      display: "flex", alignItems: "center", gap: 10,
      padding: "9px 16px", margin: "1px 8px", borderRadius: 8,
      fontSize: 13.5, color: isActive ? "#14B8A6" : "rgba(255,255,255,0.6)",
      background: isActive ? "rgba(20,184,166,0.12)" : "transparent",
      cursor: "pointer", textDecoration: "none", transition: "all 0.15s",
    };
    const content = (
      <>
        <span style={{ width: 18, textAlign: "center", fontSize: 15 }}>{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
        {badge != null && (
          <span style={{
            background: badgeRed ? "#E8593C" : "rgba(20,184,166,0.2)",
            color: badgeRed ? "#fff" : "#14B8A6",
            fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10,
          }}>{badge}</span>
        )}
        {external && <span style={{ fontSize: 10, opacity: 0.4 }}>↗</span>}
      </>
    );
    if (external) return <a href={href} target="_blank" rel="noopener noreferrer" style={cls}>{content}</a>;
    if (href) return <Link href={href} style={cls}>{content}</Link>;
    return <div style={cls}>{content}</div>;
  }

  function SectionLabel({ children }) {
    return (
      <div style={{ padding: "16px 12px 8px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {children}
      </div>
    );
  }

  return (
    <aside style={{ width: 240, flexShrink: 0, background: "#0F1A2E", display: "flex", flexDirection: "column", overflowY: "auto", height: "100vh", position: "sticky", top: 0 }}>
      {/* Brand */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(20,184,166,0.15)" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Purushottam CMS</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Site Admin Panel</div>
      </div>

      {/* Content */}
      <SectionLabel>Content</SectionLabel>
      <NavItem icon="📊" label="Dashboard" href="/admin" />
      <NavItem icon="✍️" label="Articles" href={`${GHOST}/#/posts`} badge={postCount || null} external />
      <NavItem icon="🏷️" label="Tags & Topics" href={`${GHOST}/#/tags`} external />
      <NavItem icon="📄" label="Static Pages" href={`${GHOST}/#/pages`} external />
      <NavItem icon="🖼️" label="Media Library" href={`${GHOST}/#/media`} external />

      {/* Audience */}
      <SectionLabel>Audience</SectionLabel>
      <NavItem icon="📥" label="Inbox" href="/admin/inbox" />
      <NavItem icon="📬" label="Newsletter" href={`${GHOST}/#/members`} badge={memberCount || null} external />

      {/* Sacred Texts */}
      <SectionLabel>Sacred Texts</SectionLabel>
      <NavItem icon="📖" label="Bhagavad Gita" href="/admin/geeta" />
      <NavItem icon="🧘" label="Yoga Sutras" href="/admin/pys" />

      {/* Analytics */}
      <SectionLabel>Analytics</SectionLabel>
      <NavItem icon="📈" label="Traffic & Views" href="https://analytics.google.com" external />
      <NavItem icon="🔥" label="Popular Articles" href="https://analytics.google.com" external />
      <NavItem icon="🌍" label="Audience Geography" href="https://analytics.google.com" external />

      {/* Site */}
      <SectionLabel>Site</SectionLabel>
      <NavItem icon="⚙️" label="Integrations" href="/admin/settings" />
      <NavItem icon="🔗" label="Ghost CMS" href={`${GHOST}`} external />

      {/* Footer */}
      <div style={{ marginTop: "auto", padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#14B8A6,#5EEAD4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#0F1A2E" }}>BP</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Dr. Purushottam</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Super Admin</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{ width: "100%", padding: "7px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
          Log out
        </button>
      </div>
    </aside>
  );
}
