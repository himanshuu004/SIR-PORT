"use client";
import { useState, useEffect, useCallback } from "react";

export default function SacredTextEditor({ type }) {
  const isGeeta = type === "geeta";
  const [chapters, setChapters] = useState([]);
  const [chapterIdx, setChapterIdx] = useState(0);
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const LIMIT = 5;

  const load = useCallback(async (ci, pg) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sacred-texts?type=${type}&chapter=${ci}&page=${pg}&limit=${LIMIT}`);
      const data = await res.json();
      if (data.chapterList) setChapters(data.chapterList);
      setEntries(data.entries ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => { load(chapterIdx, page); }, [chapterIdx, page, load]);

  function startEdit(i, entry) {
    setEditIdx(i);
    if (isGeeta) {
      setEditData({ sanskrit: entry.sanskrit, transliteration: entry.transliteration, word_meanings: entry.word_meanings, commentary: entry.commentary });
    } else {
      setEditData({ sanskrit: entry.sanskrit, word_breakdown: entry.word_breakdown, commentary: entry.commentary });
    }
  }

  async function saveEdit(i) {
    setSaving(true); setSaveMsg("");
    const globalIdx = (page - 1) * LIMIT + i;
    try {
      const res = await fetch("/api/admin/sacred-texts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, chapterIdx, entryIdx: globalIdx, updates: editData }),
      });
      const data = await res.json();
      if (data.ok) {
        setSaveMsg("Saved!");
        setEditIdx(null);
        await load(chapterIdx, page);
      } else {
        setSaveMsg("Error: " + data.error);
      }
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 2500);
    }
  }

  const col3Label = isGeeta ? "TRANSLITERATION" : "WORD BREAKDOWN";
  const col4Label = isGeeta ? "ENGLISH / COMMENTARY" : "MEANING / COMMENTARY";

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{isGeeta ? "Chapter" : "Pada"}:</label>
        <select value={chapterIdx} onChange={e => { setChapterIdx(+e.target.value); setPage(1); setEditIdx(null); }}
          style={{ padding: "7px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, background: "#FAFAF8", fontFamily: "inherit", outline: "none" }}>
          {chapters.map(c => (
            <option key={c.i} value={c.i}>{isGeeta ? `Chapter ${c.num}` : `Pada ${c.num}`} — {c.name}</option>
          ))}
        </select>
        {saveMsg && <span style={{ fontSize: 12, color: saveMsg.startsWith("Error") ? "#EF4444" : "#10B981", fontWeight: 600 }}>{saveMsg === "Saved!" ? "✓ " + saveMsg : saveMsg}</span>}
        <a href={`/api/admin/export-json?type=${type}`} style={{ marginLeft: "auto", padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: "#D1FAE5", color: "#065F46", textDecoration: "none" }}>⬇ Export JSON</a>
      </div>

      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 1fr 90px", gap: 10, padding: "10px 0", background: "#F9FAFB", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
        {["NO.", "SANSKRIT", col3Label, col4Label, "ACTIONS"].map(h => (
          <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", paddingLeft: h === "NO." ? 0 : 4, textAlign: h === "NO." ? "center" : "left" }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      {loading ? (
        <div style={{ padding: "24px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>Loading…</div>
      ) : entries.map((entry, i) => {
        const isEditing = editIdx === i;
        const num = isGeeta ? entry.verse : entry.sutra;
        const translit = isGeeta ? entry.transliteration : entry.word_breakdown;
        const meaning = entry.commentary;

        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 1fr 90px", gap: 10, alignItems: "start", padding: "14px 0", borderBottom: "1px solid #F3F4F6", background: isEditing ? "#FFFBF0" : "transparent" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: isGeeta ? "#14B8A6" : "#3B82F6", textAlign: "center", paddingTop: 2 }}>{num}</div>

            {isEditing ? (
              <>
                <textarea value={editData.sanskrit} onChange={e => setEditData(d => ({ ...d, sanskrit: e.target.value }))}
                  rows={3} style={{ width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                <textarea value={editData[isGeeta ? "transliteration" : "word_breakdown"]} onChange={e => setEditData(d => ({ ...d, [isGeeta ? "transliteration" : "word_breakdown"]: e.target.value }))}
                  rows={3} style={{ width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                <textarea value={editData.commentary} onChange={e => setEditData(d => ({ ...d, commentary: e.target.value }))}
                  rows={3} style={{ width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <button onClick={() => saveEdit(i)} disabled={saving} style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: "1px solid #6EE7B7", background: "transparent", color: "#10B981", cursor: "pointer", fontFamily: "inherit" }}>{saving ? "…" : "✓ Save"}</button>
                  <button onClick={() => setEditIdx(null)} style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: "1px solid #E5E7EB", background: "transparent", color: "#57534E", cursor: "pointer", fontFamily: "inherit" }}>✕ Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 12, color: "#1C1917", lineHeight: 1.6 }}>{entry.sanskrit}</div>
                <div style={{ fontSize: 12, color: "#57534E", lineHeight: 1.6 }}>{typeof translit === "object" ? JSON.stringify(translit).substring(0, 80) + "…" : (translit ?? "—")}</div>
                <div style={{ fontSize: 12, color: "#57534E", lineHeight: 1.6 }}>{meaning ? meaning.substring(0, 100) + (meaning.length > 100 ? "…" : "") : "—"}</div>
                <div>
                  <button onClick={() => startEdit(i, entry)} style={{ fontSize: 11, padding: "4px 8px", borderRadius: 5, border: "1px solid #BFDBFE", background: "transparent", color: "#3B82F6", cursor: "pointer", fontFamily: "inherit" }}>✏ Edit</button>
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Pagination */}
      <div style={{ padding: "14px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F3F4F6", marginTop: 4 }}>
        <span style={{ fontSize: 12, color: "#9CA3AF" }}>
          Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total} {isGeeta ? "verses" : "sutras"} in {isGeeta ? `Chapter ${chapters[chapterIdx]?.num}` : `Pada ${chapters[chapterIdx]?.num}`}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "1px solid #E5E7EB", background: "transparent", color: page === 1 ? "#D1D5DB" : "#57534E", cursor: page === 1 ? "not-allowed" : "pointer", fontFamily: "inherit" }}>← Prev</button>
          <span style={{ fontSize: 12, color: "#9CA3AF", padding: "5px 8px" }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "1px solid #E5E7EB", background: "transparent", color: page === totalPages ? "#D1D5DB" : "#57534E", cursor: page === totalPages ? "not-allowed" : "pointer", fontFamily: "inherit" }}>Next →</button>
        </div>
      </div>
    </div>
  );
}
