"use client";
import Link from "next/link";
import Sidebar from "./Sidebar";

const GHOST = "https://cms.basavapurushottam.com/ghost";

function StatCard({ label, icon, value, delta, deltaRed }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #E5E7EB" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 12, color: "#57534E", fontWeight: 500, marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 22, opacity: 0.35 }}>{icon}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#0F1A2E" }}>{value}</div>
      {delta && <div style={{ fontSize: 12, marginTop: 4, color: deltaRed ? "#E8593C" : "#10B981" }}>{delta}</div>}
    </div>
  );
}

function Card({ title, action, actionHref, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0F1A2E" }}>{title}</div>
        {action && <a href={actionHref} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#14B8A6", fontWeight: 600, textDecoration: "none" }}>{action}</a>}
      </div>
      {children}
    </div>
  );
}

function ArticleRow({ post }) {
  const TAG_COLORS = {
    "mind-and-machine": "#3B82F6", "policy-lab": "#14B8A6",
    "philosophy": "#8B5CF6", "proving-ground": "#E8593C", default: "#10B981",
  };
  const tag = post.tags?.[0]?.slug ?? "default";
  const dotColor = TAG_COLORS[tag] ?? TAG_COLORS.default;

  const STATUS = {
    published: { label: "Published", bg: "#D1FAE5", color: "#065F46" },
    draft: { label: "Draft", bg: "#FEF3C7", color: "#92400E" },
    scheduled: { label: "Scheduled", bg: "#EDE9FE", color: "#5B21B6" },
  };
  const s = STATUS[post.status] ?? STATUS.draft;

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Draft";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderBottom: "1px solid #F3F4F6" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1C1917", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.title}</div>
        <div style={{ fontSize: 11, color: "#57534E", marginTop: 2 }}>
          {post.tags?.[0]?.name ?? "Uncategorised"} · {date} {post.reading_time ? `· ${post.reading_time} min` : ""}
        </div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: s.bg, color: s.color, flexShrink: 0 }}>{s.label}</span>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <a href={`${GHOST}/#/editor/post/${post.id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, padding: "3px 8px", borderRadius: 5, border: "1px solid #E5E7EB", background: "transparent", color: "#57534E", textDecoration: "none" }}>Edit</a>
        {post.status === "published" && post.slug && (
          <a href={`https://basavapurushottam.com/${post.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, padding: "3px 8px", borderRadius: 5, border: "1px solid #E5E7EB", background: "transparent", color: "#57534E", textDecoration: "none" }}>View</a>
        )}
      </div>
    </div>
  );
}

function QuickAction({ icon, label, desc, href }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ padding: 14, borderRadius: 10, border: "1px solid #E5E7EB", background: "#FAFAF8", cursor: "pointer", textAlign: "left", textDecoration: "none", display: "block", transition: "border-color 0.15s" }}>
      <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#1C1917" }}>{label}</div>
      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{desc}</div>
    </a>
  );
}

const ACTIVITY = [
  { icon: "📬", bg: "#D1FAE5", text: "Newsletter signup API is active", time: "Live" },
  { icon: "✉️", bg: "#EDE9FE", text: "Contact form connected to basava.ias@gmail.com", time: "Live" },
  { icon: "📖", bg: "#FEF3C7", text: "Bhagavad Gita & Yoga Sutras reader deployed", time: "This session" },
  { icon: "🌐", bg: "#DBEAFE", text: "Site live at basavapurushottam.com", time: "In progress" },
];

export default function AdminClient({ posts = [], postCount = 0, memberCount = 0, maintenanceMode = false }) {
  const BARS = [40, 55, 35, 70, 60, 90, 100];
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Source Sans 3','Segoe UI',system-ui,sans-serif", background: "#F0F2F5", color: "#1C1917" }}>
      <Sidebar postCount={postCount} memberCount={memberCount} />

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Topbar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0F1A2E" }}>Dashboard Overview</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#9CA3AF" }}>basavapurushottam.com</span>
            {maintenanceMode && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E8593C" }} title="Maintenance mode ON" />}
            <a href="/" target="_blank" rel="noopener noreferrer" style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "1px solid #E5E7EB", color: "#57534E", textDecoration: "none" }}>Preview Site</a>
            <a href={`${GHOST}/#/editor/post/new`} target="_blank" rel="noopener noreferrer" style={{ padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "#14B8A6", color: "#0F1A2E", textDecoration: "none" }}>+ New Article</a>
          </div>
        </div>

        <div style={{ padding: 28 }}>

          {/* Maintenance warning */}
          {maintenanceMode && (
            <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 8, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#92400E" }}>
              ⚠️ <strong>Maintenance mode is ON.</strong> Visitors see the maintenance page.
              <Link href="/admin/settings" style={{ marginLeft: "auto", color: "#92400E", fontWeight: 600 }}>Turn off →</Link>
            </div>
          )}

          {/* Ghost CMS Banner */}
          <div style={{ background: "linear-gradient(135deg, #0F1A2E, #1B2A4A)", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 28 }}>👻</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Content is managed via Ghost CMS</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>Articles, drafts, tags, and media live at cms.basavapurushottam.com — changes publish to site within 1 hour via ISR.</div>
            </div>
            <a href={GHOST} target="_blank" rel="noopener noreferrer" style={{ background: "#14B8A6", color: "#0F1A2E", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", textDecoration: "none", whiteSpace: "nowrap" }}>Open Ghost Admin →</a>
          </div>

          {/* Stats */}
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>At a Glance</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
            <StatCard label="📝 Total Articles" icon="✍️" value={postCount || "—"} delta={postCount ? "via Ghost CMS" : null} />
            <StatCard label="📬 Newsletter Subscribers" icon="📩" value={memberCount || "—"} delta={memberCount ? "Active subscribers" : null} />
            <StatCard label="👁 Page Views (30d)" icon="📊" value="—" delta="Connect GA4 to see" />
            <StatCard label="📨 Contact Messages" icon="💬" value="→ Gmail" delta="Delivered to inbox" />
          </div>

          {/* Articles + Right column */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>

            {/* Recent Articles */}
            <Card title="Recent Articles" action="Manage in Ghost →" actionHref={`${GHOST}/#/posts`}>
              {posts.length > 0 ? (
                posts.map(p => <ArticleRow key={p.id} post={p} />)
              ) : (
                <div style={{ padding: "32px 20px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
                  No articles yet — <a href={`${GHOST}/#/editor/post/new`} target="_blank" rel="noopener noreferrer" style={{ color: "#14B8A6" }}>create your first one</a>
                </div>
              )}
            </Card>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Quick Actions */}
              <Card title="Quick Actions">
                <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <QuickAction icon="✍️" label="New Article" desc="Open Ghost editor" href={`${GHOST}/#/editor/post/new`} />
                  <QuickAction icon="📬" label="Send Newsletter" desc={`${memberCount} subscribers`} href={`${GHOST}/#/members`} />
                  <QuickAction icon="🖼️" label="Upload Media" desc="Images & files" href={`${GHOST}/#/media`} />
                  <QuickAction icon="⚙️" label="Site Settings" desc="Maintenance, SEO" href="/admin/settings" />
                </div>
              </Card>

              {/* Recent Activity */}
              <Card title="Recent Activity">
                <div style={{ padding: "0 20px" }}>
                  {ACTIVITY.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < ACTIVITY.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>{a.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, color: "#44403C", lineHeight: 1.5 }}>{a.text}</div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Traffic + Contact */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

            {/* Traffic chart placeholder */}
            <Card title="Page Views — Last 7 Days" action="Setup GA4 →" actionHref="/admin/settings">
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
                  <div><span style={{ fontSize: 22, fontWeight: 700, color: "#0F1A2E" }}>—</span> <span style={{ fontSize: 12, color: "#9CA3AF" }}>views</span></div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", paddingTop: 6 }}>Connect GA4 to see analytics</div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 60 }}>
                  {BARS.map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "4px 4px 0 0", background: i === 6 ? "#14B8A6" : "rgba(20,184,166,0.15)" }} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 5, marginTop: 4 }}>
                  {DAYS.map(d => <div key={d} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "#9CA3AF" }}>{d}</div>)}
                </div>
              </div>
            </Card>

            {/* Contact info */}
            <Card title="Contact Inbox">
              <div style={{ padding: "20px" }}>
                <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: "#1E40AF" }}>
                  ℹ️ Contact form messages are delivered directly to <strong>basava.ias@gmail.com</strong> via Mailgun.
                </div>
                <a href="mailto:basava.ias@gmail.com" style={{ display: "block", padding: "10px 14px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, color: "#1C1917", textDecoration: "none", fontWeight: 500 }}>
                  📧 Open Gmail Inbox →
                </a>
                <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 12 }}>To store messages in a database, connect Google Sheets in Integrations settings.</p>
              </div>
            </Card>
          </div>

          <div style={{ textAlign: "center", padding: "16px 0 8px", fontSize: 12, color: "#9CA3AF" }}>
            Admin Panel · Dr. B.V.R.C. Purushottam · Prepared by Deepak
          </div>
        </div>
      </div>
    </div>
  );
}
