import ReaderClient from "../ReaderClient";

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

export default function PYSPage() {
  return <ReaderClient bookSlug="pys" />;
}
