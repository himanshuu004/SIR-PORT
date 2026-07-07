import ReaderClient from "../ReaderClient";

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

export default function GeetaPage() {
  return <ReaderClient bookSlug="geeta" />;
}
