"use client";
import { useState } from "react";

const TH = { textAlign: "left", padding: "10px 12px", fontSize: 12, fontWeight: 700, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #e5e7eb", background: "#FAFAF8", position: "sticky", top: 0 };
const TD = { padding: "10px 12px", fontSize: 13.5, color: "#1C1917", borderBottom: "1px solid #f3f4f6", verticalAlign: "top" };

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function InboxClient({ messages, subscribers }) {
  const [tab, setTab] = useState("messages");

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1200 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Inbox</h1>
      <p style={{ color: "#78716C", fontSize: 13, marginBottom: 20 }}>
        Contact form submissions and newsletter signups, mirrored from the live site to Google Sheets.
      </p>

      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #e5e7eb", marginBottom: 16 }}>
        <button
          onClick={() => setTab("messages")}
          style={{
            padding: "10px 16px", border: "none", background: "none",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            color: tab === "messages" ? "#0F1A2E" : "#78716C",
            borderBottom: tab === "messages" ? "2px solid #14B8A6" : "2px solid transparent",
            marginBottom: -1,
          }}
        >
          📬 Messages <span style={{ opacity: 0.5, fontWeight: 400 }}>({messages.length})</span>
        </button>
        <button
          onClick={() => setTab("subscribers")}
          style={{
            padding: "10px 16px", border: "none", background: "none",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            color: tab === "subscribers" ? "#0F1A2E" : "#78716C",
            borderBottom: tab === "subscribers" ? "2px solid #14B8A6" : "2px solid transparent",
            marginBottom: -1,
          }}
        >
          📧 Subscribers <span style={{ opacity: 0.5, fontWeight: 400 }}>({subscribers.length})</span>
        </button>
      </div>

      {tab === "messages" && (
        messages.length === 0 ? (
          <p style={{ color: "#78716C", fontSize: 14, padding: 24, textAlign: "center", border: "1px dashed #e5e7eb", borderRadius: 8 }}>
            No messages yet. Submissions from the contact form will appear here.
          </p>
        ) : (
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "auto", maxHeight: "70vh" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={TH}>When</th>
                  <th style={TH}>From</th>
                  <th style={TH}>Type</th>
                  <th style={TH}>Message</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m, i) => (
                  <tr key={i}>
                    <td style={{ ...TD, whiteSpace: "nowrap", color: "#78716C" }}>{formatTime(m.timestamp)}</td>
                    <td style={TD}>
                      <div style={{ fontWeight: 600 }}>{m.name}</div>
                      <a href={`mailto:${m.email}`} style={{ color: "#0F1A2E", fontSize: 12 }}>{m.email}</a>
                      {m.org && <div style={{ fontSize: 12, color: "#78716C" }}>{m.org}</div>}
                    </td>
                    <td style={{ ...TD, whiteSpace: "nowrap" }}>{m.type}</td>
                    <td style={{ ...TD, whiteSpace: "pre-wrap", maxWidth: 500 }}>{m.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {tab === "subscribers" && (
        subscribers.length === 0 ? (
          <p style={{ color: "#78716C", fontSize: 14, padding: 24, textAlign: "center", border: "1px dashed #e5e7eb", borderRadius: 8 }}>
            No subscribers yet. New newsletter signups will appear here.
          </p>
        ) : (
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "auto", maxHeight: "70vh" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={TH}>When</th>
                  <th style={TH}>Email</th>
                  <th style={TH}>Name</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s, i) => (
                  <tr key={i}>
                    <td style={{ ...TD, whiteSpace: "nowrap", color: "#78716C" }}>{formatTime(s.timestamp)}</td>
                    <td style={TD}><a href={`mailto:${s.email}`} style={{ color: "#0F1A2E" }}>{s.email}</a></td>
                    <td style={TD}>{s.name}</td>
                    <td style={{ ...TD, color: "#78716C" }}>{s.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
