import { google } from "googleapis";

let cachedClient = null;

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let key = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !key) return null;
  if (key.includes("\\n")) key = key.replace(/\\n/g, "\n");
  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getClient() {
  if (cachedClient) return cachedClient;
  const auth = getAuth();
  if (!auth) return null;
  cachedClient = google.sheets({ version: "v4", auth });
  return cachedClient;
}

export function isSheetsConfigured() {
  return Boolean(
    process.env.GOOGLE_SHEET_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );
}

export async function readSheet(tabName, range = "A2:Z") {
  const sheets = getClient();
  if (!sheets) return [];
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tabName}!${range}`,
    });
    return res.data.values ?? [];
  } catch (err) {
    console.error(`[Sheets] read ${tabName} failed:`, err.message);
    return [];
  }
}

export async function appendRow(tabName, row) {
  const sheets = getClient();
  if (!sheets) return { ok: false, error: "not_configured" };
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${tabName}!A:Z`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });
    return { ok: true };
  } catch (err) {
    console.error(`[Sheets] append ${tabName} failed:`, err.message);
    return { ok: false, error: err.message };
  }
}
