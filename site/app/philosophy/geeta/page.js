import ReaderClient from "../ReaderClient";
import rawData from "../../../data/sacred/geeta_data.json";

export const metadata = {
  title: "Bhagavad Gita — Interactive Commentary",
  description:
    "Verse-by-verse interactive commentary on the Bhagavad Gita. Read the original Sanskrit, transliteration, and Dr. Purushottam's personal reflections side by side. 18 chapters, 700 verses.",
  keywords: ["Bhagavad Gita", "Gita commentary", "Sanskrit verses", "karma yoga", "Arjuna Krishna", "Gita in English", "IAS perspective Gita"],
  openGraph: {
    title: "Bhagavad Gita — Interactive Commentary · Dr. B.V.R.C. Purushottam",
    description: "Verse-by-verse commentary on the Bhagavad Gita — Sanskrit, transliteration, and personal reflections. 18 chapters, 700 verses.",
    url: "https://basavapurushottam.com/philosophy/geeta",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Bhagavad Gita — Interactive Commentary" },
  alternates: { canonical: "https://basavapurushottam.com/philosophy/geeta" },
};

function normalise(raw) {
  return {
    bookTitle:    "Bhagavad Gita",
    bookSubtitle: "18 Chapters · 700 Verses",
    bookSlug:     "geeta",
    chapterLabel: "Chapter",
    entryLabel:   "Verse",
    color:        "#4338CA",   // Indigo
    icon:         "🪷",
    description:
      "The eternal dialogue between Arjuna and Krishna on the battlefield of Kurukshetra — a timeless guide to duty, action, consciousness, and the nature of the Self.",
    chapters: raw.chapters.map((ch) => ({
      num:          ch.chapter,
      name:         ch.name,
      image:        ch.image || null,
      totalEntries: ch.total_verse_entries,
      entries: ch.verses.map((v) => ({
        label:          v.verse,
        start:          v.verse_start,
        end:            v.verse_end,
        sanskrit:       v.sanskrit       || "",
        transliteration:v.transliteration|| "",
        wordMeanings:   v.word_meanings  || "",
        commentary:     v.commentary     || "",
        available:      true,
      })),
    })),
  };
}

export default function GeetaPage() {
  const data = normalise(rawData);
  return <ReaderClient data={data} />;
}
