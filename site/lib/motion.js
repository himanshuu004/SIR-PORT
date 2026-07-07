/** Shared Motion (Framer Motion) tokens used across the site. */

export const EASE = [0.16, 1, 0.3, 1];
export const EASE_OUT = [0.22, 1, 0.36, 1];
export const DURATION = 0.9;
export const SCROLL_DURATION = 1.05;
export const DURATION_FAST = 0.45;

/** Triggers slightly before the element enters — makes scroll reveals feel longer. */
export const viewport = {
  once: true,
  amount: 0.12,
  margin: "0px 0px -12% 0px",
};

export const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -36 },
  visible: { opacity: 1, y: 0 },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

export const blurUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const staggerContainer = (stagger = 0.14, delayChildren = 0.1) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const staggerItem = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: SCROLL_DURATION, ease: EASE },
  },
};

export const scrollTransition = (delay = 0, duration = SCROLL_DURATION) => ({
  duration,
  delay,
  ease: EASE,
  opacity: { duration: duration * 1.05, ease: EASE },
  y: { duration, ease: EASE },
  x: { duration, ease: EASE },
  scale: { duration, ease: EASE },
  filter: { duration: duration * 0.9, ease: EASE },
});

export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: { y: -5, scale: 1.015 },
  tap: { scale: 0.99 },
};

export const pageEnter = {
  initial: { opacity: 1, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: -8 },
};

export const VARIANTS = {
  up: fadeUp,
  down: fadeDown,
  left: fadeLeft,
  right: fadeRight,
  scale: scaleIn,
  blur: blurUp,
};
