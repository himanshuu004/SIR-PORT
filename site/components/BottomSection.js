import Image from "next/image";
import Footer from "./Footer";
import NewsletterCTA from "./NewsletterCTA";

export default function BottomSection({ variant = "general" }) {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/Background/3.jpg"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div className="relative">
        <NewsletterCTA variant={variant} overlay />
        <Footer overlay />
      </div>
    </section>
  );
}
