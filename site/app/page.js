import Nav from "../components/Nav";
import BottomSection from "../components/BottomSection";
import HomeClient from "./HomeClient";
import { getFeaturedPosts, getPostsByTag } from "../lib/ghost";

const PILLAR_TAGS = ["mind-machine", "policy-lab", "philosophy", "proving-ground"];

export const dynamic = "force-dynamic";

// Home page inherits global metadata from layout.js + adds JSON-LD
export const metadata = {
  alternates: { canonical: "https://basavapurushottam.com" },
};

export default async function HomePage() {
  let posts = [];
  const pillarCounts = {};
  try {
    const [featured, ...byTag] = await Promise.all([
      getFeaturedPosts(3),
      ...PILLAR_TAGS.map((tag) => getPostsByTag(tag, 100)),
    ]);
    posts = featured;
    PILLAR_TAGS.forEach((tag, i) => {
      pillarCounts[tag] = (byTag[i] || []).length;
    });
  } catch {
    // Ghost empty or unreachable — fall back to static data in HomeClient
  }

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Dr. B.V.R.C. Purushottam",
    alternateName: "Basava Purushottam",
    url: "https://basavapurushottam.com",
    image: "https://basavapurushottam.com/bvrclogo.png",
    jobTitle: "Indian Administrative Service Officer",
    description:
      "IAS officer, AI practitioner and philosopher writing on governance, artificial intelligence, and the intersection of Eastern wisdom with modern science.",
    sameAs: [
      "https://linkedin.com/in/basava-purushottam-b862247",
      "https://x.com/basava_ias",
      "https://www.facebook.com/basava.ias",
    ],
    knowsAbout: [
      "Artificial Intelligence", "Governance", "Bhagavad Gita",
      "Yoga Sutras", "Philosophy of Mind", "Machine Learning", "GovTech",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dr. B.V.R.C. Purushottam",
    url: "https://basavapurushottam.com",
    description:
      "A civil servant's notebook on AI, philosophy of mind, and the art of governing 1.4 billion people.",
    author: { "@type": "Person", name: "Dr. B.V.R.C. Purushottam" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Nav />
      <main id="main">
        <HomeClient posts={posts} pillarCounts={pillarCounts} />
      </main>
      <BottomSection variant="general" />
    </>
  );
}
