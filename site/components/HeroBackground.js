import Image from "next/image";
import { getPageHeroBackground } from "../lib/pageBackgrounds";

export default function HeroBackground({ page, overlay = 0.55 }) {
  const src = getPageHeroBackground(page);

  return (
    <>
      <Image
        src={src}
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
      />
      <div
        style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${overlay})` }}
        aria-hidden="true"
      />
    </>
  );
}
