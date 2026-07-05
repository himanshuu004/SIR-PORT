import { NextResponse } from "next/server";
import { readSheet, isSheetsConfigured } from "../../../lib/sheets";

// Convert rows array → array of objects using first row as headers
function parseRows(rows) {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0];
  return rows
    .slice(1)
    .filter((row) => row.some((cell) => cell && cell.toString().trim()))
    .map((row) => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i] ?? ""; });
      return obj;
    });
}

export async function GET() {
  if (!isSheetsConfigured()) {
    return NextResponse.json(
      {
        error:
          "Google Sheets not configured. Set GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, and GOOGLE_PRIVATE_KEY in env vars.",
      },
      { status: 503 }
    );
  }

  // Read each tab including its header row (A1:Z) — parseRows consumes row 0 as headers
  const [wRaw, rRaw, hRaw] = await Promise.all([
    readSheet("Weight", "A1:Z"),
    readSheet("Running", "A1:Z"),
    readSheet("Hiking", "A1:Z"),
  ]);

  return NextResponse.json({
    weight: parseRows(wRaw),
    running: parseRows(rRaw),
    hiking: parseRows(hRaw),
    configured: {
      weight: wRaw.length > 0,
      running: rRaw.length > 0,
      hiking: hRaw.length > 0,
    },
    updatedAt: new Date().toISOString(),
  });
}
