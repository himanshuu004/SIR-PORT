"use client";
import { motion, useReducedMotion } from "motion/react";
import { SCROLL_DURATION, VARIANTS, viewport, scrollTransition } from "../lib/motion";

/**
 * Scroll-triggered reveal. Supports direction variants and optional blur.
 */
export default function Fade({
  children,
  delay = 0,
  y = 32,
  duration = SCROLL_DURATION,
  style = {},
  className = "",
  as: As = "div",
  once = true,
  amount = viewport.amount,
  margin = viewport.margin,
  direction = "up",
  blur = false,
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const variant = VARIANTS[direction] || VARIANTS.up;

  const from = prefersReduced
    ? { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }
    : {
        opacity: variant.hidden.opacity ?? 0,
        x: variant.hidden.x ?? 0,
        y: direction === "up" || direction === "down" || direction === "blur"
          ? (variant.hidden.y ?? y)
          : 0,
        scale: variant.hidden.scale ?? 1,
        filter: blur && !prefersReduced ? "blur(8px)" : "blur(0px)",
      };

  const to = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  };

  const MotionTag = motion[As] || motion.div;

  return (
    <MotionTag
      className={className}
      style={style}
      initial={from}
      whileInView={to}
      viewport={{ once, amount, margin }}
      transition={scrollTransition(delay, duration)}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
