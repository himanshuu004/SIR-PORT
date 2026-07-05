"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "system-ui, sans-serif", background: "#0F1A2E", color: "#fff" }}>
        <h2 style={{ fontSize: 24, marginBottom: 16 }}>Something went wrong</h2>
        <p style={{ color: "#9CA3AF", marginBottom: 24 }}>An unexpected error occurred.</p>
        <button
          onClick={() => reset()}
          style={{ background: "#C9A84C", color: "#0F1A2E", border: "none", padding: "10px 24px", borderRadius: 6, cursor: "pointer", fontWeight: 700 }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
