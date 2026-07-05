import ReaderClient from "../ReaderClient";
import rawData from "../../../data/sacred/yoga_sutras_data.json";

export const metadata = {
  title: "Patanjali Yoga Sutras — Interactive Commentary",
  description:
    "Sutra-by-sutra interactive commentary on the Patanjali Yoga Sutras. Read the original Sanskrit and Dr. Purushottam's personal reflections on all 196 sutras across 4 padas.",
  keywords: ["Yoga Sutras", "Patanjali", "sutra commentary", "classical yoga", "yoga philosophy", "chitta vritti nirodha", "Sanskrit sutras"],
  openGraph: {
    title: "Patanjali Yoga Sutras — Interactive Commentary · Dr. B.V.R.C. Purushottam",
    description: "Sutra-by-sutra commentary on the Yoga Sutras — Sanskrit and personal reflections. 4 padas, 196 sutras.",
    url: "https://basavapurushottam.com/philosophy/pys",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Patanjali Yoga Sutras — Interactive Commentary" },
  alternates: { canonical: "https://basavapurushottam.com/philosophy/pys" },
};

function normalise(raw) {
  return {
    bookTitle:    "Patanjali Yoga Sutras",
    bookSubtitle: "4 Padas · 196 Sutras",
    bookSlug:     "pys",
    chapterLabel: "Pada",
    entryLabel:   "Sutra",
    color:        "#8B5CF6",   // Purple
    icon:         "🧘",
    description:
      "The foundational text of classical yoga philosophy — a precise map of the mind, consciousness, and the path to liberation. Explore all four padas with Sanskrit, transliteration, and commentary.",
    chapters: raw.chapters.map((ch) => ({
      num:          ch.chapter,
      name:         ch.name,
      image:        ch.image || null,
      totalEntries: ch.sutras_available ?? ch.total_sutras_expected,
      entries: ch.sutras.map((s) => ({
        label:          s.sutra,
        start:          s.sutra_start,
        end:            s.sutra_end,
        sanskrit:       s.sanskrit        || "",
        transliteration:"",               // PYS doesn't have transliteration field
        wordMeanings:   s.word_breakdown  || "",
        commentary:     s.commentary      || "",
        available:      s.available !== false,
      })),
    })),
  };
}

export default function PYSPage() {
  const data = normalise(rawData);
  return <ReaderClient data={data} />;
}
