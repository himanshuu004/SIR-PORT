import { getAllPosts } from "../../lib/ghost";

const SITE_URL = "https://basavapurushottam.com";
const SITE_TITLE = "Dr. B.V.R.C. Purushottam, IAS";
const SITE_DESCRIPTION =
  "Essays on AI, governance, philosophy, and decision-making by a serving IAS officer.";
const AUTHOR_EMAIL = "basava.ias@gmail.com";

function escapeXml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getAllPosts(50).catch(() => []);

  const items = posts
    .map((p) => {
      const link = `${SITE_URL}/insights/${p.slug}`;
      const pubDate = new Date(p.published_at || Date.now()).toUTCString();
      const category = p.primary_tag?.name ? `<category>${escapeXml(p.primary_tag.name)}</category>` : "";
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(p.excerpt || "")}</description>
      ${category}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>${AUTHOR_EMAIL} (${SITE_TITLE})</managingEditor>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
