import geetaRaw from "../data/sacred/geeta_data.json";
import pysRaw from "../data/sacred/yoga_sutras_data.json";

export function normaliseGeeta(raw) {
  return {
    bookTitle: "Bhagavad Gita",
    bookSubtitle: "18 Chapters · 700 Verses",
    bookSlug: "geeta",
    chapterLabel: "Chapter",
    entryLabel: "Verse",
    color: "#4338CA",
    icon: "🪷",
    description:
      "The eternal dialogue between Arjuna and Krishna on the battlefield of Kurukshetra — a timeless guide to duty, action, consciousness, and the nature of the Self.",
    chapters: raw.chapters.map((ch) => ({
      num: ch.chapter,
      name: ch.name,
      image: ch.image || null,
      totalEntries: ch.total_verse_entries,
      entries: ch.verses.map((v) => ({
        label: v.verse,
        start: v.verse_start,
        end: v.verse_end,
        sanskrit: v.sanskrit || "",
        transliteration: v.transliteration || "",
        wordMeanings: v.word_meanings || "",
        commentary: v.commentary || "",
        available: true,
      })),
    })),
  };
}

export function normalisePys(raw) {
  return {
    bookTitle: "Patanjali Yoga Sutras",
    bookSubtitle: "4 Padas · 196 Sutras",
    bookSlug: "pys",
    chapterLabel: "Pada",
    entryLabel: "Sutra",
    color: "#8B5CF6",
    icon: "🧘",
    description:
      "The foundational text of classical yoga philosophy — a precise map of the mind, consciousness, and the path to liberation. Explore all four padas with Sanskrit, transliteration, and commentary.",
    chapters: raw.chapters.map((ch) => ({
      num: ch.chapter,
      name: ch.name,
      image: ch.image || null,
      totalEntries: ch.sutras_available ?? ch.total_sutras_expected,
      entries: ch.sutras.map((s) => ({
        label: s.sutra,
        start: s.sutra_start,
        end: s.sutra_end,
        sanskrit: s.sanskrit || "",
        transliteration: "",
        wordMeanings: s.word_breakdown || "",
        commentary: s.commentary || "",
        available: s.available !== false,
      })),
    })),
  };
}

const BOOKS = {
  geeta: () => normaliseGeeta(geetaRaw),
  pys: () => normalisePys(pysRaw),
};

export function getSacredText(book) {
  const load = BOOKS[book];
  return load ? load() : null;
}
