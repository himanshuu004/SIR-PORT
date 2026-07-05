"use client";
import { motion, useReducedMotion } from "motion/react";
import { DURATION, EASE, scrollTransition } from "../lib/motion";

/**
 * Mount-time reveal — animates on first paint (hero headings, nav, etc.).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  duration = DURATION,
  style = {},
  className = "",
  as: As = "div",
}) {
  const prefersReduced = useReducedMotion();
  const MotionTag = motion[As] || motion.div;

  return (
    <MotionTag
      className={className}
      style={style}
      initial={{
        opacity: 0,
        y: prefersReduced ? 0 : y,
        x: prefersReduced ? 0 : x,
      }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={scrollTransition(delay, duration)}
    >
      {children}
    </MotionTag>
  );
}
