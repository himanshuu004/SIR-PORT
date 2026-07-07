export const HERO_BACKGROUNDS = [
  "/Background/peakpx.jpg",
  "/Background/1.jpg",
  "/Background/2.jpg",
  "/Background/3.jpg",
];

/** Stable per-page hero backgrounds — varied across pages, consistent on refresh. */
export const PAGE_HERO_BACKGROUNDS = {
  home: "/Background/peakpx.jpg",
  "mind-and-machine": "/Background/2.jpg",
  philosophy: "/Background/3.jpg",
  "policy-lab": "/Background/1.jpg",
  "proving-ground": "/Background/2.jpg",
  "the-late-compiler": "/Background/3.jpg",
  about: "/Background/peakpx.jpg",
  contact: "/Background/1.jpg",
  media: "/Background/1.jpg",
  reading: "/Background/2.jpg",
  "all-posts": "/Background/peakpx.jpg",
  insights: "/Background/2.jpg",
};

export function getPageHeroBackground(page) {
  return PAGE_HERO_BACKGROUNDS[page] ?? HERO_BACKGROUNDS[0];
}
