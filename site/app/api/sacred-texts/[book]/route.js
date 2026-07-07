import { NextResponse } from "next/server";
import { getSacredText } from "../../../../lib/sacredTexts";

export async function GET(_request, { params }) {
  const { book } = await params;
  const data = getSacredText(book);

  if (!data) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
