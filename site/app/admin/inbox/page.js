import { readSheet, isSheetsConfigured } from "../../../lib/sheets";
import InboxClient from "./InboxClient";

export const metadata = { title: "Inbox · Admin" };
export const dynamic = "force-dynamic";

export default async function InboxPage() {
  if (!isSheetsConfigured()) {
    return (
      <div style={{ padding: 32 }}>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>Inbox</h1>
        <p style={{ color: "#78716C" }}>
          Google Sheets is not configured. Set <code>GOOGLE_SHEET_ID</code>,
          <code> GOOGLE_SERVICE_ACCOUNT_EMAIL</code>, and
          <code> GOOGLE_PRIVATE_KEY</code> in environment variables.
        </p>
      </div>
    );
  }

  const [messageRows, subscriberRows] = await Promise.all([
    readSheet("Messages"),
    readSheet("Subscribers"),
  ]);

  // Newest first
  const messages = [...messageRows].reverse().map((r) => ({
    timestamp: r[0] || "",
    name: r[1] || "",
    email: r[2] || "",
    type: r[3] || "",
    message: r[4] || "",
    date: r[5] || "",
    audience: r[6] || "",
    org: r[7] || "",
    domain: r[8] || "",
    publication: r[9] || "",
    deadline: r[10] || "",
  }));

  const subscribers = [...subscriberRows].reverse().map((r) => ({
    timestamp: r[0] || "",
    email: r[1] || "",
    name: r[2] || "",
    source: r[3] || "",
  }));

  return <InboxClient messages={messages} subscribers={subscribers} />;
}
