import Image from "next/image";
import Footer from "./Footer";
import NewsletterCTA from "./NewsletterCTA";

export default function BottomSection({ variant = "general", showNewsletter = true }) {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/Background/IMG_6003.PNG"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
      <div className="relative">
        {showNewsletter && <NewsletterCTA variant={variant} overlay />}
        <Footer overlay />
      </div>
    </section>
  );
}
